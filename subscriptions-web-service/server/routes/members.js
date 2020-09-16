var express = require('express');
var router = express.Router();
let membersController = require('../controllers/members');

router.get('/', membersController.displayMembers);
router.get('/:id', membersController.displayMember);
router.post('/', membersController.addMember);
router.put('/:id', membersController.editMember);
router.delete('/:id', membersController.deleteMember);

module.exports = router;