const morgan = require('morgan');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');

const corsWhitelist = {
  development: ['http://localhost:8080', undefined],
  production: [],
};

const corsOptions = {
  origin(origin, callback) {
    if (corsWhitelist[process.env.NODE_ENV].indexOf(origin) === -1) {
      callback(new Error('Not allowed by CORS'));
    } else {
      callback(null, true);
    }
  },
};

module.exports = app => {
  app.use(morgan('dev'));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cors(corsOptions));
  app.use(cookieParser());
  return app;
};
