var nodemailer = require("nodemailer");
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
          req.body.hasOwnProperty("user_email") &&
          req.body.hasOwnProperty("password")
        ) {
          login_module.login_details_exists(
            req.body.user_email,
            req.body.password,
            function(result, error, message) {
              if (error) {
                //res.json({validate: result, status: false, message: message });
                 login_module.login_emp_details_exists( req.body.user_email, req.body.password,
                   function(result, error, message) {
                     if (error) {
                      // res.json({validate: result, status: false, message: message });
                      login_module.login_admin_details_exists( req.body.user_email, req.body.password,
                        function(result, error, message) {
                          if (error) {
                          res.json({validate: result, status: false, message: message });
                          } else {
                           res.json({ validate: result, status: true, message: message });
                           }
                         }
                        );
                     } else {
                      res.json({ validate: result, status: true, message: message });
                      }
                    }
                   );
              } else {
                 res.json({ validate: result, status: true, message: message });
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
              res.json({ result: array,status: true, message: message });
            }
          }
        );
    } catch (er) {
      console.log("error occurred : " + er);
      res.json({ status: false, message: er });
    }
  });
//end availableEmployee
app.post("/find_user_query", function(req, res) {
  try { 
       login_module.getQuery(req.body.subject,
        function(result, error, message) {
          if (error) {
            res.json({ status: false, message: message, result:result });
          } else {
            res.json({ status: true, message: message, result: result });
          }
        }
      );
      //console.log(req.body.company);
  } catch (er) {
    console.log("error occurred : " + er);
    res.json({ status: false, message: er });
  }
});
//end find user query

//API TO admin assign work
app.post("/admin_assign_work", function(req, res) {
  try {
   
      login_module.assignWork(
        req.body.user_email,
        req.body.emp_email,
        
        function( error, message) {
          if (error) {
            res.json({ status: false, message: message });
          } else {
            res.json({ status: true, message: message });
          }
        }
      );
    
  } catch (er) {
    console.log("error occurred : " + er);
    res.json({ status: false, message: er });
  }
});
//END OF admin assign work
//start emp_check_assigned_work
app.post("/emp_check_assigned_work", function(req, res) {
  try { 
       login_module.getUser(
        req.body.emp_email,
        function(result, error, message) {
          if (error) {
            res.json({ result: result,status: false, message: message });
          } else {
            res.json({result:result, status: true, message: message });
          }
        }
      );
  } catch (er) {
    console.log("error occurred : " + er);
    res.json({ status: false, message: er });
  }
});
//end emp_check_assigned_work
app.post("/emp_find_user_query", function(req, res) {
  try { 
       login_module.empGetQuery(
        req.body.user_email,
        function(result, error, message) {
          if (error) {
            res.json({result: result, status: false, message: message });
          } else {
            res.json({ result: result, status: true, message: message });
          }
        }
      );
  } catch (er) {
    console.log("error occurred : " + er);
    res.json({ status: false, message: er });
  }
});
//end emp_check_assigned_work

//stat add email
app.post("/email", function (req, res) {
  try { 
    login_module.findemail(
     req.body.user_email,
     function(result, error, message) {
       if (error) {
         res.json({result: result, status: false, message: message });
       } else {
        // res.json({result: result, status: true, message: message });
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "thequerysolver@gmail.com",
            pass: "AmPmAm@1"
          }
        });
      
        var mailOptions = {
          from: "thequerysolver@gmail.com",
          to: result,
          subject: req.body.subject,
          text: req.body.replyMessage
        };
      
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            res.json({ status: false, message: "email not send" });
          } else {
            console.log("Email sent: " + info.response);
            res.json({ status: true, message: "mail send" });
          }
        });
       }
     }
   );
} catch (er) {
 console.log("error occurred : " + er);
 res.json({ status: false, message: er });
}
  
 
});
//end of email
//start
app.post("/emp_solve_user_query", function(req, res) {
  try { 
       login_module.solveQuery(
        req.body.user_email,
        function(result, error, message) {
          if (error) {
            res.json({result: result, status: false, message: message });
          } else {
            login_module.solveQuery2(
              req.body.user_email,
              req.body.answer,
              function(result, error, message) {
                if (error) {
                  res.json({result: result, status: false, message: message });
                } else {
                  // res.json({ result: result, status: true, message: message });
                  login_module.UnAvailableToAvailable(
                    req.body.emp_email,
                    function(result, error, message) {
                      if (error) {
                        res.json({result: result, status: false, message: message });
                      } else {
                        res.json({ result: result, status: true, message: message });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
  } catch (er) {
    console.log("error occurred : " + er);
    res.json({ status: false, message: er });
  }
});
// end solve

app.post("/emp_reassion_user_query", function(req, res) {
  try { 
       login_module.processingToNotSolve(
        req.body.user_email,
        function(result, error, message) {
          if (error) {
            res.json({result: result, status: false, message: message });
          } else {
            login_module.UnAvailableToAvailable(
              req.body.emp_email,
              function(result, error, message) {
                if (error) {
                  res.json({result: result, status: false, message: message });
                } else {
                  res.json({ result: result, status: true, message: message });
                }
              }
            );
          }
        }
      );
  } catch (er) {
    console.log("error occurred : " + er);
    res.json({ status: false, message: er });
  }
});
//end reassion

//START ANALYSE DATA
app.post("/analyse_data", function(req, res) {
  try { 
       login_module.countNoOfCompanyGroupBy(

        function(subject,count, error, message) {
          if (error) {
            res.json({ status: false, message: message });
          } else {
            res.json({ status:true, subject:subject, count: count, message:message});
          }
        }
      );
  } catch (er) {
    console.log("error occurred : " + er);
    res.json({ status: false, message: er });
  }
});
//END ANALYSE DATA
//end availableEmployee
app.post("/user_find_query", function(req, res) {
  try { 
       login_module.userGetAllQuery(req.body.user_email,
        function(result, error, message) {
          if (error) {
            res.json({ status: false, message: message, result:result });
          } else {
            res.json({ status: true, message: message, result: result });
          }
        }
      );
      //console.log(req.body.company);
  } catch (er) {
    console.log("error occurred : " + er);
    res.json({ status: false, message: er });
  }
});
//end find user query

  }
};
