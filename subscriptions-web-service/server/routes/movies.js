var express = require('express');
var router = express.Router();
let movieController = require('../controllers/movies');

router.get('/', movieController.displayMovies);
router.get('/:id', movieController.displayMovie);
router.post('/', movieController.addMovie);
router.put('/:id', movieController.editMovie);
router.delete('/:id', movieController.deleteMovie);

module.exports = router;