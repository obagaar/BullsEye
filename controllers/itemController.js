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
    
    var searchQuery ="SELECT * FROM ITEM";
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

             res.render('pages/add-item.ejs', {
                siteTitle: siteTitle,
                pageTitle: "Add Item",
                item: result,
                item2: result2
            });

            if(err) {

                res.redirect("/err/item");
             }
    });


  };

  //Directs to page to add an entry along with information from look up tables after querying the database
  controller.getAdd = (req, res) => {

    var searchQuery = "SELECT * FROM SUPPLIER;";
    var searchQuery2 = "SELECT * FROM CATEGORY;";


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

             res.render('pages/add-item.ejs', {
                siteTitle: siteTitle,
                pageTitle: "Add Item",
                item: result,
                item2: result2
            });

            if(err) {

                res.redirect("/err/item");
             }
    });


  };

    //Uses what was entered in the page's form to build a query then send to the database an update it
//Errors result in a page advising to recheck entry then takes user back to index  
  controller.add = (req, res) => {


    var insertQuery = " INSERT INTO `bullseyedb`.`item` (`name`, `sku`, `description`, `category`, `weight`, `costPrice`, `retailPrice`, `supplierID`, `active`, `notes`, `caseSize`) ";
   insertQuery += "VALUES (";
   insertQuery += SqlString(req.body.name) + ", ";
   insertQuery += SqlString(req.body.sku) + ", ";
   insertQuery += SqlString(req.body.description) + ", ";
   insertQuery += SqlString(req.body.category) + ", ";
   insertQuery += SqlString(req.body.weight) + ", ";
   insertQuery += SqlString(req.body.costPrice) + ", ";
   insertQuery += SqlString(req.body.retailPrice) + ", ";
   insertQuery += SqlString(req.body.supplier) + ", ";
   insertQuery += SqlString(req.body.active) + ", ";
   insertQuery += SqlString(req.body.notes) + ", ";
   insertQuery += SqlString(req.body.caseSize);
      insertQuery += ");";
   

          
            conn.query(insertQuery, function(err, result) {
        
                if(err) {

                    res.redirect("/err/item");
                 }
          
                if(result) {
                    res.redirect("/admin/item");
                }
                
            });


    
  };
  
    //Directs to page to edit entry along with sending information from queries from look up tables
//The queries populate drop down menus used to edit
  controller.updateInfo = (req, res) => {
  
    var searchQuery = "SELECT * FROM ITEM WHERE itemID = " + SqlString(req.params.itemID) + ";";
    var searchQuery2 = "SELECT * FROM SUPPLIER;";
    var searchQuery3 = "SELECT * FROM CATEGORY;";


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

    function doQuery3(){
        var defered = q.defer();
        conn.query(searchQuery3,defered.makeNodeResolver());
        return defered.promise;
    }

    q.all([doQuery1(),doQuery2(),doQuery3()]).then(function(results, err){


       var result = JSON.parse(JSON.stringify(results[0][0]));
        var result2 = JSON.parse(JSON.stringify(results[1][0]));
        var result3 = JSON.parse(JSON.stringify(results[2][0]));

             res.render('pages/edit-item.ejs', {
                siteTitle: siteTitle,
                pageTitle: "Edit Item",
                item: result,
                item2: result2,
                item3: result3
            });

            if(err) {

                res.redirect("/err/item");
             }

    });
  
  };
  
    //Uses the information edited and sends it to update the database
//Also directs to a page advising of errors if there are any
  controller.update = (req, res) => {


    console.log(req.body);

    var updateQuery = "UPDATE ITEM SET ";
    updateQuery += "name = " + SqlString(req.body.name) + ", ";
    updateQuery += "sku = " + SqlString(req.body.sku) + ", ";
    updateQuery += "description = " + SqlString(req.body.description) + ", ";
    updateQuery += "category = " + SqlString(req.body.category) + ", ";
    updateQuery += "weight = " + SqlString(req.body.weight) + ", ";
    updateQuery += "costPrice = " + SqlString(req.body.costPrice) + ", ";
    updateQuery += "retailPrice = " + SqlString(req.body.retailPrice) + ", ";
    updateQuery += "supplierID = " + SqlString(req.body.supplier) + ", ";
    updateQuery += "active = " + SqlString(req.body.active) + ", ";
    updateQuery += "notes = " + SqlString(req.body.notes) + ", ";
    updateQuery += "caseSize = " + SqlString(req.body.caseSize) + " ";
    updateQuery += "WHERE itemID = " + SqlString(req.body.itemID) + ";";

  
    
    conn.query(updateQuery, function (err, result) {


    
        if(result) {
            res.redirect("/admin/item");
        }
    
        if(err) {

            res.redirect("/err/item");
         }
    })
  
  };
  
   //Deletes the selected entry by sending a query to the database
//Also directs to a page advising of errors if there are any
  controller.delete = (req, res) => {
  
    var deleteQuery = "DELETE FROM ITEM WHERE itemID = ";
    deleteQuery += SqlString(req.params.itemID) + ";";
  
    conn.query(deleteQuery, function(err, result) {
  
        if(result) {
            res.redirect("/admin/item");
        }
        
        if(err) {

            res.redirect("/err/item");
         }
        
    });
  
  }

  //Exports all methods to be used for routing
  module.exports = controller;