const router = require('express').Router();
const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const controller = require('./master.controller');

router.use(authenticate);
router.use(authorize('admin'));

router.post('/institutions', controller.createInstitution);
router.get('/institutions', controller.getInstitutions);

router.post('/campuses', controller.createCampus);
router.get('/campuses', controller.getCampuses);

router.post('/departments', controller.createDepartment);
router.get('/departments', controller.getDepartments);

router.post('/programs', controller.createProgram);
router.get('/programs', controller.getPrograms);

module.exports = router;