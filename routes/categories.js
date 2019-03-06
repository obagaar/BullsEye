//Import for express package and router method
const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const categoryController = require('../controllers/categoryController');

//The routes being used with their pathways, then the controller methods used with them
//Needs vaild methods used or will give errors
router.get('/', authenticationMiddleware(), categoryController.read);
router.get('/add', authenticationMiddleware(), categoryController.getAdd);
router.post('/add', authenticationMiddleware(), categoryController.add);
router.get('/update/:categoryName', authenticationMiddleware(), categoryController.updateInfo);
router.post('/update/:categoryName', authenticationMiddleware(), categoryController.update);
router.get('/delete/:categoryName', authenticationMiddleware(), categoryController.delete);

function authenticationMiddleware() {
    return (req, res, next) => {
        
        if (req.isAuthenticated()) return next();
        res.redirect('/');
    }
}

//exports the routes to be sued in main server file
module.exports = router;