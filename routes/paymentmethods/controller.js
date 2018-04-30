const {
  getAllPaymentSources,
  createPaymentSource,
  updatePaymentCustomer,
  deletePaymentMethod,
  getStripeIdFromToken,
  authorizePaymentSource,
} = require('../../services/payments');

exports.createPaymentMethod = async req => {
  const { tokenId, tokenId2, isDefaultPaymentMethod } = req.body;
  const stripeId = await getStripeIdFromToken(req);
  const source = await createPaymentSource(stripeId, tokenId);
  const { status: authStatus } = await authorizePaymentSource(tokenId2);
  if (authStatus === 'succeeded') {
    if (isDefaultPaymentMethod) {
      updatePaymentCustomer(source.customer, { default_source: source.id });
    }
    return source;
  }
  throw new Error(authStatus);
};

exports.getAllPaymentMethods = async req => {
  const stripeId = await getStripeIdFromToken(req);
  return getAllPaymentSources(stripeId);
};

exports.makeDefaultPaymentMethod = req =>
  getStripeIdFromToken(req).then(stripeId =>
    updatePaymentCustomer(stripeId, { default_source: req.params.id })
  );

exports.deletePaymentMethod = req =>
  getStripeIdFromToken(req).then(stripeId =>
    deletePaymentMethod(stripeId, req.params.id)
  );
