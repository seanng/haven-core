const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');
const { Customer } = require('../schema');

const cipher = Promise.promisify(bcrypt.hash);
const compare = Promise.promisify(bcrypt.compare);

Customer.beforeBulkCreate(async users => {
  // eslint-disable-next-line
  for (const user of users) {
    // eslint-disable-next-line
    const hashedPw = await cipher(user.password, null, null);
    user.password = hashedPw;
  }
});

Customer.beforeCreate(user =>
  cipher(user.password, null, null).then(hashedPw => {
    // eslint-disable-next-line no-param-reassign
    user.password = hashedPw;
  })
);

Customer.prototype.comparePassword = function comparePassword(
  candidatePassword
) {
  return compare(candidatePassword, this.getDataValue('password'));
};

Customer.fetchOne = params => Customer.findOne({ where: params, raw: true });

Customer.updateProfile = profile =>
  Customer.update(profile, {
    where: { id: profile.id },
    returning: true,
    plain: true,
    raw: true,
  }).then(data => data[1]);

module.exports = Customer;
