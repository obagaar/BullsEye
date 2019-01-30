const router = require('express').Router();

const pageController = require('../controllers/pageController');

router.get('/', pageController.index);
router.get('/admin', pageController.admin);
router.get('/admin/crud', pageController.crud);

module.exports = router;