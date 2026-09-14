const crypto =
  require('crypto');

const fs =
  require('fs');

const path =
  require('path');


const {
  uploadsDir
} =
  require('../config');


const {
  readBody
} =
  require('../lib/http');


const MAX_IMAGE_BYTES =
  6 * 1024 * 1024;


const MAX_MULTIPART_BYTES =
  7 * 1024 * 1024;


const allowed = {

  'image/jpeg': {

    ext:
      '.jpg',

    check:
      (buffer) =>
        buffer.length > 3 &&
        buffer[0] === 0xff &&
        buffer[1] === 0xd8 &&
        buffer[2] === 0xff

  },


  'image/png': {

    ext:
      '.png',

    check:
      (buffer) =>
        buffer.length > 8
        &&
        buffer
          .slice(
            0,
            8
          )
          .equals(
            Buffer.from([
              0x89,
              0x50,
              0x4e,
              0x47,
              0x0d,
              0x0a,
              0x1a,
              0x0a
            ])
          )

  },


  'image/webp': {

    ext:
      '.webp',

    check:
      (buffer) =>
        buffer.length > 12
        &&
        buffer
          .slice(
            0,
            4
          )
          .toString() ===
          'RIFF'
        &&
        buffer
          .slice(
            8,
            12
          )
          .toString() ===
          'WEBP'

  }

};


function boundaryFromContentType(
  contentType = ''
) {

  const match =
    /boundary=(?:"([^"]+)"|([^;]+))/i
      .exec(
        contentType
      );


  const value =
    match?.[1] ||
    match?.[2];


  if (!value) {

    throw new Error(
      'Invalid upload request.'
    );

  }


  return (
    `--${value}`
  );

}


function parseMultipartForm(
  buffer,
  contentType
) {

  const boundary =
    boundaryFromContentType(
      contentType
    );


  const raw =
    buffer.toString(
      'latin1'
    );


  const parts =
    raw
      .split(
        boundary
      )
      .slice(
        1,
        -1
      );


  const fields =
    {};


  let image =
    null;


  for (
    let part of parts
  ) {

    if (
      part.startsWith(
        '\r\n'
      )
    ) {

      part =
        part.slice(2);

    }


    if (
      part.endsWith(
        '\r\n'
      )
    ) {

      part =
        part.slice(
          0,
          -2
        );

    }


    const separator =
      part.indexOf(
        '\r\n\r\n'
      );


    if (
      separator === -1
    ) {

      continue;

    }


    const headersText =
      part.slice(
        0,
        separator
      );


    let contentText =
      part.slice(
        separator + 4
      );


    if (
      contentText.endsWith(
        '\r\n'
      )
    ) {

      contentText =
        contentText.slice(
          0,
          -2
        );

    }


    const nameMatch =
      /name="([^"]+)"/i
        .exec(
          headersText
        );


    const filenameMatch =
      /filename="([^"]*)"/i
        .exec(
          headersText
        );


    const typeMatch =
      /Content-Type:\s*([^\r\n]+)/i
        .exec(
          headersText
        );


    const name =
      nameMatch?.[1];


    if (!name) {

      continue;

    }


    if (
      filenameMatch
    ) {

      if (
        name === 'image'
        &&
        filenameMatch[1]
      ) {

        image = {

          filename:
            filenameMatch[1],

          mimeType:
            (
              typeMatch?.[1]
              ||
              ''
            )
              .trim()
              .toLowerCase(),

          data:
            Buffer.from(
              contentText,
              'latin1'
            )

        };

      }

    }

    else {

      fields[name] =
        Buffer
          .from(
            contentText,
            'latin1'
          )
          .toString(
            'utf8'
          );

    }

  }


  return {
    fields,
    image
  };

}


function validateAndSaveImage(
  file
) {

  if (!file) {

    throw new Error(
      'Please choose a tour photo.'
    );

  }


  const rule =
    allowed[
      file.mimeType
    ];


  if (!rule) {

    throw new Error(
      'Only JPG, PNG and WEBP images are allowed.'
    );

  }


  if (
    file.data.length >
    MAX_IMAGE_BYTES
  ) {

    throw new Error(
      'Image must be 6 MB or smaller.'
    );

  }


  if (
    !rule.check(
      file.data
    )
  ) {

    throw new Error(
      'The uploaded image file is invalid.'
    );

  }


  fs.mkdirSync(
    uploadsDir,
    {
      recursive: true
    }
  );


  /*
   * Always create a new unique filename.
   *
   * This prevents browser/CDN caching
   * from showing an old replaced photo.
   */
  const fileName =
    `${Date.now()}-` +
    `${crypto.randomBytes(12).toString('hex')}` +
    `${rule.ext}`;


  const fullPath =
    path.join(
      uploadsDir,
      fileName
    );


  fs.writeFileSync(
    fullPath,
    file.data
  );


  return {

    fileName,

    publicPath:
      `/uploads/${fileName}`,

    fullPath

  };

}


async function readMultipartRequest(
  req
) {

  const contentType =
    String(
      req.headers[
        'content-type'
      ] || ''
    );


  if (
    !contentType
      .toLowerCase()
      .startsWith(
        'multipart/form-data'
      )
  ) {

    throw new Error(
      'Expected multipart form data.'
    );

  }


  const body =
    await readBody(
      req,
      MAX_MULTIPART_BYTES
    );


  return parseMultipartForm(
    body,
    contentType
  );

}


async function saveUploadedImage(
  req
) {

  const parsed =
    await readMultipartRequest(
      req
    );


  return validateAndSaveImage(
    parsed.image
  );

}


async function readTourWithImage(
  req
) {

  const parsed =
    await readMultipartRequest(
      req
    );


  const uploaded =
    validateAndSaveImage(
      parsed.image
    );


  return {

    fields:
      parsed.fields,

    uploaded

  };

}


module.exports = {

  saveUploadedImage,

  readTourWithImage

};
