//Import for express package and router method
const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const categoryController = require('../controllers/categoryController');

//The routes being used with their pathways, then the controller methods used with them
//Needs vaild methods used or will give errors
router.get('/', categoryController.read);
router.get('/add', categoryController.getAdd);
router.post('/add', categoryController.add);
router.get('/update/:categoryName', categoryController.updateInfo);
router.post('/update/:categoryName', categoryController.update);
router.get('/delete/:categoryName', categoryController.delete);

//exports the routes to be sued in main server file
module.exports = router;