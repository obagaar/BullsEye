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

controller.read = (req, res) => {

  var siteID = Number(req.user.userInfo.siteID);
  var positionID = req.user.userInfo.PositionID;


  if (positionID === 4 || positionID === 99999999 || positionID < 3) {

    var searchQuery = "SELECT * FROM txn t INNER JOIN site s ON t.siteIDTo = s.siteID WHERE t.txnType = 'Store Order' OR t.txnType = 'Supplier Order';";

  } else {

    var searchQuery = "SELECT * FROM txn t INNER JOIN site s ON t.siteIDTo = s.siteID WHERE siteIDTo = " + siteID + " AND t.txnType = 'Store Order';";

  }

  var searchQuery2 = "SELECT * FROM site";

  function doQuery1() {
    var defered = q.defer();
    conn.query(searchQuery, defered.makeNodeResolver());
    return defered.promise;
  }

  function doQuery2() {
    var defered = q.defer();
    conn.query(searchQuery2, defered.makeNodeResolver());
    return defered.promise;
  }

  q.all([doQuery1(), doQuery2()]).then(function (results, err) {


    var result = JSON.parse(JSON.stringify(results[0][0]));
    var result2 = JSON.parse(JSON.stringify(results[1][0]));

    res.render('pages/index-order.ejs', {
      siteTitle: siteTitle,
      pageTitle: "Orders",
      items: result,
      items2: result2,
      userInfo: req.user.userInfo
    });

    if (err) {

      res.redirect("/err/orders");
    }
  });






};

//Directs to page to add an entry along with information from look up tables after querying the database
controller.getAdd = (req, res) => {

  var siteID = Number(req.user.userInfo.siteID);

  searchQuery = "SELECT i.itemID, it.name as itemname, i.siteID, s.name, i.quantity, i.itemLocation, i.reorderThreshold, i.maxReorderWarning ";
  searchQuery += "FROM inventory i INNER JOIN item it ON i.itemID = it.itemID INNER JOIN site s on i.siteID = s.siteID ";
  searchQuery += "WHERE i.siteID = " + siteID + " and i.quantity < i.reorderThreshold;";

  var searchQuery2 = "SELECT * FROM site";

  function doQuery1() {
    var defered = q.defer();
    conn.query(searchQuery, defered.makeNodeResolver());
    return defered.promise;
  }

  function doQuery2() {
    var defered = q.defer();
    conn.query(searchQuery2, defered.makeNodeResolver());
    return defered.promise;
  }

  q.all([doQuery1(), doQuery2()]).then(function (results, err) {


    var result = JSON.parse(JSON.stringify(results[0][0]));
    var result2 = JSON.parse(JSON.stringify(results[1][0]));

    if (err) {

      console.log(err);

      res.redirect("/orders");
    } else if (result.length === 0) {

      res.render('pages/add-order.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Add Order",
        items: "",
        items2: result2,
        userInfo: req.user.userInfo

      });
    } else {
      res.render('pages/add-order.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Add Order",
        items: result,
        items2: result2,
        userInfo: req.user.userInfo

      });
    }

  });

};

controller.nextAdd = (req, res) => {

   var itemReorderIDs = [];
  var itemReorderNames = [];
  var itemReorderMax = [];
  var itemReorderQuantity = [];

  for (var key in req.body) {
    

    if (req.body.hasOwnProperty(key)) {
      if (key.includes('itemtoReorderID')) {
        var item = req.body[key];
        itemReorderIDs.push(item);
      } else if (key.includes('itemtoReorderName')) {
        var item = req.body[key];
        itemReorderNames.push(item);
      } else if (key.includes('itemtoReorderMax')) {
        var item = req.body[key];
        itemReorderMax.push(item);
      } else if (key.includes('itemtoReorderQuantity')) {
        var item = req.body[key];
        itemReorderQuantity.push(item);
      }
    }
  }

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
  insertQuery += SqlString(req.body.siteIDTo) + ", ";
  insertQuery += "'In progress', ";
  insertQuery += SqlString(dateFormat(shipDate, "yyyy-mm-dd")) + ", ";
  insertQuery += "'Store Order', ";
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

      var itemsQuery = "SELECT * FROM ITEM";

      conn.query(itemsQuery, function (err, result2) {

        if (result) {

          res.render('pages/add-orderNext.ejs', {
            siteTitle: siteTitle,
            pageTitle: "Add Order - Add Items",
            items: result,
            items2: result2,
            reorderItemIds: itemReorderIDs,
            reorderItemNames: itemReorderNames,
            reorderItemMax: itemReorderMax,
            reorderItemQuantity: itemReorderQuantity,
            userInfo: req.user.userInfo
          });

        }

        if (err) {

          console.log(err);

          res.redirect("/err/orders");
        }

      });

    }

  });

};

