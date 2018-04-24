const routes = require('express').Router();
const controller = require('./controller');
const handleTryCatch = require('../../utils/handleTryCatch');

routes.get('/', handleTryCatch(controller.getAll));
routes.get('/:id', handleTryCatch(controller.getOne));
routes.post('/', handleTryCatch(controller.create));
routes.put('/:id', handleTryCatch(controller.update));
routes.delete('/photos', handleTryCatch(controller.deletePhotos));

module.exports = routes;
