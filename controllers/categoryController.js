const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const dateFormat = require('dateformat');


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

  var insertQuery = "INSERT INTO category (categoryName) VALUES (";
  insertQuery += '"' + req.body.categoryName + '");'

  conn.query(insertQuery, function(err, result) {

      res.redirect("/admin/crud/cat");
  });
};

controller.updateInfo = (req, res) => {

  var searchQuery = "SELECT * FROM category WHERE categoryName = '" + req.params.categoryName + "';";

  conn.query(searchQuery, function(err, result) {
      res.render('pages/edit-cat.ejs', {
          siteTitle: siteTitle,
          pageTitle: "Edit Category: " + result[0].categoryName,
          item: result
          
      });
  });

};

controller.update = (req, res) => {

  var updateQuery = "UPDATE category SET categoryName = '" + req.body.categoryName + "' WHERE categoryName = '" + req.params.categoryName + "'";
  conn.query(updateQuery, function (err, result) {
  
      if(result) {
          res.redirect("/admin/crud/cat");
      }
  
      if(err) {
          console.log("This category cannot be edited due to being in use.");
          res.redirect("/admin/crud/cat");
      } 
  })

};

controller.delete = (req, res) => {

  var deleteQuery = "DELETE FROM category WHERE categoryName = '";
  deleteQuery += req.params.categoryName + "'";

  conn.query(deleteQuery, function(err, result) {

      if(result) {
          res.redirect("/admin/crud/cat");
      }
      
      if(err) {
          console.log(err);
      } 
      
  });

}

  module.exports = controller;