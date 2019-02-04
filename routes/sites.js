//Import for express package and router method
const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const siteController = require('../controllers/siteController');

//The routes being used with their pathways, then the controller methods used with them
//Needs vaild methods used or will give errors
router.get('/', siteController.read);
router.get('/add', siteController.getAdd);
router.post('/add', siteController.add);
router.get('/update/:siteID', siteController.updateInfo);
router.post('/update/:siteID', siteController.update);
router.get('/delete/:siteID', siteController.delete);

//exports the routes to be sued in main server file
module.exports = router;