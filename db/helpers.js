const jwt = require('jsonwebtoken');

const secret = '19ajsadijmvz';

exports.signToken = id =>
  jwt.sign({ userId: id }, secret, { expiresIn: 94608000 });

exports.validateToken = token => jwt.verify(token, secret);

exports.parseToken = token => jwt.decode(token);
