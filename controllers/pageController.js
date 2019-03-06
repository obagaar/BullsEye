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

//Constants for the site's tite and array for controller methods to be returned
const controller = {};
const conn = getConnection();
const siteTitle = "BullsEye Sporting Goods";

//Directs to main landing page
controller.index = (req, res) => {

      res.render('pages/mainIndex.ejs', {
        siteTitle: siteTitle,
        pageTitle: ""
    });
};


controller.logout = (req, res) => {

    req.logout();
    req.session.destroy();
    res.redirect('/');

};

controller.main = (req, res) => {

    res.render('pages/mainDash.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Welcome, " + req.user.userInfo.FirstName,
        userInfo: req.user.userInfo
    });
};

controller.tools = (req, res) => {

    res.render('pages/toolsIndex.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Tools",
        userInfo: req.user.userInfo
    });
}

controller.inventory = (req, res) => {

    var siteID = Number(req.user.userInfo.siteID);
 
    var searchQuery = "SELECT i.itemID, it.name, i.siteID, i.quantity, i.itemLocation, i.reorderThreshold, i.maxReorderWarning";
    searchQuery += " FROM inventory i INNER JOIN item it ON i.itemID = it.itemID WHERE i.siteID = " + siteID + ";";
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
    
                 res.render('pages/index-invtV.ejs', {
                    siteTitle: siteTitle,
                    pageTitle: "View Inventory",
                    item: result,
                    item2: result2,
                    userInfo: req.user.userInfo
                });

                if(err) {

                    res.redirect("/err/invt");
                 }

        });





}

//Directs to main admin page
controller.admin = (req, res) => {

    console.log(req);

    res.render('pages/adminIndex.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Administrative Access",
        userInfo: req.user.userInfo
    });
}

//Directs to error page for categories
controller.errCat = (req, res) => {

    res.render('pages/err-cat.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Categories - Error",
        item: ''
    });
}

//Directs to error page for employees
controller.errEmp = (req, res) => {

    res.render('pages/err-emp.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Employees - Error",
        item: ''
    });
}

//Directs to error page for inventory
controller.errInvt = (req, res) => {

    res.render('pages/err-invt.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Inventory - Error",
        item: ''
    });
}

//Directs to error page for items
controller.errItem = (req, res) => {

    res.render('pages/err-item.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Itemss - Error",
        item: ''
    });
}

//Directs to error page for sites
controller.errSite = (req, res) => {

    res.render('pages/err-site.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Sites - Error",
        item: ''
    });
}

//Directs to error page for suppliers
controller.errSupp = (req, res) => {

    res.render('pages/err-supp.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Suppliers - Error",
        item: ''
    });
}

//Exports all methods to be used for routing
module.exports = controller;