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
const baseURL = "http://localhost:4000"
const conn = getConnection();

const categoryRoutes = require('./routes/categories');
app.use('/', categoryRoutes);

/*
app.get('/', function (req, res) {

    conn.query("SELECT * FROM CATEGORY", function(err, result) {
        res.render('pages/Index', {
            siteTitle: siteTitle,
            pageTitle: "Categories",
            items: result
            
        });
    });


});

app.get('/event/add', function (req, res) {

    res.render('pages/add-event.ejs', {
        siteTitle: siteTitle,
        pageTitle: "Add Category",
        items: ''
        
    });

});

app.post('/event/add', function (req, res) {

    var insertQuery = "INSERT INTO category (categoryName) VALUES (";
    insertQuery += '"' + req.body.categoryName + '");'

    conn.query(insertQuery, function(err, result) {

        res.redirect("/");
    });

});

app.get('/event/edit/:categoryName', function (req, res) {

    var searchQuery = "SELECT * FROM category WHERE categoryName = '" + req.params.categoryName + "';";

    conn.query(searchQuery, function(err, result) {
        res.render('pages/edit-event.ejs', {
            siteTitle: siteTitle,
            pageTitle: "Edit Category: " + result[0].categoryName,
            item: result
            
        });
    });

});

app.post('/event/edit/:categoryName', function(req, res) {

    var updateQuery = "UPDATE category SET categoryName = '" + req.body.categoryName + "' WHERE categoryName = '" + req.params.categoryName + "'";
conn.query(updateQuery, function (err, result) {

    if(result) {
        res.redirect("/");
    }

    if(err) {
        console.log("This category cannot be edited due to being in use.");
        res.redirect("/");
    } 
})

})

app.get('/event/delete/:categoryName', function (req, res) {

    var deleteQuery = "DELETE FROM category WHERE categoryName = '";
    deleteQuery += req.params.categoryName + "'";

    conn.query(deleteQuery, function(err, result) {

        if(result) {
            res.redirect("/");
        }
        
        if(err) {
            console.log(err);
        } 
        
    });

});
*/

const server = app.listen(4000, () => {
    console.log("Server is up and listening on 4000...")
})