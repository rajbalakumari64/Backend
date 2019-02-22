//LIST OF ALL DATABASES
const EMPLOYEE_DETAILS = "Employee";
const employeeDetails = "employeeDetails";

module.exports = function(mongo, url, assert) {
  var login_module = {
    //check login details
    login_details_exists: function(name, password, callBack) {
      try {
        Name_exists = 0;
        mongo.connect(url, function(err, db) {
          assert.equal(null, err);
          var cursor = db.collection(EMPLOYEE_DETAILS).find({ $and: [{ name: name }, { password: password }] });
          cursor.forEach(
            function(doc, err) {
              assert.equal(null, err);
              console.log(doc);

              Name_exists = true;
            },
            function() {
              if (Name_exists) {
                callBack(Name_exists, false, "Login Succesfullll");
              } else {
                callBack(Name_exists, true, "Plz enter valid details");
              }
            }
          );
        });
      } catch (e) {
        callBack(mobile_exists, true, e);
      }
    },
    //End check login

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
    getQuery: function( callBack) {
      try {
       array=[];
        mongo.connect(url, function(err, db) {
          assert.equal(null, err);
          var cursor = db.collection(EMPLOYEE_DETAILS).find({  status: "NotSolve"  });
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
                callBack(null, true, "Query not found");
              } else {
                callBack(array, false, " query details Found");
              }
            }
          );
        });
      } catch (e) {
        callBack(mobile_exists, true, e);
      }
    },
    //End getQuery

    
   //start assignWork
    assignWork:function(user_email,emp_email,callBack) {
        mongo.connect(url, function (err, db) {
          assert.equal(null,err);
           //update employee colletion notSolve to processing
          db.collection("Employee").update({email:user_email}, {$set : {status:"processing"}}, function (err, result) {
            // if (err) {
            //     callBack(err, true, "query assign Unsuccessfully");
            // } 
            // else {
            //   callBack( user_email, false, "query assign successfully");
            // }
            assert.equal(null,err);
          });
          //update employeeDetails colletion available to false
          db.collection("employeeDetails").update({emp_email:emp_email}, {$set : {available:"false"}}, function (err, result) {
            if (err) {
                callBack(err, true, "set available to false unsuccessfully");
            } 
            else {
              callBack( user_email, false, "set available to false successfully");    
            }
          db.close();
          });  //end update employeeDetails
        });
  }
  //End assignWork
}
  return login_module;
};
