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

    res.render('pages/index-delivery.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Deliveries",
        userInfo: req.user.userInfo
    });
}

controller.group = (req, res) => {

    var txnQuery = "SELECT * FROM txn WHERE status = 'Assembled' AND txnType = 'Store Order' OR txnType = 'Back Order'AND NOT status = 'Pending Back Order';";
    var sitesQuery = "SELECT * FROM site;";

    var searchQuery2 = "SELECT * FROM site";

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

        if (err) {

            console.log(err);

            res.redirect("/orders");
        } else {

            res.render('pages/group-delivery.ejs', {
                siteTitle: siteTitle,
                pageTitle: "Group Deliveries",
                items: result,
                items2: result2,
                userInfo: req.user.userInfo

            });
        }

    });


};

controller.groupNext = (req, res) => {

    var txnIDs = req.body.menu2


    res.render('pages/group-deliveryNext.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Group Deliveries",
        txnIDs: txnIDs,
        userInfo: req.user.userInfo

    });


}

controller.groupNext2 = (req, res) => {

    var txnIDs = req.body.txnIDs;
    var deliveryWeight = 0;

    for(var i = 0; i < txnIDs.length; i++) {


        var txnQuery = "SELECT SUM(weight) as weight FROM txnitems ti INNER JOIN item i ON ti.ItemID = i.itemID WHERE txnID = " + txnIDs[i] + ";";

        conn.query(txnQuery, function(err, result){

            if(err) {
                console.log(err);
            } else {

                if(result[0].weight !== null) {


                    deliveryWeight += result[0].weight;

                    var vehicleQuery = "SELECT * FROM vehicle;";

                    conn.query(vehicleQuery, function(err2, result2) {

                        if(err2) {

                            console.log(err2)
                        } else {
                            res.render('pages/group-deliveryNext2.ejs', {
                                siteTitle: siteTitle,
                                pageTitle: "Group Deliveries",
                                items: result2,
                                deliveryWeight: deliveryWeight,
                                txnIDs: txnIDs,
                                userInfo: req.user.userInfo
                        
                            });

                        }


                    });
                    
                }
                
            }

        })


    }

    
}

controller.groupNext3 = (req, res) => {

 var txnIDs = req.body.txnIDs;
 var deliveryWeight = req.body.deliveryWeight;
 var vehicle = req.body.vehicleSelect;

 var deliveryDistance = 0;
 var totalCost = 0;

    for(var i = 0; i < txnIDs.length; i++) {


        var txnQuery = "SELECT s.distanceFromWH FROM site s INNER JOIN txn t ON s.siteID = t.siteIDTo WHERE txnID = " + txnIDs[i] + ";";

        conn.query(txnQuery, function(err, result){

            if(err) {
                console.log(err);
            } else {

                if(result[0].distanceFromWH !== null) {

                    deliveryDistance += result[0].distanceFromWH;

                    var vehicleQuery = "SELECT costPerKem as cost FROM vehicle WHERE vehicleType = " + SqlString(vehicle) + ";";

                    conn.query(vehicleQuery, function(err2, result2){


                        if(err2) {
                            console.log(err2);
                        } else {

                            if(result2[0].cost !== null) {

                                totalCost = deliveryDistance * result2[0].cost;

                                res.render('pages/group-deliveryNext3.ejs', {
                                    siteTitle: siteTitle,
                                    pageTitle: "Group Deliveries",
                                    deliveryWeight: deliveryWeight,
                                    deliveryDistance: deliveryDistance,
                                    vehicle: vehicle,
                                    totalCost: totalCost,
                                    txnIDs: txnIDs,
                                    userInfo: req.user.userInfo
                            
                                });

                               
                            }

                        }


                    })
                
            }
        }

        })


    }

/*      */

}


controller.groupNext4 = (req, res) => {

var txnIDs = req.body.txnIDs;
var deliveryWeight = req.body.deliveryWeight;
var deliveryDistance = req.body.deliveryDistance;
var vehicle = req.body.vehicle;
var totalCost = req.body.totalCost;

var deliveryQuery = "INSERT INTO delivery (distanceCost, vehicleType) VALUES ("+ totalCost +", " + SqlString(vehicle) + ");";

                                conn.query(deliveryQuery, function(err3, result3) {

                                    if(err3) {

                                        console.log(err3);

                                    } else {

                                        var deliveryID = result3.insertId;

                                        res.render('pages/group-deliveryNext4.ejs', {
                                            siteTitle: siteTitle,
                                            pageTitle: "Group Deliveries",
                                            deliveryID: deliveryID,
                                            deliveryWeight: deliveryWeight,
                                            deliveryDistance: deliveryDistance,
                                            vehicle: vehicle,
                                            totalCost: totalCost,
                                            txnIDs: txnIDs,
                                            userInfo: req.user.userInfo
                                    
                                        });


                                    }



                                })

}

controller.groupNext5 = (req, res) => {

    console.log(req.body);

    var deliveryID = req.body.deliveryID;
    var txnIDs = req.body.txnIDs;


    for(var i = 0; i < txnIDs.length; i++) {

        var txnQuery = "UPDATE txn SET deliveryID = " + deliveryID + " WHERE (txnID = "+ txnIDs[i] + ");";

        conn.query(txnQuery, function(err, result){


            if(err) {
                console.log(err);
            }

        })


    }

     res.redirect('/delivery');


}
//Exports all methods to be used for routing
module.exports = controller;