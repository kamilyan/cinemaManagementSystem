var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('layout', { page: "users/allUsers"});
  });
  
router.post('/', function(req, res, next) {
      res.render('layout', { page: "users/allUsers"});
  });

router.get('/add', function(req, res, next) {
    res.render('layout', { page: "users/addUser"});
  });
  
router.post('/add/:id', function(req, res, next) {
      res.render('layout', { page: "users/addUser"});
  });
  
router.get('/edit', function(req, res, next) {
    res.render('layout', { page: "users/editUser"});
  });
  
router.post('/edit/:id', function(req, res, next) {
      res.render('layout', { page: "users/editUser"});
  });

router.get('/login', function(req, res, next) {
    res.render('layout', { page: "users/login"});
  });

router.get('/createAccount', function(req, res, next) {
    res.render('layout', { page: "users/createAccount"});
  });
  
router.post('/createAccount', function(req, res, next) {
      res.render('layout', { page: "users/createAccount"});
  });
  

module.exports = router;
