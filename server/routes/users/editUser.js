var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('layout', { page: "users/editUser"});
});

router.post('/', function(req, res, next) {
    res.render('layout', { page: "users/editUser"});
  });

module.exports = router;
