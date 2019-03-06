//Imports of packages to be called on later for use in queries
const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const dateFormat = require('dateformat');
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
const siteTitle = "BullsEye";
const conn = getConnection();
const controller = {};

//First method with query to select all then send to index page to display all rows with available actions
controller.read = (req, res) => {
    
  conn.query("SELECT * FROM CATEGORY", function(err, result) {
    res.render('pages/index-cat.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Categories",
        items: result,
        userInfo: req.user.userInfo
    });
 if(err){
    res.redirect("/err/cat");
 }

  });
};

//Directs to page to add an entry
controller.getAdd = (req, res) => {

  res.render('pages/add-cat.ejs', {
    siteTitle: siteTitle,
    pageTitle: "Add Category",
    items: ''
    
});

};

//Uses what was entered in the page's form to build a query then send to the database an update it
//Errors result in a page advising to recheck entry then takes user back to index
controller.add = (req, res) => {

    var catName = SqlString(req.body.categoryName);

  var insertQuery = "INSERT INTO category (categoryName) VALUES (";
  insertQuery +=  catName + ');'

  conn.query(insertQuery, function(err, result) {

      res.redirect("/admin/cat");

      if(err){
        res.redirect("/err/cat");
      }
  });
};

//Direcgts to page to edit entry along with sending information from queries from look up tables
//The queries populate drop down menus used to edit
controller.updateInfo = (req, res) => {

    var catName = SqlString(req.params.categoryName);

  var searchQuery = "SELECT * FROM category WHERE categoryName = " + catName + ";";

  conn.query(searchQuery, function(err, result) {
      res.render('pages/edit-cat.ejs', {
          siteTitle: siteTitle,
          pageTitle: "Edit Category: " + result[0].categoryName,
          item: result
          
      });

      if(err) {
        res.redirect("/err/cat");
      }
  });

};

//Uses the information edited and sends it to update the database
//Also directs to a page advising of errors if there are any
controller.update = (req, res) => {

    var catName = SqlString(req.body.categoryName);
    var catName2 = SqlString(req.params.categoryName);

  var updateQuery = "UPDATE category SET categoryName = " + catName + " WHERE categoryName = " + catName2 + ";";
  conn.query(updateQuery, function (err, result) {
  
      if(result) {
          res.redirect("/admin/cat");
      }
  
      if(err) {
       
     res.redirect("/err/cat");

      } 
  })

};

//Deletes the selected entry by sending a query to the database
//Also directs to a page advising of errors if there are any
controller.delete = (req, res) => {

    var catName = SqlString(req.params.categoryName);

  var deleteQuery = "DELETE FROM category WHERE categoryName = ";
  deleteQuery += catName;

  conn.query(deleteQuery, function(err, result) {

      if(result) {
          res.redirect("/admin/cat");
      }
      
      if(err) {
          console.log(err);
          res.redirect("/err/cat");
      } 
      
  });

}

//Exports all methods to be sued for routing
  module.exports = controller;