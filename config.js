const fs = require('fs');
const path = require('path');

const root = __dirname;


/* =========================================================
   LOAD .ENV
========================================================= */

function loadEnvFile() {

  const envPath =
      path.join(
          root,
          '.env'
      );


  if (
      !fs.existsSync(envPath)
  ) {

    return;

  }


  const lines =
      fs
          .readFileSync(
              envPath,
              'utf8'
          )
          .split(/\r?\n/);


  for (
      const line
      of lines
      ) {

    const trimmed =
        line.trim();


    if (
        !trimmed ||
        trimmed.startsWith('#')
    ) {

      continue;

    }


    const separator =
        trimmed.indexOf('=');


    if (
        separator === -1
    ) {

      continue;

    }


    const key =
        trimmed
            .slice(
                0,
                separator
            )
            .trim();


    let value =
        trimmed
            .slice(
                separator + 1
            )
            .trim();


    if (
        (
            value.startsWith('"') &&
            value.endsWith('"')
        )
        ||
        (
            value.startsWith("'") &&
            value.endsWith("'")
        )
    ) {

      value =
          value.slice(
              1,
              -1
          );

    }


    if (
        process.env[key] ===
        undefined
    ) {

      process.env[key] =
          value;

    }

  }

}


loadEnvFile();


/* =========================================================
   OPTIONAL LOCAL CONFIG
========================================================= */

let localConfig = {};


const localConfigPath =
    path.join(
        root,
        'private-config.json'
    );


if (
    fs.existsSync(
        localConfigPath
    )
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


/* =========================================================
   HELPERS
========================================================= */

function envBoolean(
    value,
    fallback = false
) {

  if (
      value === undefined ||
      value === null ||
      value === ''
  ) {

    return fallback;

  }


  return (
      String(value)
          .toLowerCase() ===
      'true'
  );

}


/* =========================================================
   LOCAL / LEGACY STORAGE
========================================================= */

const storageDir =
    process.env.STORAGE_DIR
    ||
    path.join(
        root,
        'storage'
    );


/* =========================================================
   EXPORT CONFIG
========================================================= */

module.exports = {

  root,


  /* -------------------------
     WEBSITE
  ------------------------- */

  port:
      Number(
          process.env.PORT
          ||
          localConfig.port
          ||
          3000
      ),


  /* -------------------------
     ADMIN
  ------------------------- */

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


  /* -------------------------
     POSTGRESQL
  ------------------------- */

  databaseUrl:
      String(
          process.env.DATABASE_URL
          ||
          localConfig.databaseUrl
          ||
          'postgres://esttravel:esttravel@localhost:5432/esttravel'
      ),


  /* -------------------------
     MINIO
  ------------------------- */

  minioEndpoint:
      String(
          process.env.MINIO_ENDPOINT
          ||
          localConfig.minioEndpoint
          ||
          'localhost'
      ),

  minioPort:
      Number(
          process.env.MINIO_PORT
          ||
          localConfig.minioPort
          ||
          9000
      ),

  minioUseSSL:
      envBoolean(
          process.env.MINIO_USE_SSL,
          false
      ),

  minioAccessKey:
      String(
          process.env.MINIO_ACCESS_KEY
          ||
          localConfig.minioAccessKey
          ||
          ''
      ),

  minioSecretKey:
      String(
          process.env.MINIO_SECRET_KEY
          ||
          localConfig.minioSecretKey
          ||
          ''
      ),

  minioBucket:
      String(
          process.env.MINIO_BUCKET
          ||
          localConfig.minioBucket
          ||
          'est-travel'
      ),


  /* -------------------------
     PUBLIC DIRECTORY
  ------------------------- */

  publicDir:
      path.join(
          root,
          'public'
      ),


  /* -------------------------
     LEGACY / SEED STORAGE
  ------------------------- */

  seedToursFile:
      path.join(
          root,
          'data',
          'tours.json'
      ),

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