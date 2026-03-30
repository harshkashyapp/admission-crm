const pool = require('../../config/db');

const createApplicant = async (data) => {
  const {
    first_name, last_name, email, phone, dob, gender,
    category, entry_type, quota_type, allotment_number,
    program_id, marks, qualifying_exam
  } = data;

  const { rows } = await pool.query(
    `INSERT INTO applicants 
      (first_name, last_name, email, phone, dob, gender, category, entry_type, quota_type, allotment_number, program_id, marks, qualifying_exam)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING *`,
    [first_name, last_name, email, phone, dob, gender, category, entry_type, quota_type, allotment_number, program_id, marks, qualifying_exam]
  );
  return rows[0];
};

const getApplicants = async () => {
  const { rows } = await pool.query(
    `SELECT a.*, p.name AS program_name FROM applicants a
     JOIN programs p ON a.program_id = p.id
     ORDER BY a.created_at DESC`
  );
  return rows;
};

const getApplicantById = async (id) => {
  const { rows } = await pool.query(
    `SELECT a.*, p.name AS program_name FROM applicants a
     JOIN programs p ON a.program_id = p.id
     WHERE a.id = $1`,
    [id]
  );
  return rows[0];
};

const updateDocStatus = async (id, doc_status) => {
  const { rows } = await pool.query(
    `UPDATE applicants SET doc_status = $1 WHERE id = $2 RETURNING *`,
    [doc_status, id]
  );
  return rows[0];
};

const updateFeeStatus = async (id, fee_status) => {
  const { rows } = await pool.query(
    `UPDATE applicants SET fee_status = $1 WHERE id = $2 RETURNING *`,
    [fee_status, id]
  );
  return rows[0];
};

module.exports = { createApplicant, getApplicants, getApplicantById, updateDocStatus, updateFeeStatus };