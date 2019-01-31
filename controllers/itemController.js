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
    
    conn.query("SELECT * FROM ITEM", function(err, result) {
      res.render('pages/index-item.ejs', {
          siteTitle: siteTitle,
          pageTitle: "Item",
          items: result
      });
    });

  };

  controller.getAdd = (req, res) => {

    conn.query("SELECT * FROM SUPPLIER", function(err, result) {

        console.log(result);
    res.render('pages/add-item.ejs', {
      siteTitle: siteTitle,
      pageTitle: "Add Supplier",
      items: result
      
  });
});

  };
  
  controller.add = (req, res) => {

      
            var insertQuery = "INSERT INTO `bullseyedb`.`employee` ( `Password`, `FirstName`, `LastName`, `Email`, `active`, `PositionID`, `siteID`)";
            insertQuery += " VALUES ('" + req.body.Password + "', " + "'" + req.body.FirstName + "', '" + req.body.LastName + "', ";
            insertQuery += "'" + req.body.Email + "', " + "'" + req.body.active + "', " + "'" + req.body.PositionID + "', " + "'" + req.body.siteID + "');";
          
            conn.query(insertQuery, function(err, result) {
        
                if(err) {
                    console.log(err);
                }
          
                if(result) {
                    res.redirect("/admin/crud/item");
                }
                
            });
    

    
  };
  
  controller.updateInfo = (req, res) => {
  
    var searchQuery = "SELECT * FROM ITEM WHERE itemID = '" + req.params.itemID + "';";
  
    conn.query(searchQuery, function(err, result) {


        if(result) {
            res.render('pages/edit-item.ejs', {
                siteTitle: siteTitle,
                pageTitle: "Edit Item",
                item: result
            });

        }
        if(err) {
            console.log(err);
        }

    });
  
  };
  
  controller.update = (req, res) => {


    console.log(req.body);
  
     var updateQuery = "UPDATE Employee SET `Password` = '" + req.body.Password + "', ";
        updateQuery += "`FirstName` = '" + req.body.FirstName + "', ";
        updateQuery += "`LastName` = '" + req.body.LastName + "', ";
        updateQuery += "`Email` = '" + req.body.Email + "', ";
        updateQuery += "`active` = '" + req.body.active + "', ";
        updateQuery += "`PositionID` = '" + req.body.PositionID + "', ";
        updateQuery += "`siteID` = '" + req.body.siteID + "' "; 
        updateQuery += " WHERE employeeID = '" + req.body.employeeID + "';";


    
    
    conn.query(updateQuery, function (err, result) {


    
        if(result) {
            res.redirect("/admin/crud/item");
        }
    
        if(err) {
            console.log(err);
            console.log("This site cannot be edited due to being in use.");
            res.redirect("/admin/crud/item");
        } 
    })
  
  };
  
  controller.delete = (req, res) => {
  
    var deleteQuery = "DELETE FROM ITEM WHERE itemID = '";
    deleteQuery += req.params.itemID + "'";
  
    conn.query(deleteQuery, function(err, result) {
  
        if(result) {
            res.redirect("/admin/crud/item");
        }
        
        if(err) {
            console.log(err);
            res.redirect("/admin/crud/item");
        } 
        
    });
  
  }

  module.exports = controller;