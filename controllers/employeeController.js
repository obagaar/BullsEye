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
    
    conn.query("SELECT * FROM EMPLOYEE", function(err, result) {
      res.render('pages/index-emp.ejs', {
          siteTitle: siteTitle,
          pageTitle: "Employee",
          items: result
      });
    });

  };

  controller.getAdd = (req, res) => {

    conn.query("SELECT * FROM POSITION", function(err, result) {

        console.log(result);
    res.render('pages/add-emp.ejs', {
      siteTitle: siteTitle,
      pageTitle: "Add Supplier",
      items: result
      
  });
});

  };
  
  controller.add = (req, res) => {

    console.log(req);

        
            var insertQuery = "INSERT INTO `bullseyedb`.`employee` ( `Password`, `FirstName`, `LastName`, `Email`, `active`, `PositionID`, `siteID`)";
            insertQuery += " VALUES ('" + req.body.Password + "', " + "'" + req.body.FirstName + "', '" + req.body.LastName + "', ";
            insertQuery += "'" + req.body.Email + "', " + "'" + req.body.active + "', " + "'" + req.body.PositionID + "', " + "'" + req.body.siteID + "');";
          
            conn.query(insertQuery, function(err, result) {
        
                if(err) {
                    console.log(err);
                }
          
                if(result) {
                    res.redirect("/admin/crud/emp");
                }
                
            });
    

    
  };
  
  controller.updateInfo = (req, res) => {
  
    var searchQuery = "SELECT * FROM EMPLOYEE WHERE employeeID = '" + req.params.employeeID + "';";
  
    conn.query(searchQuery, function(err, result) {


        if(result) {
            res.render('pages/edit-emp.ejs', {
                siteTitle: siteTitle,
                pageTitle: "Edit Employee",
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
            res.redirect("/admin/crud/emp");
        }
    
        if(err) {
            console.log(err);
            console.log("This site cannot be edited due to being in use.");
            res.redirect("/admin/crud/emp");
        } 
    })
  
  };
  
  controller.delete = (req, res) => {
  
    var deleteQuery = "DELETE FROM employee WHERE employeeID = '";
    deleteQuery += req.params.employeeID + "'";
  
    conn.query(deleteQuery, function(err, result) {
  
        if(result) {
            res.redirect("/admin/crud/emp");
        }
        
        if(err) {
            console.log(err);
        } 
        
    });
  
  }

  module.exports = controller;