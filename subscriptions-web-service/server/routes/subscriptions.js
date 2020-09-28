var express = require('express');
var router = express.Router();
let subscriptionsController = require('../controllers/subscriptions');

router.get('/', subscriptionsController.displaySubscribers);
router.get('/:id', subscriptionsController.displaySubscriber);
router.post('/', subscriptionsController.addSubscriber);
router.put('/:id', subscriptionsController.editSubscriber);
router.delete('/:id', subscriptionsController.deleteSubscriber);

module.exports = router;