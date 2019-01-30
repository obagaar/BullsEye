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
        
            var insertQuery = "INSERT INTO `bullseyedb`.`supplier` ( `name`, `address1`, `address2`, `city`, `country`, `province`, `postalcode`, `phone`, `contact`)";insertQuery += " VALUES ('" + req.body.name + "', " + "'" + req.body.address1 + "', '" + req.body.address2 + "', ";
            insertQuery += "'" + req.body.city + "', " + "'" + req.body.country + "', " + "'" + req.body.province + "', " + "'" + req.body.postalcode + "', " + "'" + req.body.phone + "', " + "'" + req.body.contact + "');";
          
            conn.query(insertQuery, function(err, result) {
        
                if(err) {
                    console.log(err);
                }
          
                if(result) {
                    res.redirect("/admin/crud/supp");
                }
                
            });
        
        }

      });
    

    
  };
  
  controller.updateInfo = (req, res) => {
  
    var searchQuery = "SELECT * FROM SUPPLIER WHERE supplierID = '" + req.params.supplierID + "';";
  
    conn.query(searchQuery, function(err, result) {


        console.log(result);
 
        if(result) {
            res.render('pages/edit-supp.ejs', {
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
  
     var updateQuery = "UPDATE supplier SET `name` = '" + req.body.name + "', ";
        updateQuery += "`address1` = '" + req.body.address1 + "', ";
        updateQuery += "`address2` = '" + req.body.address2 + "', ";
        updateQuery += "`city` = '" + req.body.city + "', ";
        updateQuery += "`country` = '" + req.body.country + "', ";
        updateQuery += "`province` = '" + req.body.province + "', ";
        updateQuery += "`postalcode` = '" + req.body.postalcode + "', ";
        updateQuery += "`phone` = '" + req.body.phone + "', ";
        updateQuery += "`contact` = '" + req.body.contact + "'" ;   
        updateQuery += " WHERE supplierID = " + req.body.supplierID + ";";


    
    
    conn.query(updateQuery, function (err, result) {


    
        if(result) {
            res.redirect("/admin/crud/supp");
        }
    
        if(err) {
            console.log(err);
            console.log("This site cannot be edited due to being in use.");
            res.redirect("/admin/crud/supp");
        } 
    })
  
  };
  
  controller.delete = (req, res) => {
  
    var deleteQuery = "DELETE FROM SUPPLIER WHERE supplierID = '";
    deleteQuery += req.params.supplierID + "'";
  
    conn.query(deleteQuery, function(err, result) {
  
        if(result) {
            res.redirect("/admin/crud/supp");
        }
        
        if(err) {
            console.log(err);
        } 
        
    });
  
  }

  module.exports = controller;