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
);

CREATE INDEX IF NOT EXISTS tours_sort_order_idx
  ON tours (sort_order);


CREATE TABLE IF NOT EXISTS tour_images (
  id BIGSERIAL PRIMARY KEY,

  tour_id TEXT NOT NULL
    REFERENCES tours(id)
    ON DELETE CASCADE,

  image_kind TEXT NOT NULL
    CHECK (image_kind IN ('main', 'gallery')),

  file_name TEXT NOT NULL DEFAULT '',

  content_type TEXT NOT NULL,

  image_data BYTEA NOT NULL,

  sort_order BIGINT NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE UNIQUE INDEX IF NOT EXISTS tour_images_one_main_idx
  ON tour_images (tour_id)
  WHERE image_kind = 'main';


CREATE INDEX IF NOT EXISTS tour_images_gallery_sort_idx
  ON tour_images (tour_id, sort_order, id)
  WHERE image_kind = 'gallery';
