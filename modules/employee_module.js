//LIST OF ALL DATABASES
const EMPLOYEE_DETAILS = "employee_details";

module.exports = function (mongo, url, assert) {
  var employee_module = {
    //Start of Add EMP
    add_employee: function (employee_details, callBack) {
      try {
        mongo.connect(url, function (err, db) {
          assert.equal(null,err);
          db.collection(EMPLOYEE_DETAILS).insertOne(employee_details, function (err, result) {
          if (err) {
            callBack(null, true, err);
          } 
          else {
            callBack(result, false, "Employee Added Successfully");
          }
          db.close();
          });
        });
      }
      catch (e) {
        callBack(null, true, e);
      }
    },
    //End of Add EMP

    //Start of Existing EMP
    employee_exists: function (phone_number, callBack) {
      try {
        mobile_exists = false;
        mongo.connect(url, function (err, db) {
          assert.equal(null, err);
          var cursor = db.collection(EMPLOYEE_DETAILS).find({ "phone_number": phone_number});
          cursor.forEach(function (doc, err) {
            assert.equal(null, err);
            console.log(doc);
            mobile_exists = true;
          }, function () {
            if(mobile_exists) {
              callBack(mobile_exists, true, "Mobile Number Exists");
            } else {
              callBack(mobile_exists, false, "");
            }
          })
        })
      } catch (e) {
        callBack(mobile_exists, true, e )
      }
    },

    //End of Existing EMP
  }
  return employee_module;
}