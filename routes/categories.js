const router = require('express').Router();

const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.read);
router.get('/add', categoryController.getAdd);
router.post('/add', categoryController.add);
router.get('/update/:categoryName', categoryController.updateInfo);
router.post('/update/:categoryName', categoryController.update);
router.get('/delete/:categoryName', categoryController.delete);

module.exports = router;