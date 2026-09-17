const crypto =
  require('crypto');


const Minio =
  require('minio');


const {
  minioEndpoint,
  minioPort,
  minioUseSSL,
  minioAccessKey,
  minioSecretKey,
  minioBucket
} =
  require('../config');


/* =========================================================
   MINIO CLIENT
========================================================= */

const minioClient =
  new Minio.Client({

    endPoint:
      minioEndpoint,

    port:
      minioPort,

    useSSL:
      minioUseSSL,

    accessKey:
      minioAccessKey,

    secretKey:
      minioSecretKey

  });


/* =========================================================
   BUCKET
========================================================= */

async function ensureMinioBucket() {

  const exists =
    await minioClient.bucketExists(
      minioBucket
    );


  if (
    !exists
  ) {

    await minioClient.makeBucket(
      minioBucket,
      'us-east-1'
    );


    console.log(
      `Created MinIO bucket: ${minioBucket}`
    );

  }


  return true;
}


/* =========================================================
   FILE NAME HELPERS
========================================================= */

function safePart(
  value
) {

  return String(
    value || ''
  )
    .trim()
    .toLowerCase()
    .replace(
      /[^a-z0-9._-]+/g,
      '-'
    )
    .replace(
      /^[-.]+|[-.]+$/g,
      ''
    )
    ||
    'file';

}


function extensionFromContentType(
  contentType
) {

  switch (
    String(contentType)
      .toLowerCase()
  ) {

    case 'image/jpeg':
      return '.jpg';

    case 'image/png':
      return '.png';

    case 'image/webp':
      return '.webp';

    default:
      return '';

  }

}


function createObjectKey(
  tourId,
  imageKind,
  image
) {

  const safeTourId =
    safePart(
      tourId
    );


  const safeKind =
    imageKind === 'main'
      ? 'main'
      : 'gallery';


  const originalName =
    safePart(
      image?.filename ||
      ''
    );


  const originalExtension =
    originalName.includes('.')
      ? `.${originalName.split('.').pop()}`
      : '';


  const extension =
    originalExtension
    ||
    extensionFromContentType(
      image?.mimeType
    );


  const uniqueId =
    crypto
      .randomUUID();


  return (
    `tours/`
    +
    `${safeTourId}/`
    +
    `${safeKind}/`
    +
    `${uniqueId}${extension}`
  );

}


/* =========================================================
   UPLOAD
========================================================= */

async function uploadImage(
  tourId,
  imageKind,
  image
) {

  if (
    !image ||
    !Buffer.isBuffer(
      image.data
    )
  ) {

    throw new Error(
      'Image data is missing.'
    );

  }


  if (
    imageKind !== 'main' &&
    imageKind !== 'gallery'
  ) {

    throw new Error(
      'Invalid image kind.'
    );

  }


  await ensureMinioBucket();


  const objectKey =
    createObjectKey(
      tourId,
      imageKind,
      image
    );


  await minioClient.putObject(

    minioBucket,

    objectKey,

    image.data,

    image.data.length,

    {
      'Content-Type':
        image.mimeType
        ||
        'application/octet-stream'
    }

  );


  return objectKey;
}


/* =========================================================
   GET IMAGE
========================================================= */

async function getImageStream(
  objectKey
) {

  if (
    !objectKey
  ) {

    throw new Error(
      'Object key is missing.'
    );

  }


  return minioClient.getObject(
    minioBucket,
    objectKey
  );

}


/* =========================================================
   IMAGE INFO
========================================================= */

async function statImage(
  objectKey
) {

  if (
    !objectKey
  ) {

    return null;

  }


  try {

    return await minioClient.statObject(
      minioBucket,
      objectKey
    );

  }

  catch (error) {

    if (
      error.code === 'NotFound'
      ||
      error.code === 'NoSuchKey'
    ) {

      return null;

    }


    throw error;

  }

}


/* =========================================================
   DELETE IMAGE
========================================================= */

async function deleteImage(
  objectKey
) {

  if (
    !objectKey
  ) {

    return false;

  }


  try {

    await minioClient.removeObject(
      minioBucket,
      objectKey
    );


    return true;

  }

  catch (error) {

    console.error(
      'Could not delete MinIO object:',
      objectKey,
      error.message
    );


    return false;

  }

}


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

  minioClient,

  ensureMinioBucket,

  createObjectKey,

  uploadImage,

  getImageStream,

  statImage,

  deleteImage

};