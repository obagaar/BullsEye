//Import for express package and router method
const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const supplierController = require('../controllers/supplierController');

//The routes being used with their pathways, then the controller methods used with them
//Needs vaild methods used or will give errors
router.get('/', supplierController.read);
router.get('/add', supplierController.getAdd);
router.post('/add', supplierController.add);
router.get('/update/:supplierID', supplierController.updateInfo);
router.post('/update/:supplierID', supplierController.update);
router.get('/delete/:supplierID', supplierController.delete);

//exports the routes to be sued in main server file
module.exports = router;