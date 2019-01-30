const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const dateFormat = require('dateformat');

app.use(bodyParser.urlencoded({extended: true}));

var now = new Date();

app.set('view engine', 'ejs');

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


const siteTitle = "BullsEye";
const baseURL = "http://localhost:4000"


const pageRoutes = require('./routes/pages');
const categoryRoutes = require('./routes/categories');
const siteRoutes = require('./routes/sites');
const supplierRoutes = require('./routes/supplier');


app.use('/', pageRoutes);
app.use('/admin/crud/cat', categoryRoutes);
app.use('/admin/crud/site', siteRoutes);
app.use('/admin/crud/supp', supplierRoutes);



const server = app.listen(4000, () => {
    console.log("Server is up and listening on 4000...")
})