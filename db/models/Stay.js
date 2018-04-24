const Sequelize = require('sequelize');
const { Stay, Customer, Hotel } = require('../schema');

const { Op } = Sequelize;

Stay.getHotelAvailability = hotelId =>
  Stay.count({
    where: {
      hotelId,
      status: 'AVAILABLE',
    },
  }).then(availableRooms => !!availableRooms && availableRooms > 0);

Stay.checkIn = id =>
  Stay.update(
    {
      status: 'CHECKED_IN',
      checkInTime: new Date().getTime(),
    },
    {
      attributes: ['checkInTime', 'status', 'id'],
      where: { id },
      returning: true,
      plain: true,
      raw: true,
    }
  ).then(data => data[1]);

Stay.findOneByHotelId = hotelId =>
  Stay.findOne({
    raw: true,
    where: {
      hotelId,
      status: 'AVAILABLE',
    },
    include: [
      {
        model: Hotel,
      },
    ],
  });

Stay.fetchHotelHistory = hotelId =>
  Stay.findAll({
    attributes: [
      'id',
      'bookingTime',
      'checkInTime',
      'checkOutTime',
      'roomNumber',
      'totalCharge',
      'roomCharge',
    ],
    where: {
      hotelId,
      status: 'CHECKED_OUT',
    },
    include: [Customer, Hotel],
  });

Stay.fetchCustomerHistory = customerId =>
  Stay.findAll({
    attributes: [
      'id',
      'bookingTime',
      'checkInTime',
      'checkOutTime',
      'roomNumber',
      'roomCharge',
      'totalCharge',
      'roomType',
    ],
    where: {
      customerId,
      status: 'CHECKED_OUT',
    },
    include: [Hotel],
  });

Stay.getDetailsForCheckOut = id =>
  Stay.findOne({
    where: { id },
    include: [
      { model: Customer, attributes: ['stripeId'] },
      { model: Hotel, attributes: ['id', 'stripeId'] },
    ],
  });

Stay.checkOut = ({ id, checkOutTime, roomCharge }) =>
  Stay.update(
    {
      status: 'CHECKED_OUT',
      checkOutTime,
      roomCharge,
      totalCharge: roomCharge,
    },
    {
      attributes: [
        'bookingTime',
        'checkInTime',
        'roomCharge',
        'roomNumber',
        'totalCharge',
        'costCurrency',
        'checkOutTime',
        'status',
        'hotelId',
        'id',
      ],
      where: { id },
      returning: true,
      plain: true,
      raw: true,
    }
  );

Stay.cancel = id =>
  Stay.update(
    {
      status: 'AVAILABLE',
      bookingTime: null,
      customerId: null,
    },
    {
      where: {
        id,
      },
    }
  );

Stay.fetchActive = hotelId =>
  Stay.findAll({
    attributes: [
      'id',
      'customerId',
      'status',
      'bookingTime',
      'checkInTime',
      'roomNumber',
    ],
    where: {
      hotelId,
      status: {
        [Op.or]: ['AVAILABLE', 'BOOKED', 'CHECKED_IN'],
      },
    },
    include: [
      {
        model: Customer,
        attributes: ['firstName', 'lastName'],
      },
    ],
  });

Stay.getCustomerBookingStatus = customerId =>
  Stay.findAll({
    attributes: [
      'id',
      'status',
      'bookingTime',
      'checkInTime',
      'roomNumber',
      'roomType',
    ],
    raw: true,
    where: {
      customerId,
      status: {
        [Op.or]: ['BOOKED', 'CHECKED_IN'],
      },
    },
    include: [
      {
        model: Customer,
        attributes: { exclude: ['password'] },
      },
      {
        model: Hotel,
      },
    ],
  }).then(data => data[0]);

module.exports = Stay;
