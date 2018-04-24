const request = require('request-promise');
const { getConfigurationValue } = require('../config/env');
const stripe = require('stripe')(getConfigurationValue('stripeSecretKey'));
const differenceInHours = require('date-fns/difference_in_hours');
const differenceInMinutes = require('date-fns/difference_in_minutes');
const logger = require('../logger');
const { validateToken } = require('../db/helpers');
const { Customer } = require('../db/models');

exports.getHotelStripeId = stripeCode =>
  request({
    method: 'POST',
    uri: 'https://connect.stripe.com/oauth/token',
    body: {
      client_secret: getConfigurationValue('stripeSecretKey'),
      code: stripeCode,
      grant_type: 'authorization_code',
    },
    json: true,
  });

const getCustomerStripeId = id =>
  Customer.findById(id, {
    attributes: ['stripeId'],
  })
    .then(({ stripeId, email }) => {
      if (stripeId) {
        return stripeId;
      }
      return stripe.customers
        .create({ email })
        .then(response =>
          Customer.updateProfile({
            id,
            stripeId: response.id,
          })
        )
        .then(customer => customer.stripeId);
    })
    .catch(err => logger.error('what the fuck man', err));

exports.getStripeIdFromToken = req => {
  const customerId = validateToken(req.headers.authorization).userId;
  return getCustomerStripeId(customerId);
};

exports.createPaymentSource = (stripeId, source) =>
  stripe.customers.createSource(stripeId, { source });

exports.updatePaymentCustomer = (stripeId, params) =>
  stripe.customers.update(stripeId, params).then(response => ({
    defaultMethod: response.default_source,
    paymentMethods: response.sources.data,
  }));

exports.deletePaymentMethod = (stripeId, cardId) =>
  stripe.customers.deleteCard(stripeId, cardId);

exports.getAllPaymentSources = stripeId =>
  stripe.customers.retrieve(stripeId).then(response => ({
    defaultMethod: response.default_source,
    paymentMethods: response.sources.data,
  }));

exports.computeRoomCharge = ({
  checkOutTime,
  checkInTime,
  costPerHour,
  costPerMinute,
  costMinCharge,
}) => {
  const totalHours = differenceInHours(checkOutTime, checkInTime);
  const totalMinutes = differenceInMinutes(checkOutTime, checkInTime);
  const accruedMinutes = totalMinutes - totalHours * 60;
  const totalCharge = totalHours * costPerHour + accruedMinutes * costPerMinute;
  return totalCharge > costMinCharge ? totalCharge : costMinCharge;
};

exports.chargeCustomer = (customerStripeId, hotelStripeId, amount) =>
  stripe.charges.create({
    amount,
    currency: 'hkd',
    customer: customerStripeId,
    destination: {
      account: hotelStripeId,
      amount: amount * 0.8, // assuming we take 20% cut.
    },
  });
