//Import for express package and router method
const router = require('express').Router();

//Imports the javascript controller file where MySQL queries are run
const loginController = require('../controllers/loginController');

//The routes being used with their pathways, then the controller methods used with them
//Needs vaild methods used or will give errors
router.post('/:inputUsername/:inputPassword', loginController.login);

//exports the routes to be sued in main server file
module.exports = router;