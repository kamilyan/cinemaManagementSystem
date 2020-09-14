let userModel = require('../models/odm/userDB/users');

module.exports.displayHomePage = function(req, res, next) {
    res.render('layout', { page: "contentMain/main" });
  };
  
module.exports.displayManageUsersPage = function(req, res, next) {
      res.render('layout', { page: "contentMain/manageUsers" });
  };

module.exports.displayLogin = function(req, res, next) {
        res.render('layout', { page: "contentMain/login"});
 };

 module.exports.processLogin = function(req, res, next) {
  res.render('layout', { page: "contentMain/login"});
};

module.exports.displayCreateAccount = function(req, res, next) {
  res.render('layout', { page: "contentMain/createAccount"});
};

//TODO: handle case if the user was not found. proper msg.
module.exports.performCreateAccount = function(req, res, next) {
    userModel.findOneAndUpdate({username: req.body.username},
      {password : req.body.password},{useFindAndModify: false}, (err, user) => {
      if (err) 
      {
        console.log(err);
        res.end();
      }
      else
      {
        res.render('layout', { page: "contentMain/login"});
      }
    });
};

