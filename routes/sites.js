//Import for express package and router method
const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const siteController = require('../controllers/siteController');

//The routes being used with their pathways, then the controller methods used with them
//Needs vaild methods used or will give errors
router.get('/', authenticationMiddleware(), siteController.read);
router.get('/add', authenticationMiddleware(), siteController.getAdd);
router.post('/add', authenticationMiddleware(), siteController.add);
router.get('/update/:siteID', authenticationMiddleware(), siteController.updateInfo);
router.post('/update/:siteID', authenticationMiddleware(), siteController.update);
router.get('/delete/:siteID', authenticationMiddleware(), siteController.delete);

function authenticationMiddleware() {
    return (req, res, next) => {
        
        if (req.isAuthenticated()) return next();
        res.redirect('/');
    }
}

//exports the routes to be sued in main server file
module.exports = router;