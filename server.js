const express = require('express');
const http = require('http');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const dateFormat = require('dateformat');

app.use(bodyParser.urlencoded({extended: true}));

var now = new Date();

app.set('view engine', 'ejs');

app.use('/js', express.static( './nodemodules/bootstrap/dist/js'));
app.use('/js', express.static('./nodemodules/tether/dist/js'));
app.use('/js', express.static( './nodemodules/jquery/dist'));
app.use('/css', express.static('./nodemodules/bootstrap/dist/css'));

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

app.get('/', function (req, res) {

    res.render('pages/Index', {
        siteTitle: siteTitle,
        pageTitle: "Employees",
        items: 'result'
    });

});

const server = app.listen(4000, () => {
    console.log("Server is up and listening on 4000...")
})