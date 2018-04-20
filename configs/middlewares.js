const morgan = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');

module.exports = app => {
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  return app;
};
