//REQUIRE
var express = require('express');
var app = express();
var mongo = require('mongodb');
var assert = require('assert');
var bodyParser = require('body-parser');
var cors = require('cors');
var ObjectID = require('mongodb').ObjectID;

//Setting Port
app.set('port', (process.env.PORT || 8000));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//LOCAL 
var url = "mongodb://localhost:27017/Employees";

//WELCOME API
app.get('/', function(req, res) {
    res.send("Welcome to Hello World");
});
//stat add employee
app.post('/signUp', function(req, res) {
    var new_emp = {
        name: req.body.name,
        password: req.body.password,
        phone_number: req.body.phone_number,
        email: req.body.email,
      };

      mongo.connect(url, function (err, db) {
        assert.equal(null,err);
        db.collection("Employee").insertOne(new_emp, function (err, result) {
        if (err) {
            res.json({status: false, message:"Data could not be added successfully"});
        } 
        else {
            res.json({status: true, message:"Data added successfully"});
        }
        db.close();
        });
      });
});
//end of SignUp





app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

//Require Routes
var loginRoute = require('./routes/login_route');

//Configure Routes
loginRoute.configure(app, mongo, ObjectID, url, assert);

