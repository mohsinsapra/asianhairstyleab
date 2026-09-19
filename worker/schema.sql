-- D1 schema for asianhairstyleab.se bookings.
-- Apply with:  npx wrangler d1 execute ahab-bookings --remote --file=./schema.sql

CREATE TABLE IF NOT EXISTS bookings (
  id                TEXT PRIMARY KEY,
  service_id        TEXT    NOT NULL,
  service_name      TEXT    NOT NULL,
  -- Stockholm wall clock. start_min/end_min are minutes from local midnight,
  -- which is what all the availability maths works in.
  date              TEXT    NOT NULL,
  start_min         INTEGER NOT NULL,
  end_min           INTEGER NOT NULL,
  -- The same moment as a UTC instant, for calendar exports and sorting.
  start_utc         TEXT    NOT NULL,
  end_utc           TEXT    NOT NULL,
  duration          INTEGER NOT NULL,
  price             INTEGER NOT NULL,
  customer_name     TEXT    NOT NULL,
  customer_phone    TEXT    NOT NULL,
  customer_email    TEXT,
  notes             TEXT,
  lang              TEXT    NOT NULL DEFAULT 'sv',
  status            TEXT    NOT NULL DEFAULT 'confirmed',
  calendar_event_id TEXT,
  created_at        TEXT    NOT NULL,
  client_hash       TEXT
);

-- The hot path: "what is booked on this day?"
CREATE INDEX IF NOT EXISTS idx_bookings_date   ON bookings (date, status);
CREATE INDEX IF NOT EXISTS idx_bookings_start  ON bookings (start_utc);
-- Used by the rate limiter.
CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings (client_hash, created_at);

-- Small key/value cache. Currently used to hold the Google reviews response so
-- the Places API is called once a day rather than once a visitor.
CREATE TABLE IF NOT EXISTS cache (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  fetched_at TEXT NOT NULL
);
