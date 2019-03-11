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
  
//Reads all backorders then displays them with actions available base don permission levels
  controller.read = (req, res) => {

    var siteID = Number(req.user.userInfo.siteID);
    var positionID = req.user.userInfo.PositionID;

    if(positionID === 4 || positionID === 99999999 || positionID < 3) {

      var searchQuery = "SELECT * FROM txn t INNER JOIN site s ON t.siteIDTo = s.siteID WHERE txnType = 'Back Order';";

    } else {

      var searchQuery = "SELECT * FROM txn t INNER JOIN site s ON t.siteIDTo = s.siteID WHERE siteIDTo = " + siteID + " AND txnType = 'Back Order';";

    }
    
    var searchQuery2 = "SELECT * FROM site";

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

      res.render('pages/index-backorder.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Back Orders",
        items: result,
        items2: result2,
        userInfo: req.user.userInfo
    });

    if(err) {

      res.redirect("/err/site");
   }
  });






  };

  //Directs to page to add a backorder along with information from look up tables after querying the database
  controller.getAdd = (req, res) => {

    conn.query("SELECT * FROM ITEM", function(err, result) {
    res.render('pages/add-order.ejs', {
      siteTitle: siteTitle,
      pageTitle: "Add Order",
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

  
  
};


   //Exports all methods to be used for routing
   module.exports = controller;