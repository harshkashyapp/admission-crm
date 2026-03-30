const Joi = require('joi');
const service = require('./applicant.service');

const createSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(15).required(),
  dob: Joi.date().required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  category: Joi.string().valid('GM', 'SC', 'ST', 'OBC').required(),
  entry_type: Joi.string().valid('Regular', 'Lateral').required(),
  quota_type: Joi.string().valid('KCET', 'COMEDK', 'Management').required(),
  allotment_number: Joi.string().allow(null, '').optional(),
  program_id: Joi.number().integer().required(),
  marks: Joi.number().min(0).max(100).required(),
  qualifying_exam: Joi.string().required(),
});

const docStatusSchema = Joi.object({
  doc_status: Joi.string().valid('Pending', 'Submitted', 'Verified').required(),
});

const feeStatusSchema = Joi.object({
  fee_status: Joi.string().valid('Pending', 'Paid').required(),
});

const createApplicant = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const result = await service.createApplicant(value);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getApplicants = async (req, res, next) => {
  try {
    const result = await service.getApplicants();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getApplicantById = async (req, res, next) => {
  try {
    const result = await service.getApplicantById(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const updateDocStatus = async (req, res, next) => {
  try {
    const { error, value } = docStatusSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const result = await service.updateDocStatus(req.params.id, value.doc_status);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const updateFeeStatus = async (req, res, next) => {
  try {
    const { error, value } = feeStatusSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const result = await service.updateFeeStatus(req.params.id, value.fee_status);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { createApplicant, getApplicants, getApplicantById, updateDocStatus, updateFeeStatus };