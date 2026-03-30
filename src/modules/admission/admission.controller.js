const Joi = require('joi');
const service = require('./admission.service');

const allocateSchema = Joi.object({
  applicant_id: Joi.number().integer().required(),
  seat_matrix_id: Joi.number().integer().required(),
});

const allocateSeat = async (req, res, next) => {
  try {
    const { error, value } = allocateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const result = await service.allocateSeat(value);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const confirmAdmission = async (req, res, next) => {
  try {
    const result = await service.confirmAdmission(req.params.applicantId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { allocateSeat, confirmAdmission };