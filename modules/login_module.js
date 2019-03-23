//LIST OF ALL DATABASES
const EMPLOYEE_DETAILS = "Employee";
const employeeDetails = "employeeDetails";
const ADMIN_DETAILS = "adminDetails";

module.exports = function(mongo, url, assert) {
  var login_module = {
    //check login details
    login_details_exists: function(user_email, password, callBack) {
      try {
        userDetails=[];
        Name_exists = false;
        mongo.connect(url, function(err, db) {
          assert.equal(null, err);
          var cursor = db.collection(EMPLOYEE_DETAILS).find({ $and: [{ user_email: user_email }, { password: password }] });
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
    getQuery: function(company, callBack) {
      try {
       array=[];
        mongo.connect(url, function(err, db) {
          assert.equal(null, err);
          var cursor = db.collection(EMPLOYEE_DETAILS).find({ status: "notSolve", company:company });
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
    assignWork:function(user_email,emp_email,callBack) {
        mongo.connect(url, function (err, db) {
          assert.equal(null,err);
           //update employee colletion notSolve to processing
          db.collection("Employee").update({user_email:user_email}, {$set : {status:"processing"}}, function (err, result) {
            // if (err) {
            //     callBack(err, true, "query assign Unsuccessfully");
            // } 
            // else {
            //   callBack( user_email, false, "query assign successfully");
            // }
            assert.equal(null,err);
          });
          //update employeeDetails colletion available to false
          db.collection("employeeDetails").update({emp_email:emp_email}, {$set :{available:"false","user_email":user_email}}, function (err, result) {
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
              callBack(array[0].user_email, false, " user details Found");
              console.log(array[0].user_email);
            }
          }
        );
      });
    } catch (e) {
      callBack("geting some error", true, e);
    }
  },
  //End getUser
  //start empGetQuery
  empGetQuery: function(user_email, callBack) {
    try {
     array=[];
      mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection(EMPLOYEE_DETAILS).find({"user_email": user_email });
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
  solveQuery: function(user_email, callBack) {
    try{
      array=[];
      mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection(EMPLOYEE_DETAILS).find({"user_email": user_email });
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
    }
    catch(ee){
      callBack("error", true, ee);
    }
   
  },
  //End solveQuery

  //start solveQuery
  solveQuery2: function(user_email, callBack) {
    try{
      mongo.connect(url, function (err, db) {
        assert.equal(null,err);
        db.collection(EMPLOYEE_DETAILS).update({user_email:user_email}, {$set :{status:"Solve", query:""}}, function (err, result) {
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
  processingToNotSolve: function(user_email, callBack) {
    try{
      mongo.connect(url, function (err, db) {
        assert.equal(null,err);
        db.collection(EMPLOYEE_DETAILS).update({user_email:user_email}, {$set :{status:"notSolve"}}, function (err, result) {
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
        db.collection(employeeDetails).update({emp_email: emp_email}, {$set :{available: "true" , user_email:""}}, function (err, result) {
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
}
  return login_module;
};
