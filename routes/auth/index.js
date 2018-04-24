const routes = require('express').Router();
const controller = require('./controller');
const handleTryCatch = require('../../utils/handleTryCatch');

routes.post('/customer', handleTryCatch(controller.customerPostAuth));
routes.post('/employee', handleTryCatch(controller.employeePostAuth));

routes.post(
  '/verify_customer_token',
  handleTryCatch(controller.validateCustomerToken)
);
routes.post(
  '/verify_employee_token',
  handleTryCatch(controller.validateEmployeeToken)
);
routes.post(
  '/facebook_authentication',
  handleTryCatch(controller.facebook_authenticate)
);

module.exports = routes;
