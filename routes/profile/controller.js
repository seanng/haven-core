const Customer = require('../../db/models/Customer');
const logger = require('../../logger');
const { getUserIdByReq } = require('../../utils/helpers');

exports.update = req =>
  getUserIdByReq(req)
    .then(userId =>
      Customer.update(req.body.profile, {
        where: { id: userId },
      }).then(() => ({ profile: req.body.profile }))
    )
    .catch(err => {
      logger.error(err);
    });
