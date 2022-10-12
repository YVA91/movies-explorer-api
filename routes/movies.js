const router = require('express').Router();

const {
  getMyMovies,
  createMovies,
  deleteMovies,
} = require('../controllers/movies');
const {
  validationMovieId,
  validationCreateMovies,
} = require('../validation/validation');

router.get('/movies', getMyMovies);
router.post('/movies', validationCreateMovies, createMovies);
router.delete('/movies/:movieId', validationMovieId, deleteMovies);

module.exports = router;
