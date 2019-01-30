const router = require('express').Router();

const employeeController = require('../controllers/employeeController');

router.get('/', employeeController.read);
router.get('/add', employeeController.getAdd);
router.post('/add', employeeController.add);
router.get('/update/:employeeID', employeeController.updateInfo);
router.post('/update/:employeeID', employeeController.update);
router.get('/delete/:employeeID', employeeController.delete);

module.exports = router;