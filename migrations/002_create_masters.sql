CREATE TABLE IF NOT EXISTS institutions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campuses (
  id SERIAL PRIMARY KEY,
  institution_id INTEGER NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  campus_id INTEGER NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS programs (
  id SERIAL PRIMARY KEY,
  department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(20) NOT NULL,
  course_type VARCHAR(10) NOT NULL CHECK (course_type IN ('UG', 'PG')),
  entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('Regular', 'Lateral')),
  admission_mode VARCHAR(20) NOT NULL CHECK (admission_mode IN ('Government', 'Management')),
  academic_year VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);