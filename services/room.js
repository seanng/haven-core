const Stay = require('../db/models/Stay');
const { payments } = require('./index');

exports.create = (hotelId, roomNumber) =>
  Stay.create({
    hotelId,
    roomNumber,
    status: 'AVAILABLE',
  });

exports.book = async (customerId, hotel) => {
  const updatedParams = {
    status: 'BOOKED',
    customerId,
    costMinCharge: hotel.costMinCharge,
    costPerHour: hotel.costPerHour,
    costPerMinute: hotel.costPerMinute,
    bookingTime: new Date().getTime(),
  };
  const stay = await Stay.findOneByHotelId(hotel.id);
  if (stay === null) {
    throw new Error('no stay is available for this hotel');
  }
  await Stay.update(updatedParams, {
    where: { id: stay.id },
  });
  return { ...stay, ...updatedParams };
};

exports.checkOut = async stayId => {
  const checkOutTime = new Date().getTime();
  const stayInfo = await Stay.getDetailsForCheckOut(stayId);
  const roomCharge = payments.computeRoomCharge({
    checkOutTime,
    checkInTime: stayInfo.checkInTime,
    costPerHour: stayInfo.costPerHour,
    costPerMinute: stayInfo.costPerMinute,
    costMinCharge: stayInfo.costMinCharge,
  });
  const { id: stripeChargeId } = await payments.chargeCustomer(
    stayInfo.customer.stripeId,
    stayInfo.hotel.stripeId,
    roomCharge * 100 // in cents.
  );
  return Stay.checkOut({
    id: stayId,
    roomCharge,
    checkOutTime,
    stripeChargeId,
  });
};
