const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const dateFormat = require('dateformat');
const q = require('q');
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
        
            var insertQuery = "INSERT INTO `bullseyedb`.`site` (`siteID`, `name`, `provinceID`, `address`, `city`, `country`, `postalCode`, `phone`, `dayOfWeek`, `distanceFromWH`, `notes`)";
            insertQuery += " VALUES (" + numofSites + ", " 
            + SqlString(req.body.name) + ", " 
            + SqlString(req.body.provinceID) + ", " 
            + SqlString(req.body.address) + ", ";
            insertQuery += SqlString(req.body.city) + ", " 
            + SqlString(req.body.country) + ", " 
            + SqlString(req.body.postalCode) + ", " 
            + SqlString(req.body.phone) + ", " 
            + SqlString(req.body.dayOfWeek) + ", ";
            insertQuery += SqlString(req.body.distanceFromWH) + ", " 
            + SqlString(req.body.notes) + ");";
          
            conn.query(insertQuery, function(err, result) {
        
                if(err) {
                    console.log(err);
                }
          
                if(result) {
                    res.redirect("/admin/site");
                }
                
            });
        
        }

      });
    

    
  };
  
  controller.updateInfo = (req, res) => {

    var searchQuery = "SELECT * FROM site WHERE siteID = " + SqlString(req.params.siteID) + ";";
    var searchQuery2 = "SELECT * FROM PROVINCE;";


    function doQuery1(){
        var defered = q.defer();
        conn.query(searchQuery,defered.makeNodeResolver());
        return defered.promise;
    }

    function doQuery2(){
        var defered = q.defer();
        conn.query(searchQuery2,defered.makeNodeResolver());
        return defered.promise;
    }

    q.all([doQuery1(),doQuery2()]).then(function(results){


        var result = JSON.parse(JSON.stringify(results[0][0][0]));
        var result2 = JSON.parse(JSON.stringify(results[1][0]));

             res.render('pages/edit-site.ejs', {
                siteTitle: siteTitle,
                pageTitle: "Edit Site: " + result.name,
                item: result,
                item2: result2
            });
    });

  
  };
  
  controller.update = (req, res) => {

    var updateQuery = "UPDATE site SET `name` = " + SqlString(req.body.name) + ", ";
    updateQuery += "`provinceID` = " + SqlString(req.body.provinceID) + ", ";
    updateQuery += "`address` = " + SqlString(req.body.address) + ", ";
    updateQuery += "`city` = " + SqlString(req.body.city) + ", ";
    updateQuery += "`country` = " + SqlString(req.body.country) + ", ";
    updateQuery += "`postalCode` = " + SqlString(req.body.postalCode) + ", ";
    updateQuery += "`phone` = " + SqlString(req.body.phone) + ", ";
    updateQuery += "`dayOfWeek` = " + SqlString(req.body.dayOfWeek) + ", ";
    updateQuery += "`distanceFromWH` = " + SqlString(req.body.distanceFromWH) + ", "; 
    updateQuery += "`notes` = " + SqlString(req.body.notes);   
    updateQuery += " WHERE siteID = " + SqlString(req.body.siteID) + ";";


    
    
    conn.query(updateQuery, function (err, result) {


    
        if(result) {
            res.redirect("/admin/site");
        }
    
        if(err) {
            console.log(err);
            console.log("This site cannot be edited due to being in use.");
            res.redirect("/admin/site");
        } 
    })
  
  };
  
  controller.delete = (req, res) => {
  
    var deleteQuery = "DELETE FROM site WHERE siteID = ";
    deleteQuery += SqlString(req.params.siteID) + ";";
  
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