var express = require('express');
var router = express.Router();
let moviesController = require('../controllers/moviesController');

router.get('/allMovies', moviesController.displayMovies);

router.get('/allMovies/:id', moviesController.displayMovie);
  
router.get('/add', moviesController.displayAddMovie);
  
router.post('/add', moviesController.performAddMovie);
  
router.get('/edit/:id', moviesController.displayEditMovie);
  
router.post('/edit/:id', moviesController.performEditMovie);

//router.get('/delete/:id', moviesController.performDeleteMovie);

module.exports = router;
