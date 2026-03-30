const pool = require('../../config/db');

const allocateSeat = async ({ applicant_id, program_id, quota, seat_matrix_id }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: counterRows } = await client.query(
      `SELECT qc.*, sm.kcet_seats, sm.comedk_seats, sm.management_seats
       FROM quota_counters qc
       JOIN seat_matrix sm ON qc.seat_matrix_id = sm.id
       WHERE qc.seat_matrix_id = $1 AND qc.quota = $2
       FOR UPDATE`,
      [seat_matrix_id, quota]
    );

    if (!counterRows.length) throw { status: 404, message: 'Quota not found' };

    const counter = counterRows[0];
    const quotaSeatsMap = {
      KCET: counter.kcet_seats,
      COMEDK: counter.comedk_seats,
      Management: counter.management_seats,
    };

    if (counter.allocated >= quotaSeatsMap[quota]) {
      throw { status: 409, message: `No seats available in ${quota} quota` };
    }

    await client.query(
      `UPDATE quota_counters SET allocated = allocated + 1 WHERE seat_matrix_id = $1 AND quota = $2`,
      [seat_matrix_id, quota]
    );

    const { rows } = await client.query(
      `INSERT INTO admissions (applicant_id, program_id, quota, seat_matrix_id, seat_locked)
       VALUES ($1, $2, $3, $4, true) RETURNING *`,
      [applicant_id, program_id, quota, seat_matrix_id]
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getAdmissionByApplicant = async (applicant_id) => {
  const { rows } = await pool.query(
    `SELECT a.*, p.name AS program_name, p.code AS program_code,
            p.course_type, i.code AS institution_code, p.academic_year
     FROM admissions a
     JOIN programs p ON a.program_id = p.id
     JOIN departments d ON p.department_id = d.id
     JOIN campuses c ON d.campus_id = c.id
     JOIN institutions i ON c.institution_id = i.id
     WHERE a.applicant_id = $1`,
    [applicant_id]
  );
  return rows[0];
};

const confirmAdmission = async (applicant_id, admission_number) => {
  const { rows } = await pool.query(
    `UPDATE admissions SET admission_number = $1, confirmed_at = NOW()
     WHERE applicant_id = $2 AND admission_number IS NULL
     RETURNING *`,
    [admission_number, applicant_id]
  );
  return rows[0];
};

const getSequenceForQuota = async (program_id, quota) => {
  const { rows } = await pool.query(
    `SELECT COUNT(*) AS count FROM admissions
     WHERE program_id = $1 AND quota = $2 AND admission_number IS NOT NULL`,
    [program_id, quota]
  );
  return parseInt(rows[0].count) + 1;
};

module.exports = { allocateSeat, getAdmissionByApplicant, confirmAdmission, getSequenceForQuota };