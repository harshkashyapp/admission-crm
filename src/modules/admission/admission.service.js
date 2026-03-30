const repo = require('./admission.repository');
const applicantRepo = require('../applicant/applicant.repository');
const seatMatrixRepo = require('../seat-matrix/seat-matrix.repository');

const allocateSeat = async ({ applicant_id, seat_matrix_id }) => {
  const applicant = await applicantRepo.getApplicantById(applicant_id);
  if (!applicant) throw { status: 404, message: 'Applicant not found' };

  const existing = await repo.getAdmissionByApplicant(applicant_id);
  if (existing) throw { status: 409, message: 'Seat already allocated for this applicant' };

  return repo.allocateSeat({
    applicant_id,
    program_id: applicant.program_id,
    quota: applicant.quota_type,
    seat_matrix_id,
  });
};

const confirmAdmission = async (applicant_id) => {
  const applicant = await applicantRepo.getApplicantById(applicant_id);
  if (!applicant) throw { status: 404, message: 'Applicant not found' };
  if (applicant.fee_status !== 'Paid') throw { status: 400, message: 'Fee must be paid before confirming admission' };

  const admission = await repo.getAdmissionByApplicant(applicant_id);
  if (!admission) throw { status: 404, message: 'No seat allocated for this applicant' };
  if (admission.admission_number) throw { status: 409, message: 'Admission already confirmed' };

  const seq = await repo.getSequenceForQuota(admission.program_id, admission.quota);
  const padded = String(seq).padStart(4, '0');
  const admission_number = `${admission.institution_code}/${admission.academic_year.split('-')[0]}/${admission.course_type}/${admission.program_code}/${admission.quota}/${padded}`;

  return repo.confirmAdmission(applicant_id, admission_number);
};

module.exports = { allocateSeat, confirmAdmission };