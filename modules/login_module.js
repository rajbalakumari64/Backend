//LIST OF ALL DATABASES
const EMPLOYEE_DETAILS = "Employee";

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

  };
  return login_module;
};
