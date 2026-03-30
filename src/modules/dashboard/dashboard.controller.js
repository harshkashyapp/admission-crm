const repo = require('./dashboard.repository');

const getDashboard = async (req, res, next) => {
  try {
    const result = await repo.getDashboard();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };