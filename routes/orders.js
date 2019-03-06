const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const orderController = require('../controllers/orderController');
const backorderController = require('../controllers/backorderController');

router.get('/', authenticationMiddleware(), orderController.read);
router.get('/add', authenticationMiddleware(), orderController.getAdd);
router.post('/add', authenticationMiddleware(), orderController.add);
router.get('/backorder', authenticationMiddleware(), backorderController.read);

function authenticationMiddleware() {
    return (req, res, next) => {
        
        if (req.isAuthenticated()) return next();
        res.redirect('/');
    }
}

//exports the routes to be sued in main server file
module.exports = router;