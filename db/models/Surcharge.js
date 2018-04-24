const { Surcharge } = require('../schema');

Surcharge.fetchAll = queryParams => Surcharge.findAll({ where: queryParams });

module.exports = Surcharge;
