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

  controller.read = (req, res) => {
    
    //First method with query to select all then send to index page to display all rows with available actions
    conn.query("SELECT * FROM SITE", function(err, result) {
      res.render('pages/index-site.ejs', {
          siteTitle: siteTitle,
          pageTitle: "Sites",
          items: result
      });

      if(err) {

        res.redirect("/err/site");
     }

    });

  };

  //Directs to page to add an entry along with information from look up tables after querying the database
  controller.getAdd = (req, res) => {

    conn.query("SELECT * FROM PROVINCE", function(err, result) {
    res.render('pages/add-site.ejs', {
      siteTitle: siteTitle,
      pageTitle: "Add Site",
      items: result
      
  });
  if(err) {

    res.redirect("/err/site");
 }

});

  };
  
    //Uses what was entered in the page's form to build a query then send to the database an update it
//Errors result in a page advising to recheck entry then takes user back to index  
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

                    res.redirect("/err/site");
                 }
          
                if(result) {
                    res.redirect("/admin/site");
                }
                
            });
        
        }

      });
    

    
  };
  
    //Directs to page to edit entry along with sending information from queries from look up tables
//The queries populate drop down menus used to edit
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
  
    //Uses the information edited and sends it to update the database
//Also directs to a page advising of errors if there are any
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

            res.redirect("/err/site");
         }
    })
  
  };
  
   //Deletes the selected entry by sending a query to the database
//Also directs to a page advising of errors if there are any
  controller.delete = (req, res) => {
  
    var deleteQuery = "DELETE FROM site WHERE siteID = ";
    deleteQuery += SqlString(req.params.siteID) + ";";
  
    conn.query(deleteQuery, function(err, result) {
  
        if(result) {
            res.redirect("/admin/site");
        }
        
        if(err) {

            res.redirect("/err/site");
         }
        
    });
  
  }

  //Exports all methods to be used for routing
  module.exports = controller;