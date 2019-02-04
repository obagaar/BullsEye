//Import for express package and router method
const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const employeeController = require('../controllers/employeeController');

//The routes being used with their pathways, then the controller methods used with them
//Needs vaild methods used or will give errors
router.get('/', employeeController.read);
router.get('/add', employeeController.getAdd);
router.post('/add', employeeController.add);
router.get('/update/:employeeID', employeeController.updateInfo);
router.post('/update/:employeeID', employeeController.update);
router.get('/delete/:employeeID', employeeController.delete);

//exports the routes to be sued in main server file
module.exports = router;