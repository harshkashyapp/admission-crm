const repo = require('./seat-matrix.repository');

const createSeatMatrix = async (data) => {
  const { total_intake, kcet_seats, comedk_seats, management_seats } = data;
  if (kcet_seats + comedk_seats + management_seats !== total_intake) {
    throw { status: 400, message: 'Sum of quota seats must equal total intake' };
  }
  return repo.createSeatMatrix(data);
};

const getSeatMatrixByProgram = async (program_id) => {
  const matrix = await repo.getSeatMatrixByProgram(program_id);
  if (!matrix) throw { status: 404, message: 'Seat matrix not found for this program' };
  return matrix;
};

module.exports = { createSeatMatrix, getSeatMatrixByProgram };