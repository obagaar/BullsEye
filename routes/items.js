//Import for express package and router method
const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const itemController = require('../controllers/itemController');

//The routes being used with their pathways, then the controller methods used with them
//Needs vaild methods used or will give errors
router.get('/', itemController.read);
router.get('/add', itemController.getAdd);
router.post('/add', itemController.add);
router.get('/update/:itemID', itemController.updateInfo);
router.post('/update/:itemID', itemController.update);
router.get('/delete/:itemID', itemController.delete);

//exports the routes to be sued in main server file
module.exports = router;