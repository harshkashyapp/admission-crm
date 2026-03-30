const pool = require('../../config/db');

const getDashboard = async () => {
  const { rows: intake } = await pool.query(
    `SELECT p.name AS program_name, sm.total_intake,
       COUNT(a.id) FILTER (WHERE a.admission_number IS NOT NULL) AS confirmed,
       COUNT(a.id) FILTER (WHERE a.seat_locked = true) AS allocated
     FROM seat_matrix sm
     JOIN programs p ON sm.program_id = p.id
     LEFT JOIN admissions a ON a.seat_matrix_id = sm.id
     GROUP BY p.name, sm.total_intake`
  );

  const { rows: quotas } = await pool.query(
    `SELECT qc.quota, qc.allocated,
       CASE qc.quota
         WHEN 'KCET' THEN sm.kcet_seats
         WHEN 'COMEDK' THEN sm.comedk_seats
         WHEN 'Management' THEN sm.management_seats
       END AS total,
       p.name AS program_name
     FROM quota_counters qc
     JOIN seat_matrix sm ON qc.seat_matrix_id = sm.id
     JOIN programs p ON sm.program_id = p.id`
  );

  const { rows: pendingDocs } = await pool.query(
    `SELECT COUNT(*) AS count FROM applicants WHERE doc_status != 'Verified'`
  );

  const { rows: pendingFees } = await pool.query(
    `SELECT COUNT(*) AS count FROM applicants WHERE fee_status = 'Pending'`
  );

  return {
    intake_vs_admitted: intake.map(r => ({
      program: r.program_name,
      total_intake: parseInt(r.total_intake),
      confirmed: parseInt(r.confirmed),
      allocated: parseInt(r.allocated),
      remaining: parseInt(r.total_intake) - parseInt(r.allocated),
    })),
    quota_wise_seats: quotas.map(r => ({
      program: r.program_name,
      quota: r.quota,
      total: parseInt(r.total),
      allocated: parseInt(r.allocated),
      remaining: parseInt(r.total) - parseInt(r.allocated),
    })),
    pending_documents: parseInt(pendingDocs[0].count),
    pending_fees: parseInt(pendingFees[0].count),
  };
};

module.exports = { getDashboard };