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
    
    conn.query("SELECT * FROM SUPPLIER", function(err, result) {
      res.render('pages/index-supp.ejs', {
          siteTitle: siteTitle,
          pageTitle: "Suppliers",
          items: result,
          userInfo: req.user.userInfo
      });


      if(err) {

        res.redirect("/err/supp");
     }
    });

  };

  //Directs to page to add an entry along with information from look up tables after querying the database
  controller.getAdd = (req, res) => {

    conn.query("SELECT * FROM PROVINCE", function(err, result) {

    res.render('pages/add-supp.ejs', {
      siteTitle: siteTitle,
      pageTitle: "Add Supplier",
      items: result
      
  });

  if(err) {

    res.redirect("/err/supp");
 }
});


  };
  
    //Uses what was entered in the page's form to build a query then send to the database an update it
//Errors result in a page advising to recheck entry then takes user back to index  
  controller.add = (req, res) => {

    var numofSites = 0;

    conn.query("SELECT * FROM SUPPLIER", function(err, result) {

          if(result) {
              
            numofSites = result.length+1; 

            
        
            var insertQuery = "INSERT INTO `bullseyedb`.`supplier` ( `name`, `address1`, `address2`, `city`, `country`, `province`, `postalcode`, `phone`, `contact`)";insertQuery += " VALUES (" + SqlString(req.body.name) + ", " 
            + SqlString(req.body.address1) + ", " 
            + SqlString(req.body.address2) + ", " ;
            insertQuery += SqlString(req.body.city) + " , " 
            + SqlString(req.body.country) + " , " 
            + SqlString(req.body.province) + " , " 
            + SqlString(req.body.postalcode) + " , " 
            + SqlString(req.body.phone) + " , " 
            + SqlString(req.body.contact) + ");";
          
            conn.query(insertQuery, function(err, result) {
        
                if(err) {

                    res.redirect("/err/supp");
                 }
          
                if(result) {
                    res.redirect("/admin/supp");
                }
                
            });
        
        }

      });
    
     
  };
  
    //Directs to page to edit entry along with sending information from queries from look up tables
//The queries populate drop down menus used to edit
  controller.updateInfo = (req, res) => {
  
    var searchQuery = "SELECT * FROM SUPPLIER WHERE supplierID = " + SqlString(req.params.supplierID) + ";";
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

    q.all([doQuery1(),doQuery2()]).then(function(results, err){

        var result = JSON.parse(JSON.stringify(results[0][0][0]));
        var result2 = JSON.parse(JSON.stringify(results[1][0]));

        console.log('result 1' + result);

             res.render('pages/edit-supp.ejs', {
                siteTitle: siteTitle,
                pageTitle: "Edit Supplier: " + result.name,
                item: result,
                item2: result2
            });

            if(err) {

                res.redirect("/err/supp");
             }
    });

  
  };
  
    //Uses the information edited and sends it to update the database
//Also directs to a page advising of errors if there are any
  controller.update = (req, res) => {

     var updateQuery = "UPDATE supplier SET `name` = " + SqlString(req.body.name) + ", ";
        updateQuery += "`address1` = " + SqlString(req.body.address1) + ", ";
        updateQuery += "`address2` = " + SqlString(req.body.address2) + ", ";
        updateQuery += "`city` = " + SqlString(req.body.city) + ", ";
        updateQuery += "`country` = " + SqlString(req.body.country) + ", ";
        updateQuery += "`province` = " + SqlString(req.body.province) + ", ";
        updateQuery += "`postalcode` = " + SqlString(req.body.postalcode) + ", ";
        updateQuery += "`phone` = " + SqlString(req.body.phone) + ", ";
        updateQuery += "`contact` = " + SqlString(req.body.contact);   
        updateQuery += " WHERE supplierID = " + SqlString(req.body.supplierID) + ";";


    
    
    conn.query(updateQuery, function (err, result) {


    
        if(result) {
            res.redirect("/admin/supp");
        }
    
        if(err) {

            res.redirect("/err/supp");
         }
    })

  };
  
   //Deletes the selected entry by sending a query to the database
//Also directs to a page advising of errors if there are any
  controller.delete = (req, res) => {
  
    var deleteQuery = "DELETE FROM SUPPLIER WHERE supplierID = ";
    deleteQuery += SqlString(req.params.supplierID) + ";";
  
    conn.query(deleteQuery, function(err, result) {
  
        if(result) {
            res.redirect("/admin/supp");
        }
        
        if(err) {

            res.redirect("/err/supp");
         }
        
    });

   
  }

//Exports all methods to be used for routing
  module.exports = controller;

  