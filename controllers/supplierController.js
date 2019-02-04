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
    
    conn.query("SELECT * FROM SUPPLIER", function(err, result) {
      res.render('pages/index-supp.ejs', {
          siteTitle: siteTitle,
          pageTitle: "Suppliers",
          items: result
      });
    });

  };

  controller.getAdd = (req, res) => {

    conn.query("SELECT * FROM PROVINCE", function(err, result) {

        console.log(result);
    res.render('pages/add-supp.ejs', {
      siteTitle: siteTitle,
      pageTitle: "Add Supplier",
      items: result
      
  });
});


  };
  
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
                    console.log(err);
                }
          
                if(result) {
                    res.redirect("/admin/supp");
                }
                
            });
        
        }

      });
    
     
  };
  
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

    q.all([doQuery1(),doQuery2()]).then(function(results){


        var result = JSON.parse(JSON.stringify(results[0][0][0]));
        var result2 = JSON.parse(JSON.stringify(results[1][0]));

             res.render('pages/edit-supp.ejs', {
                siteTitle: siteTitle,
                pageTitle: "Edit Supplier: " + result.name,
                item: result,
                item2: result2
            });
    });

  
  };
  
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
            console.log(err);
            console.log("This site cannot be edited due to being in use.");
            res.redirect("/admin/supp");
        } 
    })

  };
  
  controller.delete = (req, res) => {
  
    var deleteQuery = "DELETE FROM SUPPLIER WHERE supplierID = ";
    deleteQuery += SqlString(req.params.supplierID) + ";";
  
    conn.query(deleteQuery, function(err, result) {
  
        if(result) {
            res.redirect("/admin/supp");
        }
        
        if(err) {
            console.log(err);
        } 
        
    });

   
  }


  module.exports = controller;

  