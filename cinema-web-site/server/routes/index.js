var express = require('express');
var router = express.Router();
let indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexController.displayHomePage);

router.get('/manageUsers', indexController.displayManageUsersPage);

router.get('/login', indexController.displayLogin);

router.post('/login', indexController.processLoginPage);

router.post('/login', indexController.processLoginPage);

router.get('/logout', indexController.performLogout);

router.get('/createAccount', indexController.displayCreateAccount);

router.post('/createAccount', indexController.performCreateAccount);

module.exports = router;