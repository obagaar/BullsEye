const router = require('express').Router();

const itemController = require('../controllers/itemController');

router.get('/', itemController.read);
router.get('/add', itemController.getAdd);
router.post('/add', itemController.add);
router.get('/update/:itemID', itemController.updateInfo);
router.post('/update/:itemID', itemController.update);
router.get('/delete/:itemID', itemController.delete);

module.exports = router;