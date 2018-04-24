const routes = require('express').Router();
const controller = require('./controller');
const handleTryCatch = require('../../utils/handleTryCatch');

routes.post('/', handleTryCatch(controller.addEmployee));
routes.put('/:id', handleTryCatch(controller.updateEmployee));
routes.get('/hotel/:hotelId', handleTryCatch(controller.getHotelEmployees));
routes.delete('/:id', handleTryCatch(controller.deleteEmployee));
routes.delete('/photo', handleTryCatch(controller.deletePhoto));
routes.post('/photo/:id', handleTryCatch(controller.createPhoto));

module.exports = routes;
