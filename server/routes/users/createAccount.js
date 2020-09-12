var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('layout', { page: "users/createAccount"});
});

router.post('/', function(req, res, next) {
    res.render('layout', { page: "users/createAccount"});
  });

module.exports = router;
