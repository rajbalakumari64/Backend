//REQUIRE
var express = require("express");
var app = express();
var mongo = require("mongodb");
var assert = require("assert");
var bodyParser = require("body-parser");
var cors = require("cors");
var ObjectID = require("mongodb").ObjectID;
var jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

//Setting Port
app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//LOCAL
var url = "mongodb://localhost:27017/Employees";

//WELCOME API
app.get("/", function (req, res) {
  res.send("Welcome to Hello World");
});
app.get("/toke", function (req, res) {
  var token = jwt.sign(req.body.name, "12345");
  res.json({ result: token });
});
app.post("/verify", function (req, res) {
  jwt.verify(req.body.token, "12345", function (err, decoded) {
    res.json({ result: decoded });
  });
});

//stat add signUp
app.post("/signUp", function (req, res) {
  if (req.body.hasOwnProperty("name") && req.body.hasOwnProperty("password")) {
    var new_emp = {
      name: req.body.name,
      password: req.body.password,
      phone_number: req.body.phone_number,
      user_email: req.body.user_email,
      type: "user",
      date: new Date()
    };
    //CHECK EMAIL EXIST OR NOT
    try {
      array = [];
      mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        var cursor = db.collection("userDetails").find({ user_email: req.body.user_email });
        cursor.forEach(
          function (doc, err) {
            assert.equal(null, err);
            console.log(doc);
            if (err) {
              res.json({
                status: false,
                send: "no",
                message: "Data could not be added successfully"
              });
            } else {
              array.push(doc);
            }

          }, //IF EMAIL NOT FIND THEN INSERT RECORD
          function () {
            if (array.length == 0) {
              mongo.connect(url, function (err, db) {
                assert.equal(null, err);
                db.collection("userDetails").insertOne(new_emp, function (err, result) {
                  if (err) {
                    res.json({
                      status: false,
                      send: "no",
                      message: "Data could not be added successfully"
                    });
                  } else {
                    res.json({
                      status: true,
                      send: "yes",
                      message: "Data added successfully"
                    });
                  }
                  db.close();
                });
              });
            } else {
              res.json({
                status: false,
                message: "email already exist"
              });
            }
          }
        );
      });
    } catch (e) {
      res.json({
        status: false,
        message: "error"
      });
    }
  } else {
    res.json({ status: false, send: "no", message: "plz enter name" });
  }
});
//end of SignUp

//stat add addEmployee
app.post("/addEmployee", function (req, res) {
  if (req.body.hasOwnProperty("name") && req.body.hasOwnProperty("password")) {
    var new_emp = {
      name: req.body.name,
      password: req.body.password,
      phone_number: req.body.phone_number,
      emp_email: req.body.emp_email,
      type: "employee",
      date: new Date()
    };
    //CHECK EMAIL EXIST OR NOT
    try {
      array = [];
      mongo.connect(url, function (err, db) {
        assert.equal(null, err);
        var cursor = db.collection("employeeDetails").find({ emp_email: req.body.emp_email });
        cursor.forEach(
          function (doc, err) {
            assert.equal(null, err);
            console.log(doc);
            if (err) {
              res.json({
                status: false,
                send: "no",
                message: "Employee already exist"
              });
            } else {
              array.push(doc);
            }

          }, //IF EMAIL NOT FIND THEN INSERT RECORD
          function () {
            if (array.length == 0) {
              mongo.connect(url, function (err, db) {
                assert.equal(null, err);
                db.collection("employeeDetails").insertOne(new_emp, function (err, result) {
                  if (err) {
                    res.json({
                      status: false,
                      send: "no",
                      message: "Data could not be added successfully"
                    });
                  } else {
                    res.json({
                      status: true,
                      send: "yes",
                      message: "Data added successfully"
                    });
                  }
                  db.close();
                });
              });
            } else {
              res.json({
                status: false,
                message: "email already exist"
              });
            }
          }
        );
      });
    } catch (e) {
      res.json({
        status: false,
        message: "error"
      });
    }
  } else {
    res.json({ status: false, send: "no", message: "plz enter name" });
  }
});
//end of addEmployee


//start add Query
app.post("/addquery", function (req, res) {
  mongo.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection("userDetails").update(
      { user_email: req.body.user_email },
      { $set: { query: req.body.query, company: req.body.company } },
      function (err, result) {
        if (err) {
          res.json({ status: false, message: " Unsuccessfully" });
        } else {
          res.json({ status: true, message: "Query added successfully" });
        }
        db.close();
      }
    );
  });
});
//end of add Query

//start add user Query
app.post("/add_user_query", function (req, res) {
  if (req.body.hasOwnProperty("query") && req.body.hasOwnProperty("subject") && req.body.hasOwnProperty("user_email")) {
  mongo.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection("allUserQuery").insertOne(
      { user_email: req.body.user_email, subject: req.body.subject, query: req.body.query ,status:"notSolve", emp_email:"", date: new Date()},
      function (err, result) {
        if (err) {
          res.json({ status: false, message: " Unsuccessfully" });
        } else {
          res.json({ status: true, message: "Query Added Successfully !!!"  });
        }
        db.close();
      }
    );
  });
}
else{
  res.json({ status: false, message: "fill all" });
}
});
//end of add user Query

//for listen port
app.listen(app.get("port"), function () {
  console.log("Node app is running on port", app.get("port"));
});

//Require Routes
var loginRoute = require("./routes/login_route");

//Configure Routes
loginRoute.configure(app, mongo, ObjectID, url, assert);
