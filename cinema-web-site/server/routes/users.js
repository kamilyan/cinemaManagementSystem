var express = require('express');
var router = express.Router();
let usersController = require('../controllers/usersController');

router.get('/', usersController.displayUsers);
  
router.get('/add', usersController.displayAddUser);
  
router.post('/add', usersController.performAddUser);
  
router.get('/edit', usersController.displayEditUser);
  
router.post('/edit/:id', usersController.performEditUser);

router.post('/delete/:id', usersController.performDeleteUser);



module.exports = router;
