var express = require('express');
var router = express.Router();
let subscriptionsController = require('../controllers/subscriptionsController');

router.get('/', subscriptionsController.displayMembers);
  
router.get('/add', subscriptionsController.displayAddMember);
  
router.post('/add', subscriptionsController.performAddMember);
    
router.put('/addMovie/:id', subscriptionsController.performAddMovieToMember);

router.get('/edit/:id', subscriptionsController.displayEditMember);

router.post('/edit/:id', subscriptionsController.performEditMember);


//router.get('/delete/:id', subscriptionsController.performDeleteMember);

module.exports = router;
