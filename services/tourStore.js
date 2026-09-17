const fs =
    require('fs');


const {
  seedToursFile,
  storageDir,
  toursFile,
  uploadsDir
} =
    require('../config');


const {
  query,
  waitForDatabase
} =
    require('./db');


const {
  ensureMinioBucket,
  uploadImage,
  getImageStream,
  deleteImage
} =
    require('./minioStore');


const MAX_GALLERY_IMAGES =
    12;


/* =========================================================
   LEGACY LOCAL STORAGE
========================================================= */

function ensureStorage() {

  if (storageDir) {

    fs.mkdirSync(
        storageDir,
        {
          recursive: true
        }
    );

  }


  if (uploadsDir) {

    fs.mkdirSync(
        uploadsDir,
        {
          recursive: true
        }
    );

  }

}


/* =========================================================
   HELPERS
========================================================= */

function normalizeGallery(
    value
) {

  if (
      Array.isArray(value)
  ) {

    return value.map(
        (item) => ({

          id:
              Number(
                  item.id
              ),

          url:
              item.url ||
              `/api/tour-images/${item.id}`,

          sortOrder:
              Number(
                  item.sortOrder ??
                  item.sort_order ??
                  0
              )

        })
    );

  }


  if (
      typeof value ===
      'string'
  ) {

    try {

      return normalizeGallery(
          JSON.parse(value)
      );

    }

    catch (_) {

      return [];

    }

  }


  return [];
}


function mapTour(
    row
) {

  if (!row) {

    return null;

  }


  const mainImageId =
      row.main_image_id
          ? Number(
              row.main_image_id
          )
          : null;


  return {

    id:
    row.id,

    titleEn:
        row.title_en || '',

    titleKa:
        row.title_ka || '',

    descriptionEn:
        row.description_en || '',

    descriptionKa:
        row.description_ka || '',

    price:
        row.price || '',

    durationEn:
        row.duration_en || '',

    durationKa:
        row.duration_ka || '',

    /*
     * Keep the same public URL.
     *
     * Browser does not need to know
     * whether the image comes from
     * PostgreSQL or MinIO.
     */
    image:
        mainImageId
            ? `/api/tour-images/${mainImageId}`
            : (
                row.image ||
                ''
            ),

    mainImageId,

    galleryImages:
        normalizeGallery(
            row.gallery_images
        ),

    active:
        row.active !== false,

    sortOrder:
        Number(
            row.sort_order ||
            0
        ),

    createdAt:
        row.created_at
            ? new Date(
                row.created_at
            ).toISOString()
            : undefined,

    updatedAt:
        row.updated_at
            ? new Date(
                row.updated_at
            ).toISOString()
            : undefined

  };
}


function tourToParams(
    tour
) {

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

    Number.isFinite(
        Number(
            tour.sortOrder
        )
    )
        ? Number(
            tour.sortOrder
        )
        : Date.now(),

    tour.createdAt ||
    new Date()
        .toISOString(),

    tour.updatedAt ||
    new Date()
        .toISOString()

  ];

}


/* =========================================================
   LEGACY SEED TOURS
========================================================= */

function readSeedTours() {

  const sources =
      [
        toursFile,
        seedToursFile
      ];


  for (
      const filePath
      of sources
      ) {

    if (
        !filePath ||
        !fs.existsSync(
            filePath
        )
    ) {

      continue;

    }


    try {

      const data =
          JSON.parse(
              fs.readFileSync(
                  filePath,
                  'utf8'
              )
          );


      if (
          Array.isArray(data) &&
          data.length > 0
      ) {

        console.log(
            'Seeding tours from',
            filePath
        );


        return data;

      }

    }

    catch (error) {

      console.error(
          'Could not read seed tours from',
          filePath,
          error.message
      );

    }

  }


  return [];
}


/* =========================================================
   INITIALIZATION
========================================================= */

