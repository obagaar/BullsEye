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
    
    conn.query("SELECT * FROM INVENTORY", function(err, result) {
      res.render('pages/index-invt.ejs', {
          siteTitle: siteTitle,
          pageTitle: "Inventory",
          items: result
      });
    });

  };

  controller.getAdd = (req, res) => {

    var searchQuery = "SELECT * FROM ITEM";
    var searchQuery2 = "SELECT * FROM SITE;";


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
    

           var result = JSON.parse(JSON.stringify(results[0][0]));
            var result2 = JSON.parse(JSON.stringify(results[1][0]));
    
                 res.render('pages/add-invt.ejs', {
                    siteTitle: siteTitle,
                    pageTitle: "Add Inventory Entry",
                    item: result,
                    item2: result2
                });
        });

  };
  
  controller.add = (req, res) => {

      var insertQuery = "INSERT INTO `bullseyedb`.`inventory` (`itemID`, `siteID`, `quantity`, `itemLocation`, `reorderThreshold`, `maxReorderWarning`) VALUES ('";
      insertQuery += SqlString(req.body.itemID) + ", ";
      insertQuery += SqlString(req.body.siteID) + ", ";
      insertQuery += SqlString(req.body.quantity) + ", ";
      insertQuery += SqlString(req.body.itemLocation) + ", ";
      insertQuery += SqlString(req.body.reorderThreshold) + ", ";
      insertQuery += SqlString(req.body.maxReorderWarning);
      insertQuery += "');"
          
            conn.query(insertQuery, function(err, result) {
        
                if(err) {
                    console.log(err);
                }
          
                if(result) {
                    res.redirect("/admin/invt");
                }
                
            });
    

    
  };
  
  controller.updateInfo = (req, res) => {


    var searchQuery = "SELECT * FROM INVENTORY WHERE itemID = " + SqlString(req.params.itemID) + ";";
    var searchQuery2 = "SELECT * FROM SUPPLIER;";


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
    

           var result = JSON.parse(JSON.stringify(results[0][0]));
            var result2 = JSON.parse(JSON.stringify(results[1][0]));
    
                 res.render('pages/edit-invt.ejs', {
                    siteTitle: siteTitle,
                    pageTitle: "Edit Inventory Entry",
                    item: result,
                    item2: result2
                });
        });
  
  };
  
  controller.update = (req, res) => {



    var updateQuery = "UPDATE INVENTORY SET ";
    updateQuery += "quantity = " + SqlString(req.body.quantity) + ", ";
    updateQuery += "itemLocation = " + SqlString(req.body.itemLocation) + ", ";
    updateQuery += "reorderThreshold = " + SqlString(req.body.reorderThreshold) + ", ";
    updateQuery += "maxReorderWarning = " + SqlString(req.body.maxReorderWarning) + " ";
        updateQuery += "WHERE itemID = " + SqlString(req.body.itemID) + " AND siteID = " + SqlString(req.body.siteID) + ";";


    
    
    conn.query(updateQuery, function (err, result) {


    
        if(result) {
            res.redirect("/admin/invt");
        }
    
        if(err) {
            console.log(err);
            console.log("This site cannot be edited due to being in use.");
            res.redirect("/admin/invt");
        } 
    })
  
  };
  
  controller.delete = (req, res) => {
  
    var deleteQuery = "DELETE FROM INVENTORY WHERE itemID = ";
    deleteQuery += SqlString(req.params.itemID) + ";";
  
    conn.query(deleteQuery, function(err, result) {
  
        if(result) {
            res.redirect("/admin/invt");
        }
        
        if(err) {
            console.log(err);
            res.redirect("/admin/crud/invt");
        } 
        
    });
  
  }

  module.exports = controller;