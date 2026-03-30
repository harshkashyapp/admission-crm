const Joi = require('joi');
const service = require('./seat-matrix.service');

const createSchema = Joi.object({
  program_id: Joi.number().integer().required(),
  total_intake: Joi.number().integer().min(1).required(),
  kcet_seats: Joi.number().integer().min(0).required(),
  comedk_seats: Joi.number().integer().min(0).required(),
  management_seats: Joi.number().integer().min(0).required(),
  supernumerary_seats: Joi.number().integer().min(0).default(0),
});

const createSeatMatrix = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const result = await service.createSeatMatrix(value);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getSeatMatrix = async (req, res, next) => {
  try {
    const result = await service.getSeatMatrixByProgram(req.params.programId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { createSeatMatrix, getSeatMatrix };