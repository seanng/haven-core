const logger = require('../logger');

module.exports = fn => (req, res, next) =>
  fn(req, res, next)
    .then(data => res.json(data))
    .catch(error => {
      logger.error('we found an err in handleResponse: ', error);
      res.status(400).send(error);
      next();
    });
