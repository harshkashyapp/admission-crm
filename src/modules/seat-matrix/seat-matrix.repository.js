const pool = require('../../config/db');

const createSeatMatrix = async ({ program_id, total_intake, kcet_seats, comedk_seats, management_seats, supernumerary_seats }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO seat_matrix (program_id, total_intake, kcet_seats, comedk_seats, management_seats, supernumerary_seats)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [program_id, total_intake, kcet_seats, comedk_seats, management_seats, supernumerary_seats]
    );

    const matrix = rows[0];

    const quotas = [
      { quota: 'KCET', seats: kcet_seats },
      { quota: 'COMEDK', seats: comedk_seats },
      { quota: 'Management', seats: management_seats },
    ];

    for (const q of quotas) {
      await client.query(
        `INSERT INTO quota_counters (seat_matrix_id, quota, allocated) VALUES ($1, $2, 0)`,
        [matrix.id, q.quota]
      );
    }

    await client.query('COMMIT');
    return matrix;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getSeatMatrixByProgram = async (program_id) => {
  const { rows } = await pool.query(
    `SELECT sm.*, 
      json_agg(json_build_object('quota', qc.quota, 'allocated', qc.allocated)) AS quota_counters
     FROM seat_matrix sm
     JOIN quota_counters qc ON qc.seat_matrix_id = sm.id
     WHERE sm.program_id = $1
     GROUP BY sm.id`,
    [program_id]
  );
  return rows[0];
};

module.exports = { createSeatMatrix, getSeatMatrixByProgram };