const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const dateFormat = require('dateformat');
const SqlString = require('sql-escape-string');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'bullseyedb'
})

function getConnection () {

  return pool
}

const siteTitle = "BullsEye";
const conn = getConnection();
const controller = {};

controller.read = (req, res) => {
    
  conn.query("SELECT * FROM CATEGORY", function(err, result) {
    res.render('pages/index-cat.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Categories",
        items: result
    });
  });
};


controller.getAdd = (req, res) => {

  res.render('pages/add-cat.ejs', {
    siteTitle: siteTitle,
    pageTitle: "Add Category",
    items: ''
    
});

};

controller.add = (req, res) => {

    var catName = SqlString(req.body.categoryName);

  var insertQuery = "INSERT INTO category (categoryName) VALUES (";
  insertQuery +=  catName + ');'

  conn.query(insertQuery, function(err, result) {

      res.redirect("/admin/cat");
  });
};

controller.updateInfo = (req, res) => {

    var catName = SqlString(req.params.categoryName);

  var searchQuery = "SELECT * FROM category WHERE categoryName = " + catName + ";";

  conn.query(searchQuery, function(err, result) {
      res.render('pages/edit-cat.ejs', {
          siteTitle: siteTitle,
          pageTitle: "Edit Category: " + result[0].categoryName,
          item: result
          
      });
  });

};

controller.update = (req, res) => {

    var catName = SqlString(req.body.categoryName);
    var catName2 = SqlString(req.params.categoryName);

  var updateQuery = "UPDATE category SET categoryName = " + catName + " WHERE categoryName = " + catName2 + ";";
  conn.query(updateQuery, function (err, result) {
  
      if(result) {
          res.redirect("/admin/cat");
      }
  
      if(err) {
       
     res.redirect("/admin/cat");

      } 
  })

};

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
          res.redirect("/admin/cat");
      } 
      
  });

}

  module.exports = controller;