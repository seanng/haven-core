const routes = require('express').Router();
const handleTryCatch = require('../../utils/handleTryCatch');
const controller = require('./controller');

routes.get('/customer/:token', handleTryCatch(controller.fetchByCustomerId));
routes.get('/hotel/:id', handleTryCatch(controller.fetchByHotelId));
routes.post('/', handleTryCatch(controller.createRoom));
routes.put('/:id', handleTryCatch(controller.updateBooking));
routes.put('/', handleTryCatch(controller.createBooking));
routes.delete('/:id', handleTryCatch(controller.deleteRoom));

module.exports = routes;
