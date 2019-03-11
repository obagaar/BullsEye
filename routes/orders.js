const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const orderController = require('../controllers/orderController');
const backorderController = require('../controllers/backorderController');

router.get('/', authenticationMiddleware(), orderController.read);
router.get('/add', authenticationMiddleware(), orderController.getAdd);
router.post('/nextadd', authenticationMiddleware(), orderController.nextAdd);
router.post('/additems', authenticationMiddleware(), orderController.addItems);
router.get('/submit/:txnID', authenticationMiddleware(), orderController.getSubmit);
router.get('/delete/:txnID', authenticationMiddleware(), orderController.delete);
router.get('/backorder', authenticationMiddleware(), backorderController.read);
router.get('/editWH/:txnID', authenticationMiddleware(), orderController.editWH);
router.get('/update/:txnID', authenticationMiddleware(), orderController.updateInfo);
router.post('/update/:txnID', authenticationMiddleware(), orderController.updateItems);
router.get('/update/submit', authenticationMiddleware(), orderController.updateSubmit)

//Function to check if user is authenticated and if not redirect to login
function authenticationMiddleware() {
    return (req, res, next) => {
        
        if (req.isAuthenticated()) return next();
        res.redirect('/');
    }
}

//exports the routes to be sued in main server file
module.exports = router;