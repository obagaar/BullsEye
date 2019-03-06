const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const orderController = require('../controllers/orderController');
const backorderController = require('../controllers/backorderController');

router.get('/', orderController.read);
router.get('/add', orderController.getAdd);
router.post('/add', orderController.add);
router.get('/backorder', backorderController.read);

//exports the routes to be sued in main server file
module.exports = router;