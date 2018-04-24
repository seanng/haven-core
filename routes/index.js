const routes = require('express').Router();
const auth = require('./auth');
const customer = require('./customer');
const employee = require('./employee');
const hotels = require('./hotels');
const profile = require('./profile');
const stays = require('./stays');
const paymentmethods = require('./paymentmethods');
const surcharge = require('./surcharge');

routes.use('/auth', auth);
routes.use('/customer', customer);
routes.use('/employee', employee);
routes.use('/hotels', hotels);
routes.use('/profile', profile);
routes.use('/stays', stays);
routes.use('/paymentmethods', paymentmethods);
routes.use('/surcharge', surcharge);

module.exports = app => {
  app.use('/api', routes);

  return app;
};
