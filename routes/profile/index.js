const routes = require('express').Router();
const controller = require('./controller');

routes.put('/', controller.update);

module.exports = routes;
