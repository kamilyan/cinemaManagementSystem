var express = require('express');
var router = express.Router();
let indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexController.displayHomePage);

router.get('/manageUsers', indexController.displayManageUsersPage);

module.exports = router;
