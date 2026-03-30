const pool = require('../../config/db');

const createInstitution = async ({ name, code }) => {
  const { rows } = await pool.query(
    `INSERT INTO institutions (name, code) VALUES ($1, $2) RETURNING *`,
    [name, code]
  );
  return rows[0];
};

const getInstitutions = async () => {
  const { rows } = await pool.query(`SELECT * FROM institutions ORDER BY created_at DESC`);
  return rows;
};

const createCampus = async ({ institution_id, name, code }) => {
  const { rows } = await pool.query(
    `INSERT INTO campuses (institution_id, name, code) VALUES ($1, $2, $3) RETURNING *`,
    [institution_id, name, code]
  );
  return rows[0];
};

const getCampuses = async () => {
  const { rows } = await pool.query(
    `SELECT c.*, i.name AS institution_name FROM campuses c
     JOIN institutions i ON c.institution_id = i.id ORDER BY c.created_at DESC`
  );
  return rows;
};

const createDepartment = async ({ campus_id, name, code }) => {
  const { rows } = await pool.query(
    `INSERT INTO departments (campus_id, name, code) VALUES ($1, $2, $3) RETURNING *`,
    [campus_id, name, code]
  );
  return rows[0];
};

const getDepartments = async () => {
  const { rows } = await pool.query(
    `SELECT d.*, c.name AS campus_name FROM departments d
     JOIN campuses c ON d.campus_id = c.id ORDER BY d.created_at DESC`
  );
  return rows;
};

const createProgram = async ({ department_id, name, code, course_type, entry_type, admission_mode, academic_year }) => {
  const { rows } = await pool.query(
    `INSERT INTO programs (department_id, name, code, course_type, entry_type, admission_mode, academic_year)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [department_id, name, code, course_type, entry_type, admission_mode, academic_year]
  );
  return rows[0];
};

const getPrograms = async () => {
  const { rows } = await pool.query(
    `SELECT p.*, d.name AS department_name FROM programs p
     JOIN departments d ON p.department_id = d.id ORDER BY p.created_at DESC`
  );
  return rows;
};

module.exports = {
  createInstitution, getInstitutions,
  createCampus, getCampuses,
  createDepartment, getDepartments,
  createProgram, getPrograms,
};