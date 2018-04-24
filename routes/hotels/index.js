const routes = require('express').Router();
const controller = require('./controller');
const handleTryCatch = require('../../utils/handleTryCatch');

routes.post('/', handleTryCatch(controller.create));
routes.put('/:id', handleTryCatch(controller.update));
routes.get('/:id', handleTryCatch(controller.get));
routes.delete('/photos', handleTryCatch(controller.deletePhotos));

module.exports = routes;
