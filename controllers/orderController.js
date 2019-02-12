//Imports of packages to be called on later for use in queries
const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const dateFormat = require('dateformat');
const q = require('q');
const SqlString = require('sql-escape-string');

//Uses mysql package to setup a connection pool to be used in queries
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bullseyedb'
  })
  
  //Function returns the pool so it can be used to set connection
  function getConnection () {
  
    return pool
  }
  
   //Constants for the site's tite, the connection and array for controller methods to be returned
  const siteTitle = "BullsEye Sporting Goods";
  const conn = getConnection();
  const controller = {};

  controller.main = (req, res) => {
  
    res.render('pages/index-order.ejs', {
        siteTitle: siteTitle,
        pageTitle: "",
        item: ''
    });
  
  }

   //Exports all methods to be used for routing
   module.exports = controller;