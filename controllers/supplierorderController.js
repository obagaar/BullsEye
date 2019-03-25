//Imports of packages to be called on later for use in queries
const express = require('express');
const http = require('http');
const mysql = require('mysql');
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
function getConnection() {

  return pool
}

//Constants for the site's tite, the connection and array for controller methods to be returned
const siteTitle = "BullsEye Sporting Goods";
const conn = getConnection();
const controller = {};

controller.getInfo = (req, res) => {
  var siteID = Number(req.user.userInfo.siteID);

  var backorderQuery = "SELECT * , i.name as itemName, s.name as supplierName FROM txnitems ti INNER JOIN txn t ON ti.txnID = t.txnID INNER JOIN item i ON ti.ItemID = i.itemID INNER JOIN inventory iy ON i.itemID = iy.itemID INNER JOIN supplier s ON i.supplierID = s.supplierID WHERE txnType ='Back Order' AND status = 'Pending Back Order'GROUP BY i.itemID;"

  var searchQuery = "SELECT * , i.name as itemName, s.name as supplierName FROM inventory iy INNER JOIN item i ON iy.itemID = i.itemID INNER JOIN supplier s ON i.supplierID = s.supplierID WHERE quantity < reorderThreshold";

  var sitesQuery = "SELECT * FROM site";

  function doQuery1() {
    var defered = q.defer();
    conn.query(backorderQuery, defered.makeNodeResolver());
    return defered.promise;
  }

  function doQuery2() {
    var defered = q.defer();
    conn.query(sitesQuery, defered.makeNodeResolver());
    return defered.promise;
  }

  function doQuery3() {
    var defered = q.defer();
    conn.query(searchQuery, defered.makeNodeResolver());
    return defered.promise;
  }


  q.all([doQuery1(), doQuery2(), doQuery3()]).then(function (results, err) {



    var result = JSON.parse(JSON.stringify(results[0][0]));
    var result2 = JSON.parse(JSON.stringify(results[1][0]));
    var result3 = JSON.parse(JSON.stringify(results[2][0]));

 
    res.render('pages/add-supplierorder.ejs', {
      siteTitle: siteTitle,
      pageTitle: "New Supplier Order",
      items: result,
      items2: result2,
      items3: result3,
      userInfo: req.user.userInfo
    });

    if (err) {

      console.log(err);
      res.redirect("/err/orders");
    }


  });

};

controller.nextAdd = (req, res) => {

  var itemReorderIDs = req.body.itemtoReorderID;
  var itemReorderNames = req.body.itemtoReorderName;
  var itemReorderMax = req.body.itemtoReorderMax;
  var itemReorderQuantity = req.body.itemtoReorderQuantity;
  var itemReorderThreshold = req.body.itemtoReorderThreshold;
  var itemReorderSuppliers = req.body.itemtoReorderSupplier;
  var itemBackorderIDs = req.body.itemBackorderID;
  var itemBackorderNames = req.body.itemBackorderName;
  var itemBackorderMax = req.body.itemBackorderMax;
  var itemBackorderQuantity = req.body.itemBackorderQuantity;
  var itemBackorderThreshold = req.body.itemBackorderThreshold;
  var itemBackorderSuppliers = req.body.itemBackorderSupplier;

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
  insertQuery += SqlString(req.body.siteIDFrom) + ", ";
  insertQuery += " 1, ";
  insertQuery += "'In progress', ";
  insertQuery += SqlString(dateFormat(shipDate, "yyyy-mm-dd")) + ", ";
  insertQuery += "'Supplier Order', ";
  insertQuery += "'111222333444', ";
  insertQuery += "curdate(), ";
  insertQuery += orderType;
  insertQuery += ");";

  var suppQuery = "SELECT * FROM SUPPLIER";

  function doQuery1() {
    var defered = q.defer();
    conn.query(insertQuery, defered.makeNodeResolver());
    return defered.promise;
  }

  function doQuery2() {
    var defered = q.defer();
    conn.query(suppQuery, defered.makeNodeResolver());
    return defered.promise;
  }


  q.all([doQuery1(), doQuery2()]).then(function (results, err) {

    var result = JSON.parse(JSON.stringify(results[0][0]));
    var result2 = JSON.parse(JSON.stringify(results[1][0]));

  
    res.render('pages/add-supplierorderNext.ejs', {

      siteTitle: siteTitle,
      pageTitle: "New Supplier Order - Add Items",
      items: result,
      items2: result2,
      reorderItemIds: itemReorderIDs,
      reorderItemNames: itemReorderNames,
      reorderItemMax: itemReorderMax,
      reorderItemQuantity: itemReorderQuantity,
      reorderItemThreshold: itemReorderThreshold,
      reorderItemSuppliers: itemReorderSuppliers,
      backorderItemIds: itemBackorderIDs,
      backorderNames: itemBackorderNames,
      backorderMax: itemBackorderMax,
      backorderQuantity: itemBackorderQuantity,
      backorderThreshold: itemBackorderThreshold,
      backorderSuppliers: itemBackorderSuppliers,
      txnID: req.params.txnID,
      userInfo: req.user.userInfo
    });

    if (err) {

      console.log(err);
      res.redirect("/err/orders");
    }


  });


}

