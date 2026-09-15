const fs = require('fs');
const path = require('path');

const root = __dirname;


function loadEnvFile() {
  const envPath = path.join(root, '.env');

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separator = trimmed.indexOf('=');

    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}


loadEnvFile();


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

  databaseUrl:
    String(
      process.env.DATABASE_URL
      ||
      localConfig.databaseUrl
      ||
      'postgres://esttravel:esttravel@localhost:5432/esttravel'
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
