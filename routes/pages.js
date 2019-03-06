//Import for express package and router method
const router = require('express').Router();
var expressValidator = require('express-validator');

//Imports the javascript controller file where MySQL queries are run
const pageController = require('../controllers/pageController');

//The routes being used with their pathways, then the controller methods used with them
//Needs vaild methods used or will give errors
router.get('/', pageController.index);
router.get('/logout', pageController.logout);
router.get('/tools', pageController.tools);
router.get('/inventory', pageController.inventory)
router.get('/main', pageController.main);
router.get('/admin', pageController.admin);
router.get('/err/cat', pageController.errCat);
router.get('/err/emp', pageController.errEmp);
router.get('/err/invt', pageController.errInvt);
router.get('/err/item', pageController.errItem);
router.get('/err/site', pageController.errSite);
router.get('/err/supp', pageController.errSupp);

//exports the routes to be sued in main server file
module.exports = router;