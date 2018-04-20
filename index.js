const express = require('express');
const applyRoutes = require('./routes');
const applyMiddlewares = require('./configs/middlewares');
const logger = require('./configs/logger');

const app = express();
const host = process.env.HOST || null;
const port = process.env.PORT || 5051;

applyMiddlewares(app);
applyRoutes(app);

app.listen(port, host, err => {
  if (err) {
    return logger.error(err.message);
  }
  const prettyHost = host || 'localhost';
  return logger.appStarted(port, prettyHost);
});
