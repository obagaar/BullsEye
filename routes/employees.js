//Import for express package and router method
const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const employeeController = require('../controllers/employeeController');

//The routes being used with their pathways, then the controller methods used with them
//Needs vaild methods used or will give errors
router.get('/', authenticationMiddleware(), employeeController.read);
router.get('/add', authenticationMiddleware(), employeeController.getAdd);
router.post('/add', authenticationMiddleware(), employeeController.add);
router.get('/update/:employeeID', authenticationMiddleware(), employeeController.updateInfo);
router.post('/update/:employeeID', authenticationMiddleware(), employeeController.update);
router.get('/delete/:employeeID', authenticationMiddleware(), employeeController.delete);

function authenticationMiddleware() {
    return (req, res, next) => {
        
        if (req.isAuthenticated()) return next();
        res.redirect('/');
    }
}

//exports the routes to be sued in main server file
module.exports = router;