const fs = require('fs');
const path = require('path');

const {
  toursFile,
  seedToursFile,
  storageDir,
  uploadsDir
} = require('../config');


/*
 * Create /data and /data/uploads
 * if they do not exist.
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
 * Initialize tours.json ONLY ONCE.
 *
 * Very important:
 * Existing tours.json is never replaced
 * by the GitHub seed data.
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


    console.log(
      'Created persistent tours database from seed:',
      toursFile
    );

  }

  else {

    fs.writeFileSync(
      toursFile,
      '[]',
      'utf8'
    );


    console.log(
      'Created empty persistent tours database:',
      toursFile
    );

  }

}


/*
 * Read tours ONLY from the
 * persistent database.
 */
function readTours() {

  ensureTourFile();


  try {

    const raw =
      fs.readFileSync(
        toursFile,
        'utf8'
      );


    const data =
      JSON.parse(raw);


    if (
      !Array.isArray(data)
    ) {

      console.error(
        'Persistent tours file is not an array.'
      );


      return [];

    }


    return data;

  }

  catch (error) {

    console.error(
      'Could not read persistent tours:',
      error
    );


    return [];

  }

}


/*
 * Write tours ONLY to the
 * same persistent database.
 */
function writeTours(tours) {

  ensureTourFile();


  if (
    !Array.isArray(tours)
  ) {

    throw new Error(
      'Tours data must be an array.'
    );

  }


  /*
   * Write temporary file first.
   *
   * This protects tours.json if something
   * goes wrong halfway through writing.
   */
  const tempFile =
    `${toursFile}.tmp`;


  fs.writeFileSync(
    tempFile,
    JSON.stringify(
      tours,
      null,
      2
    ),
    'utf8'
  );


  fs.renameSync(
    tempFile,
    toursFile
  );


  console.log(
    `Saved ${tours.length} tours to ${toursFile}`
  );

}


module.exports = {

  ensureStorage,

  ensureTourFile,

  readTours,

  writeTours

};
