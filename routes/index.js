const express = require('express');
const createError = require('http-errors');

const router = express.Router();

/* GET home page. */
const indexRouter = () => {
  router.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
  });
};

const handleNotFound = (req, res, next) => {
  next(createError(404));
};

const handleServerErrors = (err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
};

module.exports = app => {
  app.use('/', indexRouter());
  app.use(handleNotFound);
  app.use(handleServerErrors);

  return app;
};
