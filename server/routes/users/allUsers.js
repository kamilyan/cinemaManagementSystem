var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('layout', { page: "users/allUsers"});
});

router.post('/', function(req, res, next) {
    res.render('layout', { page: "users/allUsers"});
  });

module.exports = router;
