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
