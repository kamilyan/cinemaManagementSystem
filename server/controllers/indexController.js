module.exports.displayHomePage = function(req, res, next) {
    res.render('layout', { page: "contentMain/main" });
  };
  
module.exports.displayManageUsersPage = function(req, res, next) {
      res.render('layout', { page: "contentMain/manageUsers" });
    };