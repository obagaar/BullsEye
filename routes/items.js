//Import for express package and router method
const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const itemController = require('../controllers/itemController');

//The routes being used with their pathways, then the controller methods used with them
//Needs vaild methods used or will give errors
router.get('/', authenticationMiddleware(), itemController.read);
router.get('/add', authenticationMiddleware(), itemController.getAdd);
router.post('/add', authenticationMiddleware(), itemController.add);
router.get('/update/:itemID', authenticationMiddleware(), itemController.updateInfo);
router.post('/update/:itemID', authenticationMiddleware(), itemController.update);
router.get('/delete/:itemID', authenticationMiddleware(), itemController.delete);

function authenticationMiddleware() {
    return (req, res, next) => {
        
        if (req.isAuthenticated()) return next();
        res.redirect('/');
    }
}

//exports the routes to be sued in main server file
module.exports = router;