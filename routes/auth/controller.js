/* eslint consistent-return:0 */
const { signToken, validateToken } = require('../../db/helpers');
const { customer: customerService } = require('../../services/');
const { Customer, Stay, Employee } = require('../../db/models/');
const rp = require('request-promise');
const logger = require('../../logger');

const getFbUser = accessToken => {
  const options = {
    uri: 'https://graph.facebook.com/v2.8/me',
    qs: {
      access_token: accessToken,
      fields: 'id,email,first_name,last_name',
    },
    headers: {
      'User-Agent': 'Request-Promise',
    },
    json: true, // Automatically parses the JSON string in the response
  };
  return rp(options);
};

exports.customerPostAuth = async req => {
  const { password } = req.body;
  const email = req.body.email.toLowerCase();
  const customer = await Customer.fetchOne({ email });
  const passwordSuccess = await customer.comparePassword(password);
  if (!passwordSuccess) {
    throw new Error('Invalid Password');
  }
  const customerBookingStatus = await Stay.getCustomerBookingStatus(
    customer.id
  );
  const customerInfo = customerBookingStatus || customer.toJSON();
  return {
    data: { ...customerInfo, token: signToken(customer.id) },
    customerId: customer.id,
  };
};

exports.employeePostAuth = async req => {
  const { password } = req.body;
  const email = req.body.email.toLowerCase();
  const employee = await Employee.fetchOne({ email });
  const passwordSuccess = await employee.comparePassword(password);
  if (passwordSuccess) {
    const token = signToken(employee.id);
    return { token, employee };
  }
  throw new Error('Invalid Password');
};

exports.validateCustomerToken = async function validate(req) {
  const { token } = req.body;
  const { userId } = validateToken(token);
  const customerBookingStatus = await Stay.getCustomerBookingStatus(userId);
  if (customerBookingStatus) {
    return {
      data: { ...customerBookingStatus, token },
    };
  }
  const customer = await Customer.fetchOne({ id: userId });
  if (customer) {
    return { data: { ...customer.toJSON(), token } };
  }
  throw new Error('Invalid Customer Token');
};

exports.validateEmployeeToken = async req => {
  const { token } = req.body;
  const { userId } = await validateToken(token);
  const employee = await Employee.fetchOne({ id: userId });
  return employee;
};

exports.facebook_authenticate = function facebookAuthenticate(req, res) {
  const { accessToken, facebookId } = req.body;
  getFbUser(accessToken)
    .then(fbUser => {
      if (fbUser.id === facebookId) {
        return customerService
          .fbRetrieveCustomer(fbUser)
          .then(({ customer, newlyCreated }) => {
            // setCustomerSocketId(customer.id, socketId);
            const token = signToken(customer.id);
            if (newlyCreated) {
              return res({ ...customer, token });
            }
            return Stay.getCustomerBookingStatus(customer.id).then(data => {
              if (data) {
                return res({ ...data, token });
              }
              return res({ ...customer, token });
            });
            // .catch(rej);
          })
          .catch(error => console.log('wtf why is there an error??', error));
      }
      // return rej(new Error('Invalid Access Token'));
    })
    .catch(error => logger.error('error in getFBuser!!', error));
};
