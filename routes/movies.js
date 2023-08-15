const router = require('express').Router();
const { validateAddMovie, validateDeleteMovie } = require('../middlewares/validations');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateAddMovie, createMovie);
router.delete('/:movieId', validateDeleteMovie, deleteMovie);

module.exports = router;
