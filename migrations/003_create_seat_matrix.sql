CREATE TABLE IF NOT EXISTS seat_matrix (
  id SERIAL PRIMARY KEY,
  program_id INTEGER NOT NULL UNIQUE REFERENCES programs(id) ON DELETE CASCADE,
  total_intake INTEGER NOT NULL,
  kcet_seats INTEGER NOT NULL DEFAULT 0,
  comedk_seats INTEGER NOT NULL DEFAULT 0,
  management_seats INTEGER NOT NULL DEFAULT 0,
  supernumerary_seats INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT quota_sum_check CHECK (kcet_seats + comedk_seats + management_seats = total_intake)
);

CREATE TABLE IF NOT EXISTS quota_counters (
  id SERIAL PRIMARY KEY,
  seat_matrix_id INTEGER NOT NULL REFERENCES seat_matrix(id) ON DELETE CASCADE,
  quota VARCHAR(20) NOT NULL CHECK (quota IN ('KCET', 'COMEDK', 'Management')),
  allocated INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(seat_matrix_id, quota)
);