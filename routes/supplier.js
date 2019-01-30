const router = require('express').Router();

const supplierController = require('../controllers/supplierController');

router.get('/', supplierController.read);
router.get('/add', supplierController.getAdd);
router.post('/add', supplierController.add);
router.get('/update/:supplierID', supplierController.updateInfo);
router.post('/update/:supplierID', supplierController.update);
router.get('/delete/:supplierID', supplierController.delete);

module.exports = router;