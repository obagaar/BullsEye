//Import for express package and router method
const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const inventoryController = require('../controllers/inventoryController');

//The routes being used with their pathways, then the controller methods used with them
//Needs vaild methods used or will give errors
router.get('/', inventoryController.read);
router.get('/add', inventoryController.getAdd);
router.post('/add', inventoryController.add);
router.get('/update/:itemID', inventoryController.updateInfo);
router.post('/update/:itemID', inventoryController.update);
router.get('/delete/:itemID', inventoryController.delete);

//exports the routes to be sued in main server file
module.exports = router;