async function initTourStore() {

  ensureStorage();


  await waitForDatabase();


  /*
   * Make sure MinIO is reachable
   * before website startup finishes.
   */
  await ensureMinioBucket();


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


  /*
   * Fresh database.
   */
  await query(`
    CREATE TABLE IF NOT EXISTS tour_images (
      id BIGSERIAL PRIMARY KEY,

      tour_id TEXT NOT NULL
        REFERENCES tours(id)
        ON DELETE CASCADE,

      image_kind TEXT NOT NULL
        CHECK (
          image_kind IN (
            'main',
            'gallery'
          )
        ),

      file_name TEXT NOT NULL DEFAULT '',

      content_type TEXT NOT NULL,

      object_key TEXT NOT NULL DEFAULT '',

      image_data BYTEA,

      sort_order BIGINT NOT NULL DEFAULT 0,

      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);


  /*
   * Existing database migration.
   */
  await query(`
    ALTER TABLE tour_images
      ADD COLUMN IF NOT EXISTS
        object_key TEXT NOT NULL DEFAULT ''
  `);


  /*
   * Old database required BYTEA.
   *
   * New MinIO records leave image_data NULL.
   */
  await query(`
    ALTER TABLE tour_images
      ALTER COLUMN image_data DROP NOT NULL
  `);


  await query(`
    CREATE UNIQUE INDEX IF NOT EXISTS tour_images_one_main_idx
      ON tour_images (tour_id)
      WHERE image_kind = 'main'
  `);


  await query(`
    CREATE INDEX IF NOT EXISTS tour_images_gallery_sort_idx
      ON tour_images (
        tour_id,
        sort_order,
        id
      )
      WHERE image_kind = 'gallery'
  `);


  await query(`
    CREATE INDEX IF NOT EXISTS tour_images_object_key_idx
      ON tour_images (object_key)
      WHERE object_key <> ''
  `);


  await seedToursIfEmpty();

}


/* =========================================================
   TOUR ROWS
========================================================= */

async function insertTourRow(
    tour
) {

  await query(
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
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13
      )
    `,
      tourToParams(
          tour
      )
  );


  return getTour(
      tour.id
  );

}


async function seedToursIfEmpty() {

  const countResult =
      await query(
          `
        SELECT
          COUNT(*)::int AS count
        FROM tours
      `
      );


  if (
      countResult
          .rows[0]
          .count > 0
  ) {

    return;

  }


  const seedTours =
      readSeedTours();


  for (
      const tour
      of seedTours
      ) {

    await insertTourRow({

      ...tour,

      createdAt:
          tour.createdAt ||
          new Date()
              .toISOString(),

      updatedAt:
          tour.updatedAt ||
          new Date()
              .toISOString()

    });

  }


  console.log(
      `Loaded ${seedTours.length} tours into Postgres.`
  );

}


/* =========================================================
   TOUR SELECT
========================================================= */

const TOUR_SELECT = `
  SELECT

    t.*,

    mi.id AS main_image_id,

    COALESCE(

      jsonb_agg(

        jsonb_build_object(

          'id',
          gi.id,

          'url',
          '/api/tour-images/' || gi.id,

          'sortOrder',
          gi.sort_order

        )

        ORDER BY
          gi.sort_order ASC,
          gi.id ASC

      )

      FILTER (
        WHERE gi.id IS NOT NULL
      ),

      '[]'::jsonb

    ) AS gallery_images

  FROM tours t

  LEFT JOIN tour_images mi
    ON mi.tour_id = t.id
   AND mi.image_kind = 'main'

  LEFT JOIN tour_images gi
    ON gi.tour_id = t.id
   AND gi.image_kind = 'gallery'
`;


/* =========================================================
   LIST / GET
========================================================= */

async function listTours({
                           activeOnly = false
                         } = {}) {

  const result =
      await query(
          `
        ${TOUR_SELECT}

        WHERE (
          $1::boolean = false
          OR
          t.active = true
        )

        GROUP BY
          t.id,
          mi.id

        ORDER BY
          t.sort_order ASC,
          t.id ASC
      `,
          [
            activeOnly
          ]
      );


  return result
      .rows
      .map(
          mapTour
      );

}


async function getTour(
    id
) {

  const result =
      await query(
          `
        ${TOUR_SELECT}

        WHERE
          t.id = $1

        GROUP BY
          t.id,
          mi.id
      `,
          [
            id
          ]
      );


  return mapTour(
      result.rows[0]
  );

}


/* =========================================================
   CREATE / UPDATE TOUR
========================================================= */

async function createTour(
    tour
) {

  return insertTourRow(
      tour
  );

}


