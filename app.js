const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const RoutesUsers = require('./routes/users');
const RoutesCards = require('./routes/movies');
const {
  login,
  createUsers,
  clearCookie,
} = require('./controllers/app');
require('dotenv').config();
const { errorHandler } = require('./middlewares/errorHandler');
const { NotFoundError } = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limit');

const {
  validationSignUp,
  validationSignIn,
} = require('./validation/validation');

const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);
app.post('/signin', validationSignIn, login);
app.post('/signup', validationSignUp, createUsers);
app.use(auth);
app.post('/signout', clearCookie);
app.use('/', RoutesUsers);
app.use('/', RoutesCards);
app.use((req, res, next) => {
  next(new NotFoundError('Неправильный путь'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/moviesdb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });
  await app.listen(PORT);
  console.log(`Сервер запущен на ${PORT} порту`);
}

main();
