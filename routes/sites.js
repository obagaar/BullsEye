const router = require('express').Router();

const siteController = require('../controllers/siteController');

router.get('/', siteController.read);
router.get('/add', siteController.getAdd);
router.post('/add', siteController.add);
router.get('/update/:siteID', siteController.updateInfo);
router.post('/update/:siteID', siteController.update);
router.get('/delete/:siteID', siteController.delete);

module.exports = router;