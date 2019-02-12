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

  //First method with query to select all then send to index page to display all rows with available actions
  controller.read = (req, res) => {
    
    var searchQuery = "SELECT i.itemID, it.name, i.siteID, i.quantity, i.itemLocation, i.reorderThreshold, i.maxReorderWarning";
    searchQuery += " FROM inventory i INNER JOIN item it ON i.itemID = it.itemID;";
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

    
        q.all([doQuery1(),doQuery2()]).then(function(results, err){
    

           var result = JSON.parse(JSON.stringify(results[0][0]));
            var result2 = JSON.parse(JSON.stringify(results[1][0]));
    
                 res.render('pages/index-invt.ejs', {
                    siteTitle: siteTitle,
                    pageTitle: "Add Inventory Entry",
                    item: result,
                    item2: result2,
                });

                if(err) {

                    res.redirect("/err/invt");
                 }

        });
 


  };

  //Directs to page to add an entry along with information from look up tables after querying the database
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
    
        q.all([doQuery1(),doQuery2()]).then(function(results, err){
    

           var result = JSON.parse(JSON.stringify(results[0][0]));
            var result2 = JSON.parse(JSON.stringify(results[1][0]));
    
                 res.render('pages/add-invt.ejs', {
                    siteTitle: siteTitle,
                    pageTitle: "Add Inventory Entry",
                    item: result,
                    item2: result2
                });

                if(err) {

                    res.redirect("/err/invt");
                 }

        });

  };
  
    //Uses what was entered in the page's form to build a query then send to the database an update it
//Errors result in a page advising to recheck entry then takes user back to index  
  controller.add = (req, res) => {

      var insertQuery = "INSERT INTO `bullseyedb`.`inventory` (`itemID`, `siteID`, `quantity`, `itemLocation`, `reorderThreshold`, `maxReorderWarning`) VALUES (";
      insertQuery += SqlString(req.body.itemID) + ", ";
      insertQuery += SqlString(req.body.siteID) + ", ";
      insertQuery += SqlString(req.body.quantity) + ", ";
      insertQuery += SqlString(req.body.itemLocation) + ", ";
      insertQuery += SqlString(req.body.reorderThreshold) + ", ";
      insertQuery += SqlString(req.body.maxReorderWarning);
      insertQuery += ");"
          
            conn.query(insertQuery, function(err, result) {
        
                if(err) {
                    console.log(err);
                    res.redirect("/err/invt");
                 }
          
                if(result) {
                    res.redirect("/admin/invt");
                }
                
            });
    

    
  };
  
    //Directs to page to edit entry along with sending information from queries from look up tables
//The queries populate drop down menus used to edit
  controller.updateInfo = (req, res) => {

    console.log(req.params);

    var searchQuery = "SELECT * FROM INVENTORY WHERE itemID = " + SqlString(req.params.itemID) + " AND siteID = " + SqlString(req.params.siteID) + ";" ;
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
    
        q.all([doQuery1(),doQuery2()]).then(function(results, err){
    

           var result = JSON.parse(JSON.stringify(results[0][0]));
            var result2 = JSON.parse(JSON.stringify(results[1][0]));
    
                 res.render('pages/edit-invt.ejs', {
                    siteTitle: siteTitle,
                    pageTitle: "Edit Inventory Entry",
                    item: result,
                    item2: result2
                });

                if(err) {

                    res.redirect("/err/invt");
                 }
        });
  
  };
  
    //Uses the information edited and sends it to update the database
//Also directs to a page advising of errors if there are any
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
            res.redirect("/err/invt");
         }
    })
  
  };
  
   //Deletes the selected entry by sending a query to the database
//Also directs to a page advising of errors if there are any
  controller.delete = (req, res) => {
  
    var deleteQuery = "DELETE FROM INVENTORY WHERE itemID = ";
    deleteQuery += SqlString(req.params.itemID) + "AND siteID = " + SqlString(req.params.siteID) +";";
  
    conn.query(deleteQuery, function(err, result) {
  
        if(result) {
            res.redirect("/admin/invt");
        }
        
        if(err) {

            res.redirect("/err/invt");
         }
        
    });
  
  }

  //Exports all methods to be used for routing
  module.exports = controller;