async function updateTour(
    tour
) {

  const result =
      await query(
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
          active = $9,
          sort_order = $10,
          updated_at = $11

        WHERE
          id = $1

        RETURNING id
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

            tour.active !== false,

            Number.isFinite(
                Number(
                    tour.sortOrder
                )
            )
                ? Number(
                    tour.sortOrder
                )
                : Date.now(),

            tour.updatedAt ||
            new Date()
                .toISOString()

          ]
      );


  if (
      !result.rows[0]
  ) {

    return null;

  }


  return getTour(
      tour.id
  );

}


/* =========================================================
   DELETE TOUR
========================================================= */

async function deleteTour(
    id
) {

  const current =
      await getTour(
          id
      );


  if (!current) {

    return null;

  }


  /*
   * Remember MinIO objects before
   * PostgreSQL CASCADE deletes the rows.
   */
  const imageRows =
      await query(
          `
        SELECT
          object_key

        FROM tour_images

        WHERE
          tour_id = $1
          AND
          object_key <> ''
      `,
          [
            id
          ]
      );


  await query(
      `
      DELETE FROM tours
      WHERE id = $1
    `,
      [
        id
      ]
  );


  /*
   * Delete actual objects from MinIO.
   */
  for (
      const row
      of imageRows.rows
      ) {

    await deleteImage(
        row.object_key
    );

  }


  return current;

}


/* =========================================================
   MAIN IMAGE
========================================================= */

async function replaceMainImage(
    tourId,
    file
) {

  /*
   * Upload new object first.
   *
   * If upload fails, existing main image
   * remains untouched.
   */
  const newObjectKey =
      await uploadImage(
          tourId,
          'main',
          file
      );


  let oldObjectKey =
      '';


  try {

    const oldResult =
        await query(
            `
          SELECT
            id,
            object_key

          FROM tour_images

          WHERE
            tour_id = $1
            AND
            image_kind = 'main'

          LIMIT 1
        `,
            [
              tourId
            ]
        );


    const existing =
        oldResult.rows[0];


    let imageId;


    if (existing) {

      oldObjectKey =
          existing.object_key ||
          '';


      const updated =
          await query(
              `
            UPDATE tour_images

            SET
              file_name = $2,
              content_type = $3,
              object_key = $4,
              image_data = NULL,
              sort_order = 0

            WHERE
              id = $1

            RETURNING id
          `,
              [
                existing.id,
                file.filename || '',
                file.mimeType,
                newObjectKey
              ]
          );


      imageId =
          Number(
              updated.rows[0].id
          );

    }

    else {

      const inserted =
          await query(
              `
            INSERT INTO tour_images (
              tour_id,
              image_kind,
              file_name,
              content_type,
              object_key,
              image_data,
              sort_order
            )

            VALUES (
              $1,
              'main',
              $2,
              $3,
              $4,
              NULL,
              0
            )

            RETURNING id
          `,
              [
                tourId,
                file.filename || '',
                file.mimeType,
                newObjectKey
              ]
          );


      imageId =
          Number(
              inserted.rows[0].id
          );

    }


    await query(
        `
        UPDATE tours

        SET
          image = '',
          updated_at = NOW()

        WHERE id = $1
      `,
        [
          tourId
        ]
    );


    /*
     * New DB record is now safe.
     * Remove old MinIO object afterwards.
     */
    if (
        oldObjectKey &&
        oldObjectKey !==
        newObjectKey
    ) {

      await deleteImage(
          oldObjectKey
      );

    }


    return imageId;

  }

  catch (error) {

    /*
     * Database update failed.
     * Remove the newly uploaded orphan.
     */
    await deleteImage(
        newObjectKey
    );


    throw error;

  }

}


async function removeMainImage(
    tourId
) {

  const result =
      await query(
          `
        DELETE FROM tour_images

        WHERE
          tour_id = $1
          AND
          image_kind = 'main'

        RETURNING
          object_key
      `,
          [
            tourId
          ]
      );


  const oldObjectKey =
      result.rows[0]
          ?.object_key ||
      '';


  if (oldObjectKey) {

    await deleteImage(
        oldObjectKey
    );

  }


  await query(
      `
      UPDATE tours

      SET
        image = '',
        updated_at = NOW()

      WHERE id = $1
    `,
      [
        tourId
      ]
  );


  return getTour(
      tourId
  );

}


/* =========================================================
   GALLERY
========================================================= */

