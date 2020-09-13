
module.exports.displayUsers = function(req, res, next) {
    res.render('layout', { page: "users/allUsers"});
  };
    
module.exports.displayEditUser = function(req, res, next) {
    res.render('layout', { page: "users/editUser"});
  };
  
module.exports.performEditUser = function(req, res, next) {
      res.render('layout', { page: "users/editUser"});
  };

module.exports.performDeleteUser = function(req, res, next) {
      res.render('layout', { page: "users/editUser"});
  };

  
module.exports.displayAddUser = function(req, res, next) {
    res.render('layout', { page: "users/addUser"});
  };

module.exports.performAddUser = function(req, res, next) {
    res.render('layout', { page: "users/addUser"});
  };
  
module.exports.displayLogin = function(req, res, next) {
    res.render('layout', { page: "users/login"});
  };

module.exports.displayCreateAccount = function(req, res, next) {
    res.render('layout', { page: "users/createAccount"});
  };
  
module.exports.performCreateAccount = function(req, res, next) {
      res.render('layout', { page: "users/createAccount"});
  };
  
