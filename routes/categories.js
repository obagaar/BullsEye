const router = require('express').Router();

const categoryController = require('../controllers/categoryController');

router.get('/admin/crud/category', categoryController.read);
router.get('/admin/crud/category/add', categoryController.getAdd);
router.post('/admin/crud/category/add', categoryController.add);
router.get('/admin/crud/category/update/:categoryName', categoryController.updateInfo);
router.post('/admin/crud/category/update/:categoryName', categoryController.update);
router.get('/admin/crud/category/delete/:categoryName', categoryController.delete);

module.exports = router;