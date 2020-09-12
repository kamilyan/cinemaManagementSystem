var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('layout', { page: "users/addUser"});
});

router.post('/', function(req, res, next) {
    res.render('layout', { page: "users/addUser"});
  });

module.exports = router;
