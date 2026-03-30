const router = require('express').Router();
const authenticate = require('../../middlewares/auth.middleware');
const controller = require('./dashboard.controller');

router.use(authenticate);

router.get('/', controller.getDashboard);

module.exports = router;