controller.nextAdd2 = (req, res) => {
  
  var txnID = req.body.txnID;
  var supplier = req.body.supplier;
  var itemReorderIDs = req.body.itemReorderID;
  var itemReorderNames = req.body.itemReorderName;
  var itemReorderSuppliers = req.body.itemReorderSupplier;
  var itemReorderQuantity = req.body.itemReorderQuantity;

  
  if(itemReorderIDs !== undefined && itemReorderIDs !== null && itemReorderIDs.length > 0) {

    for (var i = 0; i < itemReorderIDs.length; i++) {
  
      if(itemReorderQuantity[i] !== null && itemReorderQuantity[i] > 0) {

        if(itemReorderSuppliers[i] === supplier) {

          var insertQuery = "INSERT INTO `txnitems` (`txnID`, `ItemID`, `quantity`) VALUES (" + txnID + ", " + itemReorderIDs[i] + ", " + itemReorderQuantity[i] + ");";
  
           conn.query(insertQuery, function(err, result) {
  
      
            if(err) {
        
              console.log(err);
              res.redirect("/err/orders");
            }
        
          })

        }
          
      } 
  
     }
  
  }

  res.redirect('/orders//supplier/submit/' + txnID);

}

/* controller.nextAddNew = (req, res) => {

  var txnID = req.params.txnID;

  var orderQuery = "SELECT *, s.name as supplierName FROM txnitems ti INNER JOIN item i ON ti.ItemID = i.itemID INNER JOIN supplier s ON i.supplierID = s.supplierID WHERE txnID = " + txnID + ";";


  conn.query(orderQuery, function(err, result) {

          res.render('pages/add-supplierorderNext2.ejs', {

        siteTitle: siteTitle,
        pageTitle: "New Supplier Order - Add Items",
        items: result,
        txnID: req.params.txnID,
        userInfo: req.user.userInfo
      });


  })
}


controller.nextAdd3 = (req, res) => {


console.log(req.body);


  
} */

controller.submitInfo = (req, res) => {

  var txnID = req.params.txnID;

  var txnQuery = "SELECT *, i.name as name, s.name as supplierName FROM txnitems ti INNER JOIN item i ON ti.ItemID = i.itemID INNER JOIN supplier s ON i.supplierID = s.supplierID INNER jOIN txn t ON ti.txnID = t.txnID WHERE ti.txnID = " + txnID + ";";
  var orderQuery = "UPDATE txn SET `status` = 'Assembled' WHERE (`txnID` = "+ txnID + ");";
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

  function doQuery3() {
    var defered = q.defer();
    conn.query(orderQuery, defered.makeNodeResolver());
    return defered.promise;
  }

  q.all([doQuery1(), doQuery2(), doQuery3()]).then(function (results, err) {


    
    var result = JSON.parse(JSON.stringify(results[0][0]));
    var result2 = JSON.parse(JSON.stringify(results[1][0]));
    var result3 = JSON.parse(JSON.stringify(results[2][0]));


    res.render('pages/add-supplierorderSubmit.ejs', {
      siteTitle: siteTitle,
      pageTitle: "New Supplier Order - submit",
      items: result,
      items2: result2,
      items3: result3,
      txnID: req.params.txnID,
      userInfo: req.user.userInfo
    });

    if (err) {

      console.log(err);
      res.redirect("/err/orders");
    }


  });

}

controller.receive = (req, res) => {

  var txnID = req.params.txnID;
  var orderQuery = "SELECT *, i.name as name, s.name as supplierName FROM txnitems ti INNER JOIN item i ON ti.ItemID = i.itemID INNER JOIN supplier s ON i.supplierID = s.supplierID INNER jOIN txn t ON ti.txnID = t.txnID WHERE ti.txnID = " + txnID + ";";

  conn.query(orderQuery, function(err, results) {

    if(err) {

      console.log(err);
      res.redirect("/err/orders");

    } else {

      res.render('pages/receive-supplierorder.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Receive Supplier Order",
        items: results,
        txnID: txnID,
        userInfo: req.user.userInfo
      });

    }

  })

};

controller.scan = (req, res) => {

  var itemID = req.params.itemID;
  var quantity = req.params.quantity;
  var txnID = req.params.txnID;

  var updateQuery = "UPDATE inventory SET quantity = '" + quantity +"' WHERE (itemID = '" + itemID + "') AND (siteID = '2');";

  conn.query(updateQuery, function(err, result) {

if(err) {

  console.log(err);
  res.redirect("/err/orders");
} else {

  res.redirect("/orders/receive/supplier/" + txnID);

}


  })

};

controller.complete = (req,res) => {

  var txnID = req.params.txnID;

  var orderQuery = "UPDATE txn SET `status` = 'Complete' WHERE (`txnID` = "+ txnID + ");";


  conn.query(orderQuery, function(err, result){

if(err){

  console.log(err);
  res.redirect("/err/orders");
} else {

  res.redirect("/orders");
}



  })


}


//Exports all methods to be used for routing
module.exports = controller;