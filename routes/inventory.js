const router = require('express').Router();

const inventoryController = require('../controllers/inventoryController');

router.get('/', inventoryController.read);
router.get('/add', inventoryController.getAdd);
router.post('/add', inventoryController.add);
router.get('/update/:itemID', inventoryController.updateInfo);
router.post('/update/:itemID', inventoryController.update);
router.get('/delete/:itemID', inventoryController.delete);

module.exports = router;