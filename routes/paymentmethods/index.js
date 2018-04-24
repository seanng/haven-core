const routes = require('express').Router();
const controller = require('./controller');
const handleTryCatch = require('../../utils/handleTryCatch');

routes.put('/:id', handleTryCatch(controller.makeDefaultPaymentMethod));
routes.get('/', handleTryCatch(controller.getAllPaymentMethods));
routes.post('/', handleTryCatch(controller.createPaymentMethod));
routes.delete('/:id', handleTryCatch(controller.deletePaymentMethod));

module.exports = routes;
