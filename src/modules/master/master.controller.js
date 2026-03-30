const Joi = require('joi');
const service = require('./master.service');

const institutionSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().uppercase().required(),
});

const campusSchema = Joi.object({
  institution_id: Joi.number().integer().required(),
  name: Joi.string().required(),
  code: Joi.string().uppercase().required(),
});

const departmentSchema = Joi.object({
  campus_id: Joi.number().integer().required(),
  name: Joi.string().required(),
  code: Joi.string().uppercase().required(),
});

const programSchema = Joi.object({
  department_id: Joi.number().integer().required(),
  name: Joi.string().required(),
  code: Joi.string().uppercase().required(),
  course_type: Joi.string().valid('UG', 'PG').required(),
  entry_type: Joi.string().valid('Regular', 'Lateral').required(),
  admission_mode: Joi.string().valid('Government', 'Management').required(),
  academic_year: Joi.string().required(),
});

const handle = (schema, fn) => async (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const result = await fn(value);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getAll = (fn) => async (req, res, next) => {
  try {
    const result = await fn();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createInstitution: handle(institutionSchema, service.createInstitution),
  getInstitutions: getAll(service.getInstitutions),
  createCampus: handle(campusSchema, service.createCampus),
  getCampuses: getAll(service.getCampuses),
  createDepartment: handle(departmentSchema, service.createDepartment),
  getDepartments: getAll(service.getDepartments),
  createProgram: handle(programSchema, service.createProgram),
  getPrograms: getAll(service.getPrograms),
};