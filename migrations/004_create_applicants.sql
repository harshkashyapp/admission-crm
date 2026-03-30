CREATE TABLE IF NOT EXISTS applicants (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(15) NOT NULL,
  dob DATE NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  category VARCHAR(10) NOT NULL CHECK (category IN ('GM', 'SC', 'ST', 'OBC')),
  entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('Regular', 'Lateral')),
  quota_type VARCHAR(20) NOT NULL CHECK (quota_type IN ('KCET', 'COMEDK', 'Management')),
  allotment_number VARCHAR(50),
  program_id INTEGER NOT NULL REFERENCES programs(id),
  marks NUMERIC(5,2) NOT NULL,
  qualifying_exam VARCHAR(100) NOT NULL,
  doc_status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (doc_status IN ('Pending', 'Submitted', 'Verified')),
  fee_status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (fee_status IN ('Pending', 'Paid')),
  created_at TIMESTAMP DEFAULT NOW()
);