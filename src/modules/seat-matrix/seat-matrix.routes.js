const router = require('express').Router();
const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const controller = require('./seat-matrix.controller');

router.use(authenticate);

router.post('/', authorize('admin'), controller.createSeatMatrix);
router.get('/:programId', authorize('admin', 'officer'), controller.getSeatMatrix);

module.exports = router;