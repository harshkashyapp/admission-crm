const router = require('express').Router();
const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const controller = require('./applicant.controller');

router.use(authenticate);
router.use(authorize('officer', 'admin'));

router.post('/', controller.createApplicant);
router.get('/', controller.getApplicants);
router.get('/:id', controller.getApplicantById);
router.patch('/:id/doc-status', controller.updateDocStatus);
router.patch('/:id/fee-status', controller.updateFeeStatus);

module.exports = router;