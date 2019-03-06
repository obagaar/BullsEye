//Import for express package and router method
const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const supplierController = require('../controllers/supplierController');

//The routes being used with their pathways, then the controller methods used with them
//Needs vaild methods used or will give errors
router.get('/', authenticationMiddleware(), supplierController.read);
router.get('/add', authenticationMiddleware(), supplierController.getAdd);
router.post('/add', authenticationMiddleware(), supplierController.add);
router.get('/update/:supplierID', authenticationMiddleware(), supplierController.updateInfo);
router.post('/update/:supplierID', authenticationMiddleware(), supplierController.update);
router.get('/delete/:supplierID', authenticationMiddleware(), supplierController.delete);

function authenticationMiddleware() {
    return (req, res, next) => {
        
        if (req.isAuthenticated()) return next();
        res.redirect('/');
    }
}

//exports the routes to be sued in main server file
module.exports = router;