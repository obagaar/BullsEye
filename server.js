//Ashley Harper
//02/04/2019
//Inventory management system
//Currently starting with CRUD functions for areas such as sites, employees, items, etc


//Package imports
//Imports needs for express, mysql, etc to be sued later
const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const dateFormat = require('dateformat');

app.use(bodyParser.urlencoded({extended: true}));

//sets up the view engine that later is used with partial to build pages
app.set('view engine', 'ejs');

//Pathways to bootstrap css, javascript and jquery sued for layout
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/img', express.static(__dirname + '/src/images'));

//Imports of the javascript files used to setup routes to the files that run SQL queries to load info
const pageRoutes = require('./routes/pages');
const categoryRoutes = require('./routes/categories');
const siteRoutes = require('./routes/sites');
const supplierRoutes = require('./routes/supplier');
const employeeRoutes = require('./routes/employees');
const itemRoutes = require('./routes/items');
const inventoryRoutes = require('./routes/inventory');
const loginRoutes = require('./routes/login');
const orderRoutes = require('./routes/orders')

//Sets the pathways to be used for each route
app.use('/', pageRoutes);
app.use('/admin/cat', categoryRoutes);
app.use('/admin/site', siteRoutes);
app.use('/admin/supp', supplierRoutes);
app.use('/admin/emp', employeeRoutes);
app.use('/admin/item', itemRoutes);
app.use('/admin/invt', inventoryRoutes);
app.use('/login', loginRoutes);
app.use('/orders', orderRoutes);


//Sets port to be used over localhost and displays when it is listened for
const server = app.listen(4000, () => {
    console.log("Server is up and listening on 4000...")
})