const logger = require('../logger');

module.exports = fn => (req, res, next) =>
  fn(req, res, next)
    .then(data => res.json(data))
    .catch(err => {
      if (err) {
        logger.error('we found an err in handleResponse: ', err);
        res.status(400).send(err);
      }
      next();
    });
