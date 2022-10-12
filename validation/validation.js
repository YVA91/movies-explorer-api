const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validatorUrl = (value) => {
  const result = validator.isURL(value);
  if (!result) {
    throw new Error('URL validation err');
  }
  return value;
};

module.exports.validationCreateMovies = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required().max(4).regex(/^\d+$/),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validatorUrl),
    trailerLink: Joi.string().required().custom(validatorUrl),
    thumbnail: Joi.string().required().custom(validatorUrl),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
});

module.exports.validationMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
});

module.exports.validationUpdateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports.validationSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validationSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
    name: Joi.string().required().min(2).max(30),
  }),
});
