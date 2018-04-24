const { validateToken } = require('../db/helpers');

function generatePassword() {
  return Math.random()
    .toString(36)
    .slice(-8);
}

const getUserIdByReq = req =>
  new Promise((resolve, reject) => {
    validateToken(req.header('Authorization'), (err, customer) => {
      if (err) {
        return reject(err);
      }
      return resolve(customer.userId);
    });
  });

module.exports = {
  generatePassword,
  getUserIdByReq,
};
