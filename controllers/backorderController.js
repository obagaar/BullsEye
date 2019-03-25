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

    if(positionID === 6 || positionID === 4 ||positionID === 99999999 || positionID < 3) {

      var searchQuery = "SELECT * FROM txn t INNER JOIN site s ON t.siteIDTo = s.siteID WHERE txnType = 'Back Order' GROUP BY t.siteIDTo;";

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

    var txnID = req.params.txnID;
    var orderQuery = "SELECT * FROM txnitems ti INNER JOIN item i ON ti.itemID = i.itemID where txnID = " + txnID + ";";
  
    conn.query(orderQuery, function(err, results) {
  
      if(err) {
  
        console.log(err);
        res.redirect("/err/orders");
  
      } else {

 
        res.render('pages/add-backorder.ejs', {
          siteTitle: siteTitle,
          pageTitle: "Add Back Order",
          items: results,
          txnID: txnID,
          userInfo: req.user.userInfo
        });
  
      }
  
    })
  

  };

  //Uses what was entered in the page's form to build a query then send to the database an update it
//Errors result in a page advising to recheck entry then takes user back to index  
controller.add = (req, res) => {

  var txnID = req.body.txnID;
  var itemInfo = req.body.itemInfo;
  var backOrderItemIDs = [];
  var backOrderItemQuantity = [];
 

  if(itemInfo !== undefined && itemInfo !== null) {


    for(var i = 0; i < itemInfo.length-1; i++) {

      var itemParts = itemInfo[i].split(",");
      var itemStatus = itemParts[0];
      var itemID = itemParts[1];
      var itemQuantity = itemParts[2];

      backOrderItemIDs.push(itemID);
      backOrderItemQuantity.push(itemQuantity);

    }

    var txnID = req.params.txnID;
    var orderQuery = "SELECT * FROM txnitems ti INNER JOIN item i ON ti.itemID = i.itemID INNER JOIN txn t ON ti.txnID = t.txnID where ti.txnID = " + txnID + ";";
  
    conn.query(orderQuery, function(err, results) {
  
      if(err) {
  
        console.log(err);
        res.redirect("/err/orders");
  
      } else {

        res.render('pages/add-backorder2.ejs', {
          siteTitle: siteTitle,
          pageTitle: "Add Back Order",
          backOrderItemIDs: backOrderItemIDs,
          backOrderItemQuantity: backOrderItemQuantity,
          items: results,
          txnID: txnID,
          userInfo: req.user.userInfo
      });
  
      }
  
    })
  

  } else {
    res.redirect('/orders');
  }
  
  
};

controller.nextAdd = (req, res) => {

  var siteID = req.body.siteID;
  var itemIDs = req.body.itemID;
  var itemQuantity = req.body.itemQuantity;

  var currentTime = new Date();
  var shipDate;
  var emergStatus = req.body.emergencyOrder;
  var orderType = 0;

  if (emergStatus === "false") {

    shipDate = new Date(currentTime.setDate(currentTime.getDate() + 7));
    orderType = 0;

  } else {

    shipDate = new Date(currentTime.setDate(currentTime.getDate() + 1));
    orderType = 1;
  }

  var insertQuery = "INSERT INTO txn (`siteIDTo`, `siteIDFrom`, `status`, `shipDate`, `txnType`, `barCode`, `createdDate`, `emergencyDelivery`) VALUES (";
  insertQuery += " " + siteID +", "+ siteID + ", 'Pending Back Order', ";
  insertQuery += SqlString(dateFormat(shipDate, "yyyy-mm-dd")) + ", ";
  insertQuery += "'Back Order', ";
  insertQuery += "'111222333444', ";
  insertQuery += "curdate(), ";
  insertQuery += orderType;
  insertQuery += ");"


  conn.query(insertQuery, function (err, result) {

    if (err) {
      console.log(err);
      res.redirect("/err/orders");
    }

    if (result) {

      console.log(result.insertId);

      var txnID = result.insertId;
      
      if(itemIDs !== undefined && itemIDs !== null && itemIDs.length > 0) {

        for (var i = 0; i < itemIDs.length; i++) {
      
          if(itemQuantity[i] !== null && itemQuantity[i] > 0) {
    
              var insertQuery = "INSERT INTO `txnitems` (`txnID`, `ItemID`, `quantity`) VALUES (" + txnID + ", " + itemIDs[i] + ", " + itemQuantity[i] + ");";
      
               conn.query(insertQuery, function(err, result) {
      
          
                if(err) {
            
                  console.log(err);
                  res.redirect("/err/orders");
                }
            
              })

              
          } 
      
         }
      
      }

      res.redirect('/orders/submit/backorder/' + txnID);

    }

  });
  
}

controller.submit = (req, res) => {

  var txnID = req.params.txnID;

  var txnQuery = "SELECT *, i.name as name, s.name as supplierName FROM txnitems ti INNER JOIN item i ON ti.ItemID = i.itemID INNER JOIN supplier s ON i.supplierID = s.supplierID INNER jOIN txn t ON ti.txnID = t.txnID WHERE ti.txnID = " + txnID + ";";
  var sitesQuery = "SELECT * FROM site;";

  function doQuery1() {
    var defered = q.defer();
    conn.query(txnQuery, defered.makeNodeResolver());
    return defered.promise;
  }

  function doQuery2() {
    var defered = q.defer();
    conn.query(sitesQuery, defered.makeNodeResolver());
    return defered.promise;
  }

  q.all([doQuery1(), doQuery2()]).then(function (results, err) {


    
    var result = JSON.parse(JSON.stringify(results[0][0]));
    var result2 = JSON.parse(JSON.stringify(results[1][0]));


    res.render('pages/add-backorderSubmit.ejs', {
      siteTitle: siteTitle,
      pageTitle: "New Back Order - submit",
      items: result,
      items2: result2,
      txnID: req.params.txnID,
      userInfo: req.user.userInfo
    });

    if (err) {

      console.log(err);
      res.redirect("/err/orders");
    }


  });



}

controller.fulfill = (req, res) => {

  var txnID = req.params.txnID;

    var orderQuery = "SELECT * FROM txnitems ti INNER JOIN item i ON ti.itemID = i.itemID where txnID = " + txnID + ";";

    conn.query(orderQuery, function(err, results) {

      if(err) {
  
        console.log(err);
        res.redirect("/err/orders");
  
      } else {
  
        res.render('pages/fulfill-backorder.ejs', {
          siteTitle: siteTitle,
          pageTitle: "Fulfill Back Order",
          items: results,
          txnID: txnID,
          userInfo: req.user.userInfo
        });
  
      }
  
    })

};

controller.fulfillAdd = (req,res) => {

  var txnID = req.params.txnID;

  var statusQuery = "UPDATE txn SET `status` = 'Assembled' WHERE (`txnID` = "+ txnID + ");";

  conn.query(statusQuery, function(err, results) {

    if(err) {
     
      console.log(err);

      res.redirect("/err/orders");
    } else {

      res.redirect('/orders/backorder');

    }

  })


}


   //Exports all methods to be used for routing
   module.exports = controller;