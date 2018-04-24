const { getConfigurationValue } = require('../config/env');
const Sequelize = require('sequelize');

const dbConfig = getConfigurationValue('postgres');
const sequelize = new Sequelize(
  dbConfig.dbName,
  dbConfig.username,
  dbConfig.password,
  {
    dialect: 'postgres',
    operatorsAliases: false,
  }
);

/* Schema Definitions */
const Customer = sequelize.define('customer', {
  username: { type: Sequelize.STRING, unique: true },
  password: Sequelize.STRING,
  facebookId: Sequelize.STRING,
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: { type: Sequelize.STRING, unique: true },
  phoneNumber: Sequelize.STRING,
  avatarUrl: {
    type: Sequelize.STRING,
    defaultValue: 'https://d30y9cdsu7xlg0.cloudfront.net/png/547789-200.png',
  },
  accountStatus: Sequelize.INTEGER,
  paymentAuthStatus: Sequelize.INTEGER,
  rating: Sequelize.FLOAT,
  stripeId: Sequelize.STRING,
});

const Employee = sequelize.define('employee', {
  username: { type: Sequelize.STRING, unique: true },
  password: Sequelize.STRING,
  verified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  inviterId: Sequelize.INTEGER,
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: { type: Sequelize.STRING, unique: true },
  phoneNumber: Sequelize.STRING,
  photoUrl: {
    type: Sequelize.STRING,
    defaultValue: 'https://d30y9cdsu7xlg0.cloudfront.net/png/547789-200.png',
  },
  adminLevel: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  }, // level 1: staff, level 2: admin, level 3: super-user? (i.e. customer service)
});

const Hotel = sequelize.define('hotel', {
  name: Sequelize.STRING,
  locationAddress: {
    type: Sequelize.STRING,
    defaultValue: 'Please enter a valid address',
  },
  locationLatitude: {
    type: Sequelize.STRING,
    defaultValue: '22.3964',
  },
  locationLongitude: {
    type: Sequelize.STRING,
    defaultValue: '114.1095',
  },
  costCurrency: {
    type: Sequelize.STRING,
    defaultValue: 'HKD',
  },
  costMinCharge: {
    type: Sequelize.FLOAT,
    defaultValue: 0,
  },
  costPerHour: {
    type: Sequelize.FLOAT,
    defaultValue: 0,
  },
  costPerMinute: {
    type: Sequelize.FLOAT,
    defaultValue: 0,
  },
  photos: {
    type: Sequelize.ARRAY(Sequelize.STRING), // array[0] would be the primary photoURL
    defaultValue: [
      'https://images.pexels.com/photos/271668/pexels-photo-271668.jpeg',
    ],
  },
  description: {
    type: Sequelize.TEXT,
    defaultValue: 'Please add a description to your hotel.',
  },
  amenities: {
    type: Sequelize.ARRAY(Sequelize.STRING), // i.e. 'Free WiFi'
    defaultValue: [],
  },
  rating: {
    type: Sequelize.DECIMAL,
    defaultValue: 5,
  },
  roomType: {
    type: Sequelize.STRING,
    defaultValue: '',
  },
  stripeId: Sequelize.STRING,
});

const Stay = sequelize.define('stay', {
  status: Sequelize.STRING, // AVAILABLE, BOOKED, CANCELLED?, CHECKED IN, CHECKED OUT,
  bookingTime: Sequelize.DATE,
  checkInTime: Sequelize.DATE, // Update on check in
  checkOutTime: Sequelize.DATE, // Update on check out
  roomNumber: Sequelize.STRING, // Update on create Room
  roomType: Sequelize.STRING,
  roomCharge: Sequelize.FLOAT,
  totalCharge: Sequelize.FLOAT,
  costMinCharge: {
    type: Sequelize.FLOAT,
    defaultValue: 400,
  },
  costPerHour: {
    type: Sequelize.FLOAT,
    defaultValue: 200,
  },
  costPerMinute: {
    type: Sequelize.FLOAT,
    defaultValue: 5,
  },
  stripeChargeId: Sequelize.STRING,
});

const Surcharge = sequelize.define('surcharge', {
  service: Sequelize.STRING,
  status: Sequelize.STRING,
  charge: Sequelize.FLOAT,
});

/* Relationships */
Customer.hasMany(Stay);
Stay.belongsTo(Customer);

Hotel.hasMany(Stay);
Stay.belongsTo(Hotel);

Stay.hasMany(Surcharge);
Surcharge.belongsTo(Stay);

Hotel.hasMany(Employee);
Employee.belongsTo(Hotel);

module.exports = {
  sequelize,
  Customer,
  Hotel,
  Stay,
  Employee,
  Surcharge,
};
