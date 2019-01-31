const router = require('express').Router();

const pageController = require('../controllers/pageController');

router.get('/', pageController.index);
router.get('/admin', pageController.admin);

module.exports = router;