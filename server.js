const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const dateFormat = require('dateformat');

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


const pageRoutes = require('./routes/pages');
const categoryRoutes = require('./routes/categories');
const siteRoutes = require('./routes/sites');
const supplierRoutes = require('./routes/supplier');
const employeeRoutes = require('./routes/employees');
const itemRoutes = require('./routes/items');
const inventoryRoutes = require('./routes/inventory');


app.use('/', pageRoutes);
app.use('/admin/cat', categoryRoutes);
app.use('/admin/site', siteRoutes);
app.use('/admin/supp', supplierRoutes);
app.use('/admin/emp', employeeRoutes);
app.use('/admin/item', itemRoutes);
app.use('/admin/invt', inventoryRoutes);



const server = app.listen(4000, () => {
    console.log("Server is up and listening on 4000...")
})