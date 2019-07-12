const router = require('express').Router();


const deliveryController = require('../controllers/deliveryController');

router.get('/', authenticationMiddleware(), deliveryController.read);
router.get('/group/', authenticationMiddleware(), deliveryController.group);
router.post('/group/', authenticationMiddleware(), deliveryController.groupNext);
router.post('/groupNext/', authenticationMiddleware(), deliveryController.groupNext2);
router.post('/groupNext2', authenticationMiddleware(), deliveryController.groupNext3);
router.post('/groupNext3', authenticationMiddleware(), deliveryController.groupNext4);
router.post('/groupNext4', authenticationMiddleware(), deliveryController.groupNext5);
router.get('/process/:deliveryID', authenticationMiddleware(), deliveryController.process);
router.post('/process/:deliveryID', authenticationMiddleware(), deliveryController.processInfo);

//Function to check if user is authenticated and if not redirect to login
function authenticationMiddleware() {
    return (req, res, next) => {
        
        if (req.isAuthenticated()) return next();
        res.redirect('/');
    }
}

//exports the routes to be sued in main server file
module.exports = router;