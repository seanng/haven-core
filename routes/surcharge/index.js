const routes = require('express').Router();
const handleTryCatch = require('../../utils/handleTryCatch');
const controller = require('./controller');

routes.get('/stay/:stayId', handleTryCatch(controller.getChargesForStay));
routes.post('/stay/:stayId', handleTryCatch(controller.saveChargesForStay));

module.exports = routes;
