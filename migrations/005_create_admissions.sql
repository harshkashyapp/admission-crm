CREATE TABLE IF NOT EXISTS admissions (
  id SERIAL PRIMARY KEY,
  applicant_id INTEGER NOT NULL UNIQUE REFERENCES applicants(id),
  program_id INTEGER NOT NULL REFERENCES programs(id),
  quota VARCHAR(20) NOT NULL CHECK (quota IN ('KCET', 'COMEDK', 'Management')),
  seat_matrix_id INTEGER NOT NULL REFERENCES seat_matrix(id),
  admission_number VARCHAR(100) UNIQUE,
  seat_locked BOOLEAN NOT NULL DEFAULT false,
  confirmed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);