async function countGalleryImages(
    tourId
) {

  const result =
      await query(
          `
        SELECT
          COUNT(*)::int AS count

        FROM tour_images

        WHERE
          tour_id = $1
          AND
          image_kind = 'gallery'
      `,
          [
            tourId
          ]
      );


  return result
      .rows[0]
      .count;

}


async function addGalleryImage(
    tourId,
    file
) {

  const count =
      await countGalleryImages(
          tourId
      );


  if (
      count >=
      MAX_GALLERY_IMAGES
  ) {

    throw new Error(
        `A tour can have at most ${MAX_GALLERY_IMAGES} catalog images.`
    );

  }


  const objectKey =
      await uploadImage(
          tourId,
          'gallery',
          file
      );


  try {

    const result =
        await query(
            `
          INSERT INTO tour_images (
            tour_id,
            image_kind,
            file_name,
            content_type,
            object_key,
            image_data,
            sort_order
          )

          VALUES (
            $1,
            'gallery',
            $2,
            $3,
            $4,
            NULL,

            COALESCE(
              (
                SELECT
                  MAX(sort_order) + 1

                FROM tour_images

                WHERE
                  tour_id = $1
                  AND
                  image_kind = 'gallery'
              ),
              0
            )
          )

          RETURNING
            id,
            sort_order
        `,
            [
              tourId,
              file.filename || '',
              file.mimeType,
              objectKey
            ]
        );


    return {

      id:
          Number(
              result.rows[0].id
          ),

      url:
          `/api/tour-images/${result.rows[0].id}`,

      sortOrder:
          Number(
              result.rows[0].sort_order ||
              0
          )

    };

  }

  catch (error) {

    /*
     * Do not leave an unused MinIO object
     * if PostgreSQL insert failed.
     */
    await deleteImage(
        objectKey
    );


    throw error;

  }

}


async function deleteGalleryImage(
    tourId,
    imageId
) {

  const result =
      await query(
          `
        DELETE FROM tour_images

        WHERE
          tour_id = $1
          AND
          id = $2
          AND
          image_kind = 'gallery'

        RETURNING
          id,
          object_key
      `,
          [
            tourId,
            imageId
          ]
      );


  const removed =
      result.rows[0];


  if (!removed) {

    return false;

  }


  if (
      removed.object_key
  ) {

    await deleteImage(
        removed.object_key
    );

  }


  return true;

}


/* =========================================================
   IMAGE DELIVERY
========================================================= */

function streamToBuffer(
    stream
) {

  return new Promise(
      (
          resolve,
          reject
      ) => {

        const chunks =
            [];


        stream.on(
            'data',
            (chunk) => {

              chunks.push(
                  Buffer.from(
                      chunk
                  )
              );

            }
        );


        stream.on(
            'end',
            () => {

              resolve(
                  Buffer.concat(
                      chunks
                  )
              );

            }
        );


        stream.on(
            'error',
            reject
        );

      }
  );

}


async function getImage(
    imageId
) {

  const result =
      await query(
          `
        SELECT
          id,
          content_type,
          object_key,
          image_data

        FROM tour_images

        WHERE
          id = $1
      `,
          [
            imageId
          ]
      );


  const row =
      result.rows[0];


  if (!row) {

    return null;

  }


  /*
   * NEW IMAGE:
   * stored in MinIO.
   */
  if (
      row.object_key
  ) {

    try {

      const stream =
          await getImageStream(
              row.object_key
          );


      const data =
          await streamToBuffer(
              stream
          );


      return {

        id:
            Number(
                row.id
            ),

        contentType:
        row.content_type,

        data

      };

    }

    catch (error) {

      console.error(
          'Could not read image from MinIO:',
          row.object_key,
          error.message
      );


      return null;

    }

  }


  /*
   * OLD IMAGE:
   * still stored in PostgreSQL BYTEA.
   *
   * This fallback prevents old photos
   * from disappearing during migration.
   */
  if (
      row.image_data
  ) {

    return {

      id:
          Number(
              row.id
          ),

      contentType:
      row.content_type,

      data:
      row.image_data

    };

  }


  return null;

}


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

  MAX_GALLERY_IMAGES,

  ensureStorage,

  initTourStore,

  listTours,

  getTour,

  createTour,

  updateTour,

  deleteTour,

  replaceMainImage,

  removeMainImage,

  addGalleryImage,

  deleteGalleryImage,

  countGalleryImages,

  getImage

};