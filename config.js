const fs = require('fs');
const path = require('path');

const root = __dirname;


/*
 * Local configuration is only used
 * when running on your computer.
 */
let localConfig = {};

const localConfigPath =
  path.join(
    root,
    'private-config.json'
  );


if (
  fs.existsSync(localConfigPath)
) {

  try {

    localConfig =
      JSON.parse(
        fs.readFileSync(
          localConfigPath,
          'utf8'
        )
      );

  }

  catch (error) {

    console.error(
      'Could not read private-config.json:',
      error.message
    );

  }

}


/*
 * Railway:
 * STORAGE_DIR=/data
 *
 * Local computer:
 * <project>/storage
 */
const storageDir =
  process.env.STORAGE_DIR
  ||
  path.join(
    root,
    'storage'
  );


module.exports = {

  root,

  port:
    Number(
      process.env.PORT
      ||
      localConfig.port
      ||
      3000
    ),

  adminUsername:
    String(
      process.env.ADMIN_USERNAME
      ||
      localConfig.adminUsername
      ||
      'owner'
    ),

  adminPassword:
    String(
      process.env.ADMIN_PASSWORD
      ||
      localConfig.adminPassword
      ||
      ''
    ),

  publicDir:
    path.join(
      root,
      'public'
    ),

  /*
   * Original data from GitHub.
   * Used ONLY once to initialize storage.
   */
  seedToursFile:
    path.join(
      root,
      'data',
      'tours.json'
    ),

  /*
   * Persistent Railway storage.
   */
  storageDir,

  toursFile:
    path.join(
      storageDir,
      'tours.json'
    ),

  uploadsDir:
    path.join(
      storageDir,
      'uploads'
    )

};
