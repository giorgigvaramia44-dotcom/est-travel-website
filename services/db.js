const { Pool } = require('pg');

const { databaseUrl } = require('../config');

const pool = new Pool({
  connectionString: databaseUrl
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function query(text, params) {
  return pool.query(text, params);
}

async function waitForDatabase(retries = 30) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (error) {
      lastError = error;
      console.log(
        `Waiting for Postgres (${attempt}/${retries})...`
      );
      await sleep(1000);
    }
  }

  throw new Error(
    'Could not connect to Postgres. Start it with ' +
      '`docker compose up -d` and check DATABASE_URL. ' +
      (lastError ? lastError.message : '')
  );
}

async function closeDatabase() {
  await pool.end();
}

module.exports = {
  pool,
  query,
  waitForDatabase,
  closeDatabase
};
