module.exports = {
  configure: function(app, mongo, ObjectID, url, assert) {
    var self = this;
    var login_module = require("../modules/login_module")(
      mongo,
      url,
      assert
    );

    //API TO Login
    app.post("/login", function(req, res) {
      try {
        if (
          req.body.hasOwnProperty("name") &&
          req.body.hasOwnProperty("password")
        ) {
          login_module.login_details_exists(
            req.body.name,
            req.body.password,
            function(result, error, message) {
              if (error) {
                res.json({ status: false, message: message });
              } else {
                res.json({ status: true, message: message });
              }
            }
          );
        }
      } catch (er) {
        console.log("error occurred : " + er);
        res.json({ status: false, message: er });
      }
    });
  //END OF LOGIN
  app.post("/availableEpmloyee", function(req, res) {
    try { 
         login_module.getEmployee(
          req.body.available,
          function(result, error, message) {
            if (error) {
              res.json({ status: false, message: message });
            } else {
              res.json({ array,status: true, message: message });
            }
          }
        );
    } catch (er) {
      console.log("error occurred : " + er);
      res.json({ status: false, message: er });
    }
  });
//end availableEmployee

  }
};
