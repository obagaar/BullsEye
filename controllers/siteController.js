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
    
    conn.query("SELECT * FROM SITE", function(err, result) {
      res.render('pages/index-site.ejs', {
          siteTitle: siteTitle,
          pageTitle: "Sites",
          items: result
      });
    });

  };

  controller.getAdd = (req, res) => {

    conn.query("SELECT * FROM PROVINCE", function(err, result) {
    res.render('pages/add-site.ejs', {
      siteTitle: siteTitle,
      pageTitle: "Add Site",
      items: result
      
  });
});

  };
  
  controller.add = (req, res) => {

    var numofSites = 0;

    conn.query("SELECT * FROM SITE", function(err, result) {

          if(result) {
              
            numofSites = result.length+1; 
        
            var insertQuery = "INSERT INTO `bullseyedb`.`site` (`siteID`, `name`, `provinceID`, `address`, `city`, `country`, `postalCode`, `phone`, `dayOfWeek`, `distanceFromWH`, `notes`)";insertQuery += " VALUES ('" + numofSites + "', " + "'" + req.body.name + "', " + "'" + req.body.provinceID + "', " + "'" + req.body.address + "', ";
            insertQuery += "'" + req.body.city + "', " + "'" + req.body.country + "', " + "'" + req.body.postalCode + "', " + "'" + req.body.phone + "', " + "'" + req.body.dayOfWeek + "', ";
            insertQuery += "'" + req.body.distanceFromWH + "', " + "'" + req.body.notes + "');";
          
            conn.query(insertQuery, function(err, result) {
        
                if(err) {
                    console.log(err);
                }
          
                if(result) {
                    res.redirect("/admin/crud/site");
                }
                
            });
        
        }

      });
    

    
  };
  
  controller.updateInfo = (req, res) => {
  
    var searchQuery = "SELECT * FROM site WHERE siteID = '" + req.params.siteID + "';";
  
    conn.query(searchQuery, function(err, result) {

 
        if(result) {
            res.render('pages/edit-site.ejs', {
                siteTitle: siteTitle,
                pageTitle: "Edit Site: " + result[0].name,
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
  
    var updateQuery = "UPDATE site SET `name` = '" + req.body.name + "', ";
    updateQuery += "`provinceID` = '" + req.body.provinceID + "', ";
    updateQuery += "`address` = '" + req.body.address + "', ";
    updateQuery += "`city` = '" + req.body.city + "', ";
    updateQuery += "`country` = '" + req.body.country + "', ";
    updateQuery += "`postalCode` = '" + req.body.postalCode + "', ";
    updateQuery += "`phone` = '" + req.body.phone + "', ";
    updateQuery += "`dayOfWeek` = '" + req.body.dayOfWeek + "', ";
    updateQuery += "`distanceFromWH` = '" + req.body.distanceFromWH + "', "; 
    updateQuery += "`notes` = '" + req.body.notes + "'" ;   
    updateQuery += " WHERE siteID = " + req.body.siteID + ";";


    
    
    conn.query(updateQuery, function (err, result) {


    
        if(result) {
            res.redirect("/admin/crud/site");
        }
    
        if(err) {
            console.log(err);
            console.log("This site cannot be edited due to being in use.");
            res.redirect("/admin/crud/site");
        } 
    })
  
  };
  
  controller.delete = (req, res) => {
  
    var deleteQuery = "DELETE FROM site WHERE siteID = '";
    deleteQuery += req.params.siteID + "'";
  
    conn.query(deleteQuery, function(err, result) {
  
        if(result) {
            res.redirect("/admin/crud/site");
        }
        
        if(err) {
            console.log(err);
        } 
        
    });
  
  }

  module.exports = controller;