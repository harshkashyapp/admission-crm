const repo = require('./master.repository');

const createInstitution = async (data) => repo.createInstitution(data);
const getInstitutions = async () => repo.getInstitutions();

const createCampus = async (data) => repo.createCampus(data);
const getCampuses = async () => repo.getCampuses();

const createDepartment = async (data) => repo.createDepartment(data);
const getDepartments = async () => repo.getDepartments();

const createProgram = async (data) => repo.createProgram(data);
const getPrograms = async () => repo.getPrograms();

module.exports = {
  createInstitution, getInstitutions,
  createCampus, getCampuses,
  createDepartment, getDepartments,
  createProgram, getPrograms,
};