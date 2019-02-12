//Imports of packages to be called on later for use in queries
const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const dateFormat = require('dateformat');
const q = require('q');
const SqlString = require('sql-escape-string');
const md5 = require('md5');


//Uses mysql package to setup a connection pool to be used in queries
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bullseyedb'
})

//Function returns the pool so it can be used to set connection
function getConnection() {

    return pool
}

//Constants for the site's tite, the connection and array for controller methods to be returned
const siteTitle = "BullsEye Sporting Goods";
const conn = getConnection();
const controller = {};

controller.login = (req, res) => {

    var email = SqlString(req.body.inputUsername);
    var password = SqlString(md5(req.body.inputPassword));

    var searchQuery = "SELECT * FROM EMPLOYEE WHERE Email = " + email + " AND Password = " + password + ";";

    conn.query(searchQuery, function (err, result) {

       if (err || result.length < 1) {

            res.send("Fuck off");
        }
        else {

            if(result) {
                res.render('pages/mainDash.ejs', {
                    siteTitle: siteTitle,
                    pageTitle: "Welcome",
                    items: result
                });
            }

        }


    });

};


//Exports all methods to be used for routing
module.exports = controller;