controller.addItems = (req, res) => {

  var txnId = req.body.txnID;
  var itemsSelected = req.body.itemsToPick;
  var quantities = [];
  var itemReorderIDs = [];
  var itemReorderNames = [];
  var itemReorderQuantity = [];

  for (var key in req.body) {
    

    if (req.body.hasOwnProperty(key)) {
      if (key.includes('itemQuantity')) {
        var item = req.body[key];
        quantities.push(item);
      } else if (key.includes('itemReorderID')) {
        var item = req.body[key];
        itemReorderIDs.push(item);
      } else if (key.includes('itemReorderName')) {
        var item = req.body[key];
        itemReorderNames.push(item);
      } else if (key.includes('itemReorderQuantity')) {
        var item = req.body[key];
        itemReorderQuantity.push(item);
      }
    }
  }

  if(itemsSelected !== undefined && itemsSelected !== null && itemsSelected.length > 0) {

  for (var i = 0; i < itemsSelected.length; i++) {

    if(quantities[i] !== null && quantities[i] > 0) {

         var insertQuery = "INSERT INTO `txnitems` (`txnID`, `ItemID`, `quantity`) VALUES (" + txnId + ", " + itemsSelected[i] + ", " + quantities[i] + ");";

         conn.query(insertQuery, function(err, result) {

    
          if(err) {
      
            console.log("new" + err);

            res.redirect("/err/orders");
          }
      
        })

    } 

   }

}

if(itemReorderIDs !== undefined && itemReorderIDs !== null && itemReorderIDs.length > 0) {

  for (var j = 0; j < itemReorderIDs.length; j++) {

    if(itemReorderQuantity[j] !== null && itemReorderQuantity[j] > 0) {

         var insertQuery = "INSERT INTO `txnitems` (`txnID`, `ItemID`, `quantity`) VALUES (" + txnId + ", " + itemReorderIDs[j] + ", " + itemReorderQuantity[j] + ");";

         conn.query(insertQuery, function(err, results) {

    
          if(err) {
      
            console.log( "reorder" + err );

            res.redirect("/err/orders");
          }
          else {console.log(results);}
                  
        })

    } 

   }

}

};


controller.getSubmit = (req, res) => {

  var txnID = req.params.txnID;
  var orderQuery = "SELECT * FROM txnitems ti INNER JOIN item i ON ti.itemID = i.itemID where txnID = " + txnID + ";";
  var statusQuery = "UPDATE txn SET `status` = 'Submitted' WHERE (`txnID` = "+ txnID + ");";
  var sitesQuery = "SELECT * FROM site;";


  conn.query(orderQuery, function (err, result) {

    if (result) {
      
      conn.query(statusQuery, function(err2, result2) {


        if(err2) {

          res.redirect('/err/order');


        } else {

          conn.query(sitesQuery, function(err3, result3) {


            if(err3) {

              res.redirect('/err/order');

            }

            else {

              res.render('pages/add-orderSubmit.ejs', {
                siteTitle: siteTitle,
                pageTitle: "Add Order - Submit Order",
                items: result,
                items2: result3,
                txnID: req.params.txnID,
                userInfo: req.user.userInfo
              });


            }

          })



          
        }


      })

    }

    if (err) {

      res.redirect("/err/orders");
    }

  });


/*    */
  
  }

controller.delete = (req, res) => {

  var deleteQuery = "DELETE FROM txn WHERE txnID = ";
  deleteQuery += SqlString(req.params.txnID) + ";";

  conn.query(deleteQuery, function (err, result) {

    if (result) {
      res.redirect("/orders");
    }

    if (err) {

      res.redirect("/err/orders");
    }

  });

};

controller.editWH = (req, res) => {

  var txnID = req.params.txnID;
  var updateQuery = "UPDATE txn SET `status` = 'In progress' WHERE (`txnID` = "+ txnID + ");";
  
  conn.query(updateQuery, function (err, result) {

    if (result) {
      res.render('pages/edit-orderWH.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Edit Order",
        userInfo: req.user.userInfo
      });
    }

    if (err) {

      res.redirect("/err/orders");
    }

  });

};

