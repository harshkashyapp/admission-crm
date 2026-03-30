const router = require('express').Router();
const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const controller = require('./admission.controller');

router.use(authenticate);
router.use(authorize('officer', 'admin'));

router.post('/allocate', controller.allocateSeat);
router.post('/confirm/:applicantId', controller.confirmAdmission);

module.exports = router;