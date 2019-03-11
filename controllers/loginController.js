//Imports of packages to be called on later for use in queries
const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const dateFormat = require('dateformat');
const q = require('q');
const SqlString = require('sql-escape-string');
const md5 = require('md5');

//Authetication imports
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);

const siteTitle = "BullsEye Sporting Goods";
const controller = {};
const db = require('../db');

passport.serializeUser(function (user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function (user_id, done) {
    done(null, user_id);
});

//Function to check if user is authenticated and if not redirect to login
 function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/');
    }
}


//Exports all methods to be used for routing
module.exports = controller;