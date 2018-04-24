// const paymentMethods = require('../../../services/paymentMethods');
const {
  getAllPaymentSources,
  createPaymentSource,
  updatePaymentCustomer,
  deletePaymentMethod,
  getStripeIdFromToken,
} = require('../../services/payments');

exports.createPaymentMethod = req => {
  const { tokenId, isDefaultPaymentMethod } = req.body;
  return getStripeIdFromToken(req)
    .then(stripeId => createPaymentSource(stripeId, tokenId))
    .then(source => {
      if (isDefaultPaymentMethod) {
        updatePaymentCustomer(source.customer, { default_source: source.id });
      }
      return source;
    });
};

exports.getAllPaymentMethods = req =>
  getStripeIdFromToken(req).then(stripeId => getAllPaymentSources(stripeId));

exports.makeDefaultPaymentMethod = req =>
  getStripeIdFromToken(req).then(stripeId =>
    updatePaymentCustomer(stripeId, { default_source: req.params.id })
  );

exports.deletePaymentMethod = req =>
  getStripeIdFromToken(req).then(stripeId =>
    deletePaymentMethod(stripeId, req.params.id)
  );
