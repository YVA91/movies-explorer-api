const User = require('../models/user');
const { BadRequestError } = require('../errors/BadRequestError');
const { ConflictError } = require('../errors/ConflictError');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findById(req.user._id);
    res.status(200).send({
      name: users.name,
      email: users.email,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.updateUserInfo = async (req, res, next) => {
  try {
    const UserId = req.user._id;
    const users = await User.findByIdAndUpdate(UserId, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).send(users);
  } catch (err) {
    if (err.name === 'Validation failed') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
    if (err.name === 'MongoServerError') {
      next(new ConflictError('Пользователь с таким электнонным адресом уже существует'));
    } else {
      next(err);
    }
  }
};
