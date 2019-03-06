//Import for express package and router method
const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const inventoryController = require('../controllers/inventoryController');

//The routes being used with their pathways, then the controller methods used with them
//Needs vaild methods used or will give errors
router.get('/', authenticationMiddleware(), inventoryController.read);
router.get('/add', authenticationMiddleware(), inventoryController.getAdd);
router.post('/add', authenticationMiddleware(), inventoryController.add);
router.get('/update/:itemID/:siteID', authenticationMiddleware(), inventoryController.updateInfo);
router.post('/update/:itemID/:siteID', authenticationMiddleware(), inventoryController.update);
router.get('/delete/:itemID/:siteID', authenticationMiddleware(), inventoryController.delete);

function authenticationMiddleware() {
    return (req, res, next) => {
        
        if (req.isAuthenticated()) return next();
        res.redirect('/');
    }
}

//exports the routes to be sued in main server file
module.exports = router;