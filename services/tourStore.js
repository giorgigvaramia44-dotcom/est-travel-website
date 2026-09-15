const fs = require('fs');

const {
  seedToursFile,
  storageDir,
  toursFile,
  uploadsDir
} = require('../config');

const { query, waitForDatabase } = require('./db');

function ensureStorage() {
  fs.mkdirSync(storageDir, { recursive: true });
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function mapTour(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    titleEn: row.title_en || '',
    titleKa: row.title_ka || '',
    descriptionEn: row.description_en || '',
    descriptionKa: row.description_ka || '',
    price: row.price || '',
    durationEn: row.duration_en || '',
    durationKa: row.duration_ka || '',
    image: row.image || '',
    active: row.active !== false,
    sortOrder: Number(row.sort_order || 0),
    createdAt: row.created_at
      ? new Date(row.created_at).toISOString()
      : undefined,
    updatedAt: row.updated_at
      ? new Date(row.updated_at).toISOString()
      : undefined
  };
}

function tourToParams(tour) {
  return [
    tour.id,
    tour.titleEn || '',
    tour.titleKa || '',
    tour.descriptionEn || '',
    tour.descriptionKa || '',
    tour.price || '',
    tour.durationEn || '',
    tour.durationKa || '',
    tour.image || '',
    tour.active !== false,
    Number.isFinite(Number(tour.sortOrder))
      ? Number(tour.sortOrder)
      : Date.now(),
    tour.createdAt || new Date().toISOString(),
    tour.updatedAt || new Date().toISOString()
  ];
}

function readSeedTours() {
  const sources = [toursFile, seedToursFile];

  for (const filePath of sources) {
    if (!fs.existsSync(filePath)) {
      continue;
    }

    try {
      const data = JSON.parse(
        fs.readFileSync(filePath, 'utf8')
      );

      if (Array.isArray(data) && data.length > 0) {
        console.log('Seeding tours from', filePath);
        return data;
      }
    } catch (error) {
      console.error(
        'Could not read seed tours from',
        filePath,
        error.message
      );
    }
  }

  return [];
}

async function insertTourRow(tour) {
  const result = await query(
    `
    INSERT INTO tours (
      id,
      title_en,
      title_ka,
      description_en,
      description_ka,
      price,
      duration_en,
      duration_ka,
      image,
      active,
      sort_order,
      created_at,
      updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
    )
    RETURNING *
    `,
    tourToParams(tour)
  );

  return mapTour(result.rows[0]);
}

async function seedToursIfEmpty() {
  const countResult = await query(
    'SELECT COUNT(*)::int AS count FROM tours'
  );

  if (countResult.rows[0].count > 0) {
    return;
  }

  const seedTours = readSeedTours();

  for (const tour of seedTours) {
    await insertTourRow({
      ...tour,
      createdAt: tour.createdAt || new Date().toISOString(),
      updatedAt: tour.updatedAt || new Date().toISOString()
    });
  }

  console.log(
    `Loaded ${seedTours.length} tours into Postgres.`
  );
}

async function initTourStore() {
  ensureStorage();
  await waitForDatabase();
  await query(`
CREATE TABLE IF NOT EXISTS tours (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL DEFAULT '',
  title_ka TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  description_ka TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  duration_en TEXT NOT NULL DEFAULT '',
  duration_ka TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)
  `);

  await query(`
CREATE INDEX IF NOT EXISTS tours_sort_order_idx
  ON tours (sort_order)
  `);
  await seedToursIfEmpty();
}

async function listTours({ activeOnly = false } = {}) {
  const result = await query(
    `
    SELECT *
    FROM tours
    WHERE ($1::boolean = false OR active = true)
    ORDER BY sort_order ASC, id ASC
    `,
    [activeOnly]
  );

  return result.rows.map(mapTour);
}

async function getTour(id) {
  const result = await query(
    'SELECT * FROM tours WHERE id = $1',
    [id]
  );

  return mapTour(result.rows[0]);
}

async function createTour(tour) {
  return insertTourRow(tour);
}

async function updateTour(tour) {
  const result = await query(
    `
    UPDATE tours
    SET
      title_en = $2,
      title_ka = $3,
      description_en = $4,
      description_ka = $5,
      price = $6,
      duration_en = $7,
      duration_ka = $8,
      image = $9,
      active = $10,
      sort_order = $11,
      updated_at = $12
    WHERE id = $1
    RETURNING *
    `,
    [
      tour.id,
      tour.titleEn || '',
      tour.titleKa || '',
      tour.descriptionEn || '',
      tour.descriptionKa || '',
      tour.price || '',
      tour.durationEn || '',
      tour.durationKa || '',
      tour.image || '',
      tour.active !== false,
      Number.isFinite(Number(tour.sortOrder))
        ? Number(tour.sortOrder)
        : Date.now(),
      tour.updatedAt || new Date().toISOString()
    ]
  );

  return mapTour(result.rows[0]);
}

async function deleteTour(id) {
  const result = await query(
    'DELETE FROM tours WHERE id = $1 RETURNING *',
    [id]
  );

  return mapTour(result.rows[0]);
}

module.exports = {
  ensureStorage,
  initTourStore,
  listTours,
  getTour,
  createTour,
  updateTour,
  deleteTour
};
