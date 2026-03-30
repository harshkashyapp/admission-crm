const repo = require('./applicant.repository');

const createApplicant = async (data) => repo.createApplicant(data);

const getApplicants = async () => repo.getApplicants();

const getApplicantById = async (id) => {
  const applicant = await repo.getApplicantById(id);
  if (!applicant) throw { status: 404, message: 'Applicant not found' };
  return applicant;
};

const updateDocStatus = async (id, doc_status) => {
  const applicant = await repo.updateDocStatus(id, doc_status);
  if (!applicant) throw { status: 404, message: 'Applicant not found' };
  return applicant;
};

const updateFeeStatus = async (id, fee_status) => {
  const applicant = await repo.updateFeeStatus(id, fee_status);
  if (!applicant) throw { status: 404, message: 'Applicant not found' };
  return applicant;
};

module.exports = { createApplicant, getApplicants, getApplicantById, updateDocStatus, updateFeeStatus };