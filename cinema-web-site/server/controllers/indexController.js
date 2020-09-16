let User = require('../models/odm/userDB/users');
let mongoose = require('mongoose');
let passport = require('passport');

module.exports.displayHomePage = function(req, res, next) {
    res.render('layout', { page: "contentMain/main" });
  };
  
module.exports.displayManageUsersPage = function(req, res, next) {
      res.render('layout', { page: "contentMain/manageUsers" });
  };

module.exports.displayLogin = function(req, res, next) {
      // check if user already logged in
      if(!req.user)
      {
        res.render('layout', { page: "contentMain/login",
        messages: req.flash("loginMessage")
        });
      }
      else 
      {
         return res.redirect("/");
      }
 };

 module.exports.processLoginPage = (req,res,next) => 
 {
   console.log(req);
   passport.authenticate('local', (err, user, info) =>{
      // server error
      if(err)
      {
        return next(err);
      }
      if(!user)
      {
        req.flash("loginMessage", "Athentication Error");
        return res.redirect('/login');
      }

      req.logIn(user, (err) => {
          // another type of server error
          if(err)
          {
            return next(err);
          }
          // all is good - login
          return res.redirect('/');
      });
   })(req,res,next);
 }


module.exports.displayCreateAccount = function(req, res, next) {
    // check if user already logged in
    if(!req.user)
    {
      res.render('layout', {
        page: "contentMain/createAccount",
        messages: req.flash("registerMessage")
      });
    }
    else 
    {
       return res.redirect("/");
    }
};

module.exports.performCreateAccount = (req,res,next) => {
  // check if the user exits in the db.
  User.findOne({username: req.body.username}, (err, user) =>
    {
      if(err){
        console.log(err);
        return res.end();
      }
      if(!user){
        req.flash("registerMessage", "username not found");
        return res.redirect('/createAccount');
      }
      // setup password for the user account
      user.setPassword(req.body.password, function(err) {
      if (err) {
       console.log(err);
       res.end(); 
      }
      user.save(function(err) {
          if (err) {
            console.log(err);
            res.end();
          }
          else {
            res.send("good");
          }
      });
  });
})}
/*
    {password : req.body.password},{useFindAndModify: false}, (err, user) => {
    if (err) 
    {
      console.log(err);
      res.end();
    }
    else
    {
      res.render('layout', { page: "contentMain/main"});
    }
  });
    
}
*/