//LIST OF ALL DATABASES
const USER_DETAILS = "userDetails";
const employeeDetails = "employeeDetails";
const ADMIN_DETAILS = "adminDetails";
const USERALLQUERY = "allUserQuery";
var ObjectID = require("mongodb").ObjectID;

module.exports = function(mongo, url, assert) {
  var login_module = {
    //check login details
    login_details_exists: function(user_email, password, callBack) {
      try {
        userDetails=[];
        Name_exists = false;
        mongo.connect(url, function(err, db) {
          assert.equal(null, err);
          var cursor = db.collection(USER_DETAILS).find({ $and: [{ user_email: user_email }, { password: password }] });
          cursor.forEach(
            function(doc, err) {
              assert.equal(null, err);
              console.log(doc);
              if (err) {
                callBack(null, true, err);
              } else {
                userDetails.push(doc);
              }
              Name_exists = true;
            },
            function() {
              if (Name_exists) {
                callBack(userDetails, false, "Login Succesfullll");
              } else {
                callBack(userDetails, true, "Plz enter valid details");
              }
            }
          );
        });
      } catch (e) {
        callBack(mobile_exists, true, e);
      }
    },
    //End check login
    //start check emp login
    login_emp_details_exists: function(user_email, password, callBack) {
      try {
        userDetails=[];
        Name_exists = false;
        mongo.connect(url, function(err, db) {
          assert.equal(null, err);
          var cursor = db.collection(employeeDetails).find({ $and: [{ emp_email: user_email }, { password: password }] });
          cursor.forEach(
            function(doc, err) {
              assert.equal(null, err);
              console.log(doc);
              if (err) {
                callBack(null, true, err);
              } else {
                userDetails.push(doc);
              }
              Name_exists = true;
            },
            function() {
              if (Name_exists) {
                callBack(userDetails, false, "Login Succesfullll");
              } else {
                callBack(userDetails, true, "Plz enter valid details");
              }
            }
          );
        });
      } catch (e) {
        callBack(mobile_exists, true, e);
      }
    },
    //end emp login

     //start check admin login
     login_admin_details_exists: function(user_email, password, callBack) {
      try {
        userDetails=[];
        Name_exists = false;
        mongo.connect(url, function(err, db) {
          assert.equal(null, err);
          var cursor = db.collection(ADMIN_DETAILS).find({ $and: [{ admin_email: user_email }, { password: password }] });
          cursor.forEach(
            function(doc, err) {
              assert.equal(null, err);
              console.log(doc);
              if (err) {
                callBack(null, true, err);
              } else {
                userDetails.push(doc);
              }

              Name_exists = true;
            },
            function() {
              if (Name_exists) {
                callBack(userDetails, false, "Login Succesfullll");
              } else {
                callBack(userDetails, true, "Plz enter valid details");
              }
            }
          );
        });
      } catch (e) {
        callBack(mobile_exists, true, e);
      }
    },
    //end admin login
    //start getEmployee
    getEmployee: function(available, callBack) {
      try {
       array=[];
        mongo.connect(url, function(err, db) {
          assert.equal(null, err);
          var cursor = db.collection(employeeDetails).find({"available": available });
          cursor.forEach(
            function(doc, err) {
              assert.equal(null, err);
              console.log(doc);
              if (err) {
                callBack(null, true, err);
              } else {
                array.push(doc);
              }
             
            },
            function() {
              if (array.length ==0) {
                callBack(null, true, "nothing found");
              } else {
                callBack(array, false, " details Found");
              }
            }
          );
        });
      } catch (e) {
        callBack(mobile_exists, true, e);
      }
    },
    //End getEmployee

    //start getQuery
    getQuery: function(subject, callBack) {
      try {
       array=[];
        mongo.connect(url, function(err, db) {
          assert.equal(null, err);
          var cursor = db.collection(USERALLQUERY).find({ status: "notSolve", subject:subject });
          cursor.forEach(
            function(doc, err) {
              assert.equal(null, err);
              console.log(doc);
              if (err) {
                callBack(null, true, err);
              } else {
                array.push(doc);
              }
             
            },
            function() {
              if (array.length == 0) {
                callBack(array, true, "Query not found");
              } else {
                callBack(array, false, " query details Found");
              }
            }
          );
        });
      } catch (e) {
        callBack(array, true, e);
      }
    },
    //End getQuery

    
   //start assignWork
    assignWork:function(QueryId,emp_email,callBack) {
        mongo.connect(url, function (err, db) {
          assert.equal(null,err);
           //update employee colletion notSolve to processing
          db.collection(USERALLQUERY).update({"_id": ObjectID(QueryId)}, {$set : {status:"processing"}}, function (err, result) {
            // if (err) {
            //     callBack(err, true, "query assign Unsuccessfully");
            // } 
            // else {
            //   callBack( user_email, false, "query assign successfully");
            // }
            assert.equal(null,err);
          });
          //update employeeDetails colletion available to false
          db.collection("employeeDetails").update({emp_email:emp_email}, {$set :{available:"false","user_QuerId": ObjectID(QueryId)}}, function (err, result) {
            if (err) {
                callBack( true, "set available to false unsuccessfully");
            } 
            else {
              callBack(  false, "Assign Work successfully");    
            }
          db.close();
          });  //end update employeeDetails
        });
  },
  //End assignWork
  //start-> Employee get user email
  getUser: function(emp_email, callBack) {
    try {
     array=[];
      mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection(employeeDetails).find({"emp_email": emp_email });
        cursor.forEach(
          function(doc, err) {
            assert.equal(null, err);
            // console.log(doc);
            if (err) {
              callBack(null, true, err);
            } else {
              array.push(doc);
            }
           
          },
          function() {
            if (array.length ==0) {
              callBack(array, true, "nothing found");
            } else {
              callBack(array[0].user_QuerId, false, " user details Found");
              console.log(array[0].user_QuerId);
            }
          }
        );
      });
    } catch (e) {
      callBack("geting some error", true, e);
    }
  },
  //End getUser
  
  //start findemail
  findemail: function(QueryId, callBack) {
    try{
      array=[];
      mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection(USERALLQUERY).find({ "_id": ObjectID(QueryId) });
        cursor.forEach(
          function(doc, err) {
            assert.equal(null, err);
            console.log("idd check",doc);
            if (err) {
              callBack(null, true, err);
            } else {
              array.push(doc.user_email);
            }
           
          },
          function() {
            if (array.length ==0) {
              callBack(array, true, "nothing found");
            } else {
              callBack(array, false, " user Query Found");
            }
          }
        );
      });
    }
    catch(ee){
      callBack("error", true, ee);
    }
   
  },
  //End findemail

  //start empGetQuery
  empGetQuery: function(user_email, callBack) {
    try {
     array=[];
      mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection(USERALLQUERY).find({"_id": ObjectID(user_email) });
        cursor.forEach(
          function(doc, err) {
            assert.equal(null, err);
            console.log(doc);
            if (err) {
              callBack(null, true, err);
            } else {
              array.push(doc);
            }
           
          },
          function() {
            if (array.length ==0) {
              callBack(array, true, "nothing found");
            } else {
              callBack(array, false, " user Query Found");
            }
          }
        );
      });
    } catch (e) {
      callBack(mobile_exists, true, e);
    }
  },
  //End empGetQuery
  //start solveQuery
  solveQuery: function(QueryId, callBack) {
    try{
      array=[];
      mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection(USERALLQUERY).find({ "_id": ObjectID(QueryId) });
        cursor.forEach(
          function(doc, err) {
            assert.equal(null, err);
            console.log("idd check",doc);
            if (err) {
              callBack(null, true, err);
            } else {
              array.push(doc);
            }
           
          },
          function() {
            if (array.length ==0) {
              callBack(array, true, "nothing found");
            } else {
              callBack(array, false, " user Query Found");
            }
          }
        );
      });
    }
    catch(ee){
      callBack("error", true, ee);
    }
   
  },
  //End solveQuery

  //start solveQuery
  solveQuery2: function(QueryId,answer, callBack) {
    try{
      mongo.connect(url, function (err, db) {
        assert.equal(null,err);
        db.collection(USERALLQUERY).update({ "_id": ObjectID(QueryId)}, {$set :{status:"Solve",answer: answer}}, function (err, result) {
          if (err) {
              callBack("nothing", true, "solve unsuccessfully");
          } 
          else {
            callBack( "find", false, "solve successfully");    
          }
        db.close();
        }); 
           });
      
    }
    catch(ee){
      callBack("error", true, ee);
    }
   
  },
  //End solveQuery2
  //start processingToNotSolve
  processingToNotSolve: function(QueryId, callBack) {
    try{
      mongo.connect(url, function (err, db) {
        assert.equal(null,err);
        db.collection(USERALLQUERY).update({"_id": ObjectID(QueryId)}, {$set :{status:"notSolve"}}, function (err, result) {
          if (err) {
              callBack("nothing", true, "Processing To notSolve UnSuccessfully");
          } 
          else {
            callBack( "find", false, "Processing To notSolve successfully");    
          }
        db.close();
        }); 
           });
      
    }
    catch(ee){
      callBack("error", true, ee);
    }
   
  },
  //End processingToNotSolve
   //start UnAvailableToAvailable
   UnAvailableToAvailable: function(emp_email, callBack) {
    try{
      mongo.connect(url, function (err, db) {
        assert.equal(null,err);
        db.collection(employeeDetails).update({emp_email: emp_email}, {$set :{available: "true" , user_QuerId:""}}, function (err, result) {
          if (err) {
              callBack("nothing", true, "UnAvailable To Available UnSuccessfully");
          } 
          else {
            callBack( "find", false, "UnAvailable To Available successfully and Processing To notSolve successfully");    
          }
        db.close();
        }); 
           });
      
    }
    catch(ee){
      callBack("error", true, ee);
    }
   
  },
  //End UnAvailableToAvailable
    //start countNoOfCompanyGroupBy
    countNoOfCompanyGroupBy: function(callBack) {
      try {
        Comparray = [];
        Countarray = [];
        mongo.connect(url, function(err, db) {
          assert.equal(null, err);
          // "email": email
          var cursor = db
            .collection(USERALLQUERY)
            .aggregate([
              { $group: { _id: "$subject", emps: { $push: "$$ROOT" } } }
            ]);
          // console.log(cursor);
          cursor.forEach(
            function(doc, err) {
              assert.equal(null, err);
              // console.log(doc);

              if (err) {
                callBack(null, true, err);
              } else {
                Comparray.push(doc._id);
                Countarray.push(doc.emps.length);

                // array.push(doc);
              }
            },
            function() {
              if (Comparray.length == 0) {
                callBack(null, null, true, "nothing found");
              } else {
                callBack(Comparray,Countarray, false,"data found" );
              }
            }
          );
        });
      } catch (e) {
        callBack("null","null", true, e);
      }
    },
    //End countNoOfCompanyGroupBy
    //start getQuery
    userGetAllQuery: function(user_email, callBack) {
      try {
       array=[];
        mongo.connect(url, function(err, db) {
          assert.equal(null, err);
          var cursor = db.collection(USERALLQUERY).find({ user_email:user_email });
          cursor.forEach(
            function(doc, err) {
              assert.equal(null, err);
              console.log(doc);
              if (err) {
                callBack(null, true, err);
              } else {
                array.push(doc);
              }
             
            },
            function() {
              if (array.length == 0) {
                callBack(array, true, "Query not found");
              } else {
                callBack(array, false, " query details Found");
              }
            }
          );
        });
      } catch (e) {
        callBack(array, true, e);
      }
    },
    //End getQuery

}
  return login_module;
};
