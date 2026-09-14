const fs = require('fs');
const path = require('path');

const {
  toursFile,
  seedToursFile,
  storageDir,
  uploadsDir,
  publicDir
} = require('../config');


/*
 * Create persistent storage folders.
 */
function ensureStorage() {

  fs.mkdirSync(
    storageDir,
    {
      recursive: true
    }
  );


  fs.mkdirSync(
    uploadsDir,
    {
      recursive: true
    }
  );

}


/*
 * Copy starter tours only once.
 *
 * After /data/tours.json exists,
 * it is NEVER replaced with the
 * GitHub seed file.
 */
function ensureTourFile() {

  ensureStorage();


  if (
    fs.existsSync(toursFile)
  ) {
    return;
  }


  if (
    fs.existsSync(seedToursFile)
  ) {

    fs.copyFileSync(
      seedToursFile,
      toursFile
    );

  }

  else {

    fs.writeFileSync(
      toursFile,
      '[]',
      'utf8'
    );

  }

}


/*
 * Helps migrate photos created by
 * an older version of the project.
 *
 * Old:
 * public/uploads/example.jpg
 *
 * New:
 * /data/uploads/example.jpg
 */
function migrateLegacyImages(tours) {

  const legacyUploadsDir =
    path.join(
      publicDir,
      'uploads'
    );


  if (
    !fs.existsSync(
      legacyUploadsDir
    )
  ) {
    return;
  }


  for (
    const tour of tours
  ) {

    if (
      !tour.image ||
      !tour.image.startsWith('/uploads/')
    ) {
      continue;
    }


    const fileName =
      path.basename(
        tour.image
      );


    const persistentFile =
      path.join(
        uploadsDir,
        fileName
      );


    const legacyFile =
      path.join(
        legacyUploadsDir,
        fileName
      );


    /*
     * Only copy when the persistent
     * version does not already exist.
     */
    if (
      !fs.existsSync(
        persistentFile
      )
      &&
      fs.existsSync(
        legacyFile
      )
    ) {

      try {

        fs.copyFileSync(
          legacyFile,
          persistentFile
        );

      }

      catch (error) {

        console.error(
          'Could not migrate legacy image:',
          fileName,
          error.message
        );

      }

    }

  }

}


/*
 * Read all tours.
 */
function readTours() {

  ensureTourFile();


  let raw;


  try {

    raw =
      fs.readFileSync(
        toursFile,
        'utf8'
      );

  }

  catch (error) {

    console.error(
      'Could not read tours file:',
      error
    );


    return [];

  }


  let data;


  try {

    data =
      JSON.parse(raw);

  }

  catch (error) {

    console.error(
      'Invalid tours JSON:',
      error
    );


    return [];

  }


  const tours =
    Array.isArray(data)
      ? data
      : [];


  migrateLegacyImages(
    tours
  );


  return tours;

}


/*
 * Write safely.
 *
 * First write a temporary file,
 * then replace the real file.
 *
 * This prevents tours.json from
 * becoming half-written if something
 * goes wrong during saving.
 */
function writeTours(tours) {

  ensureTourFile();


  if (
    !Array.isArray(tours)
  ) {

    throw new Error(
      'Tours must be an array.'
    );

  }


  const temporaryFile =
    `${toursFile}.tmp`;


  fs.writeFileSync(
    temporaryFile,
    JSON.stringify(
      tours,
      null,
      2
    ),
    'utf8'
  );


  fs.renameSync(
    temporaryFile,
    toursFile
  );

}


module.exports = {

  readTours,

  writeTours,

  ensureTourFile,

  ensureStorage

};
