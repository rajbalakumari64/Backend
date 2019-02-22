//LIST OF ALL DATABASES
const EMPLOYEE_DETAILS = "Employee";
const employeeDetails = "employeeDetails";

module.exports = function(mongo, url, assert) {
  var login_module = {
    //Start of Existing EMP
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
    //End of Existing EMP

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




  };
  return login_module;
};
