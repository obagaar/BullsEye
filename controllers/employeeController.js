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
    
    conn.query("SELECT * FROM EMPLOYEE", function(err, result) {
      res.render('pages/index-emp.ejs', {
          siteTitle: siteTitle,
          pageTitle: "Employees",
          items: result,
          userInfo: req.user.userInfo
      });
 if(err) {

    res.redirect("/err/emp");
 }

    });

  };
//Directs to page to add an entry along with information from look up tables after querying the database
  controller.getAdd = (req, res) => {

        var searchQuery = "SELECT * FROM POSN";
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
    
                 res.render('pages/add-emp.ejs', {
                    siteTitle: siteTitle,
                    pageTitle: "Add Employee",
                    item: result,
                    item2: result2
                });

                if(err) {

                    res.redirect("/err/emp");
                 }
        });

  };

  //Uses what was entered in the page's form to build a query then send to the database an update it
//Errors result in a page advising to recheck entry then takes user back to index  
  controller.add = (req, res) => {

        
            var insertQuery = "INSERT INTO `bullseyedb`.`employee` ( `Password`, `FirstName`, `LastName`, `Email`, `active`, `PositionID`, `siteID`)";
            insertQuery += " VALUES (" + SqlString(req.body.Password) + ", ";
            insertQuery += SqlString(req.body.FirstName) + ", " 
            insertQuery += SqlString(req.body.LastName) + ", ";
            insertQuery += SqlString(req.body.Email) + ", " 
            insertQuery += SqlString(req.body.active) + ", " 
            insertQuery += SqlString(req.body.PositionID) + ", " 
            insertQuery += SqlString(req.body.siteID) + ");";
          
            conn.query(insertQuery, function(err, result) {
        
                if(err) {

                    res.redirect("/err/emp");
                 }
          
                if(result) {
                    res.redirect("/admin/emp");
                }
                
            });
    

    
  };
  
  //Directs to page to edit entry along with sending information from queries from look up tables
//The queries populate drop down menus used to edit
  controller.updateInfo = (req, res) => {
  
    var searchQuery = "SELECT * FROM EMPLOYEE WHERE employeeID = " + SqlString(req.params.employeeID) + ";";
    var searchQuery2 = "SELECT * FROM POSN;";
    var searchQuery3 = "SELECT * FROM SITE;";


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

             res.render('pages/edit-emp.ejs', {
                siteTitle: siteTitle,
                pageTitle: "Edit Employee",
                item: result,
                item2: result2,
                item3: result3


            });

            if(err) {

                res.redirect("/err/emp");
             }

    });
  
  };
  
  //Uses the information edited and sends it to update the database
//Also directs to a page advising of errors if there are any
  controller.update = (req, res) => {

     var updateQuery = "UPDATE Employee SET `Password` = " + SqlString(req.body.Password) + ", ";
        updateQuery += "`FirstName` = " + SqlString(req.body.FirstName) + ", ";
        updateQuery += "`LastName` = " + SqlString(req.body.LastName) + ", ";
        updateQuery += "`Email` = " + SqlString(req.body.Email) + ", ";
        updateQuery += "`active` = " + SqlString(req.body.active) + ", ";
        updateQuery += "`PositionID` = " + SqlString(req.body.PositionID) + ", ";
        updateQuery += "`siteID` = " + SqlString(req.body.siteID) + " "; 
        updateQuery += " WHERE employeeID = " + SqlString(req.body.employeeID) + ";";


    
    
    conn.query(updateQuery, function (err, result) {


    
        if(result) {
            res.redirect("/admin/emp");
        }
    
        if(err) {

            res.redirect("/err/emp");
         }
    })
  
  };
  
  //Deletes the selected entry by sending a query to the database
//Also directs to a page advising of errors if there are any
  controller.delete = (req, res) => {
  
    var deleteQuery = "DELETE FROM employee WHERE employeeID = ";
    deleteQuery += SqlString(req.params.employeeID) + "";
  
    conn.query(deleteQuery, function(err, result) {
  
        if(result) {
            res.redirect("/admin/emp");
        }
        
        if(err) {

            res.redirect("/err/emp");
         }
        
    });
  
  }
//Exports all methods to be used for routing
  module.exports = controller;