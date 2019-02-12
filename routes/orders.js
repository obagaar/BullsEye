const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const orderController = require('../controllers/orderController');

router.get('/', orderController.main);

//exports the routes to be sued in main server file
module.exports = router;