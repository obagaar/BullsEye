//Import for express package and router method
const router = require('express').Router();
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const SqlString = require('sql-escape-string');
const md5 = require('md5');

//Imports the javascript controller file where MySQL queries are run
const loginController = require('../controllers/loginController');

//The routes being used with their pathways, then the controller methods used with them
//Needs vaild methods used or will give errors
//First route is used to authenticate user and then let them login or not based on the local strategy
router.post('/', passport.authenticate('local', 
{ successRedirect: '/main',
failureRedirect: '/', failureFlash: 'Invalid username or password'}), function(req, res) {

    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 4-11 characters long.').len(4, 11);
    req.checkBody('password', 'Password must be between 1-32 characters long.').len(1, 32);

    req.checkBody('username', 'Username can only contain numbers.').matches(/^[0-9]/);

    const errors = req.validationErrors();

if(errors) {

  console.log(`errors ${JSON.stringify(errors)}`);

  res.render('mainIndex.ejs', { 
    title: 'Login Error', 
    errors: errors });
}

});

const db = require('../db');

//Local strategy to compare username and password then let the user login. If incorrect the suer is redirectect to login and notified
passport.use(new LocalStrategy(
    function (username, password, done) {

  
        var user = SqlString(username);
        var password = SqlString(md5(password));
    
 
        var searchQuery = "SELECT * FROM EMPLOYEE WHERE employeeID = " + user + " AND Password = " + password + ";";
    
        db.query(searchQuery, function (err, results, fields) { 
    
            if (err) {
                return done(err, null)
            }
    
            if (results.length === 0) {
                return done(err, false);
    
            } else {

              
                return done(null, {userInfo: results[0]});
            }
    
    
        })
    
    }));


//Function to check if user is authenticated and if not redirect to login
 function authenticationMiddleware() {
    return (req, res, next) => {
        
        if (req.isAuthenticated()) return next();
        res.redirect('/');
    }
}

//exports the routes to be sued in main server file
module.exports = router;