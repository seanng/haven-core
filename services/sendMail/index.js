const sgMail = require('@sendgrid/mail');
const employeeEmailTemplate = require('./employee-template');
const guestEmailTemplate = require('./guest-template');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const DEFAULTS = {
  from: 'haven.dvpt@gmail.com',
  to: 'haven.dvpt@gmail.com',
  subject: 'Haven app verification e-mail',
};

/*
htmlOptions: 
  firstName 
  password 
  userId 
  hotelName 
  email 

*/

module.exports = ({
  from = DEFAULTS.from,
  to = DEFAULTS.to,
  subject = DEFAULTS.subject,
  isEmployee = true,
  htmlOptions,
}) => {
  const html = isEmployee
    ? employeeEmailTemplate(htmlOptions)
    : guestEmailTemplate(htmlOptions);
  sgMail.send({ from, to, subject, html });
};
