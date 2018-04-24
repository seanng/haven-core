/* eslint global-require:0 */
const express = require('express');
const applyRoutes = require('./routes');
const applyMiddlewares = require('./config/middlewares');
const logger = require('./logger');

const app = express();
const host = process.env.HOST || null;
const port = process.env.PORT || 5052;

applyMiddlewares(app);
applyRoutes(app);

app.listen(port, host, err => {
  if (err) {
    return logger.error(err.message);
  }
  const prettyHost = host || 'localhost';
  // require('./db/fakeData')();
  return logger.appStarted(port, prettyHost);
});
