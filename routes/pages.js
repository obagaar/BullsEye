//Import for express package and router method
const router = require('express').Router();
var expressValidator = require('express-validator');

//Imports the javascript controller file where MySQL queries are run
const pageController = require('../controllers/pageController');
const backorderController = require('../controllers/backorderController');

//The routes being used with their pathways, then the controller methods used with them
//Needs vaild methods used or will give errors
router.get('/', pageController.index);
router.get('/logout', pageController.logout);
router.get('/tools', authenticationMiddleware(), pageController.tools);
router.get('/inventory', authenticationMiddleware(), pageController.inventory)
router.get('/main', authenticationMiddleware(), pageController.main);
router.get('/admin', authenticationMiddleware(), pageController.admin);
router.get('/err/cat', authenticationMiddleware(), pageController.errCat);
router.get('/err/emp', authenticationMiddleware(), pageController.errEmp);
router.get('/err/invt', authenticationMiddleware(), pageController.errInvt);
router.get('/err/item', authenticationMiddleware(), pageController.errItem);
router.get('/err/site', authenticationMiddleware(), pageController.errSite);
//router.get('/err/supp', authenticationMiddleware(), pageController.errSupp);
router.get('/err/orders', authenticationMiddleware(), pageController.errOrder);

//Function to check if user is authenticated and if not redirect to login
function authenticationMiddleware() {
    return (req, res, next) => {
        
        if (req.isAuthenticated()) return next();
        res.redirect('/');
    }
}

//exports the routes to be sued in main server file
module.exports = router;