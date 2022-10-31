const Movie = require('../models/movie');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');

module.exports.getMyMovies = async (req, res, next) => {
  try {
    const Movies = await Movie.find({ owner: req.user._id });
    res.status(200).send(Movies);
  } catch (err) {
    next(err);
  }
};

module.exports.createMovies = async (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  try {
    const film = await Movie({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner,
      movieId,
      nameRU,
      nameEN,
    }).save();
    res.status(200).send(film);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports.deleteMovies = async (req, res, next) => {
  const Id = req.params.movieId;
  try {
    const MovieId = await Movie.findById(Id);
    if (MovieId) {
      if (req.user._id === MovieId.owner._id.toString()) {
        await Movie.findByIdAndRemove(MovieId, {
          new: true,
          runValidators: true,
        });
        res.status(200).send({ MovieId });
      } else {
        throw new ForbiddenError('Недостаточно прав');
      }
    } else {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};