controller.updateInfo = (req, res) => {

  var txnID = req.params.txnID;
  var orderQuery = "SELECT * , i.name FROM txn t INNER JOIN txnitems ti ON t.txnID = ti.txnID INNER JOIN item i ON ti.ItemID = i.itemID where t.txnID = " + txnID + ";";
  var sitesQuery = "SELECT * FROM site;";
  var itemsQuery = "SELECT * FROM ITEM;";

  function doQuery1(){
    var defered = q.defer();
    conn.query(orderQuery,defered.makeNodeResolver());
    return defered.promise;
}

function doQuery2(){
    var defered = q.defer();
    conn.query(sitesQuery,defered.makeNodeResolver());
    return defered.promise;
}

function doQuery3(){
    var defered = q.defer();
    conn.query(itemsQuery,defered.makeNodeResolver());
    return defered.promise;
}


q.all([doQuery1(),doQuery2(),doQuery3()]).then(function(results, err){


  
   var result = JSON.parse(JSON.stringify(results[0][0]));
   var result2 = JSON.parse(JSON.stringify(results[1][0]));
   var result3 = JSON.parse(JSON.stringify(results[2][0]));

    res.render('pages/edit-order.ejs', {
      siteTitle: siteTitle,
      pageTitle: "Edit Order",
      items: result,
      items2: result2,
      items3: result3,
      txnID: req.params.txnID,
      userInfo: req.user.userInfo
    });

        if(err) {

            res.redirect("/err/orders");
         }

});

};

controller.updateItems = (req, res) => {

  var txnID = req.params.txnID;
  var delStatus = req.body.emergencyDelivery;
  var itemsSelected = req.body.itemsToPick;
  var quantities = [];
  var itemEditIDs = [];
  var itemEditNames = [];
  var itemEditQuantity = req.body.edititemQuantity;

  for (var key in req.body) {
    

    if (req.body.hasOwnProperty(key)) {

      var item = req.body[key];
      if (key.includes('itemQuantity')) {
        
        quantities.push(item);
      } else if (key.includes('edititemID')) {
        
        itemEditIDs.push(item);
      } else if (key.includes('edititemName')) {
        
        itemEditNames.push(item);
      } else if(key.includes('edititemQuantity')) {
        
        itemEditQuantity.push(item);
      }
    }
  }



  if(itemsSelected !== undefined && itemsSelected !== null && itemsSelected.length > 0) {

    var newQuantity = [];
    
    for (var i = 0; i < itemsSelected.length; i++) {

      newQuantity = quantities[i];
       
      if(newQuantity !== undefined && newQuantity !== null && newQuantity[i] >= 0) {

      
  
        var insertQuery = "INSERT INTO `txnitems` (`txnID`, `ItemID`, `quantity`) VALUES (" + txnID + ", " + itemsSelected[i] + ", " +  newQuantity[i] + ");";

        conn.query(insertQuery, function(err, result) {

              if(err) {
                res.redirect("/err/orders");
        
              console.log("new" + err);
  
              
            } else {
              console.log(result);
            }
        
          })
  
      } 
  
     }
  
  } 
  
  if(itemEditIDs !== undefined && itemEditIDs !== null && itemEditIDs.length > 0) {

    for (var j = 0; j < itemEditIDs.length; j++) {
  
      if(itemEditQuantity[j] !== null && itemEditQuantity[j] >= 0) {


  
           var updateQuery = "UPDATE txnitems SET quantity = " + itemEditQuantity[j] +" WHERE (txnID = " + txnID + ") and (ItemID = " + itemEditIDs[j] + ");";

             
           conn.query(updateQuery, function(err, result) {
  
      
            if(err) {
        
              console.log("edit" + err);
  
              res.redirect("/err/orders");
            } 
        
          })
  
      }   
     }
  
  } 

    var statusQuery = "UPDATE txn SET status = 'Submitted', emergencyDelivery = " + delStatus + " WHERE (`txnID` = "+ txnID + ");";

  conn.query(statusQuery, function(err, results) {

    if(err) {
     
      console.log(err);

      res.redirect("/err/orders");
    } else {

      res.redirect('/orders');

    }

  });


 };

controller.updateSubmit = (req, res) => {

  var statusQuery = "UPDATE txn SET `status` = 'Submitted' WHERE (`txnID` = "+ txnID + ");";

  conn.query(statusQuery, function(err, results) {

    if(err) {
     
      console.log(err);

      res.redirect("/err/orders");
    } else {

      res.redirect('/orders');

    }

  })

};

//Exports all methods to be used for routing
module.exports = controller;