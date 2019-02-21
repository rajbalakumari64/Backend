module.exports = {
configure: function (app, mongo, ObjectID, url, assert) {
    var self = this;
    var employee_module = require('../modules/employee_module')(mongo, url, assert);

    //API TO ADD NEW EMPLOYEE

    app.post('/add_employee', function(req, res) {
      try {
        if (req.body.hasOwnProperty("name") && req.body.hasOwnProperty("address") 
        && req.body.hasOwnProperty("phone_number") && req.body.hasOwnProperty("salary")) {
          employee_module.employee_exists(req.body.phone_number, function (result, error, message) {
            if (error) {
              res.json ({ status: false, message: message });
            } else {
              var new_emp = {
                name: req.body.name,
                address: req.body.address,
                phone_number: req.body.phone_number,
                salary: req.body.salary,
              };

              employee_module.add_employee(new_emp, function(result, error, message) {
                if (error) {
                  res.json({ status: false, message: message });
                } else {
                  res.json({ status: true, message: message, result: result.insertedId });
                }
              })
            }
          });
        }
        else {
          if (req.body.hasOwnProperty("name") == false) {
            res.json({ status: false, message: "name parameter missing" });
          }
          else if (req.body.hasOwnProperty("address") == false) {
            res.json({ status: false, message: "address parameter missing"});
          }
          else if (req.body.hasOwnProperty("phone_number") == false) {
            res.json({ status: false, message: "phone_number parameter missing" });
          }
          else if (req.body.hasOwnProperty("salary") == false) {
            res.json({ status: false, message: "salary parameter missing"});
          }
        }
      } catch (er) {
        console.log("error occurred : "+ er);
        res.json({ status: false, message: er });
      }
    });    

    //END OF ADD NEW EMPLOYEE
  }
}