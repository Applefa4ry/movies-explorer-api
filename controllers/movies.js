const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const InvalidRequest = require('../errors/invalid-request');
const Forbidden = require('../errors/forbidden-error');

const updateCfg = {
  new: true, // обработчик then получит на вход обновлённую запись
  runValidators: true, // данные будут валидированы перед изменением
  upsert: false, // если пользователь не найден, он будет создан
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidRequest('Ошибка при создании фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Неверный ID фильма'));
      } else if (movie.owner.toString() !== req.user._id) {
        next(new Forbidden('Вы не можете удалить чужой фильм'));
      }
      return Movie.findByIdAndRemove(req.params.movieId, updateCfg);
    })
    .then((movie) => {
      res.send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidRequest('Ошибка при удалении фильма'));
      } else {
        next(err);
      }
    });
};
