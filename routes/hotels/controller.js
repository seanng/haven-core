const R = require('ramda');
const Promise = require('bluebird');
const logger = require('../../logger');
const { hotel, sendMail, imageHosting } = require('../../services');
const { Hotel, Employee } = require('../../db/models');

exports.getAll = () =>
  hotel.fetchAll().then(hotels => {
    const hotelsAvailabilityPromise = Promise.map(
      R.map(R.prop('id'), hotels),
      hotel.getAvailability
    );
    return hotelsAvailabilityPromise.then(hotelsAvailability => {
      const hotelsWithAvailablity = R.zipWith(
        (availableHotel, isAvailable) =>
          Object.assign(availableHotel, { isAvailable }),
        hotels,
        hotelsAvailability
      );
      return { hotels: hotelsWithAvailablity };
    });
  });

exports.getOne = req => Hotel.fetchOne({ id: req.params.id });

exports.create = req =>
  hotel
    .create(req.body.hotel, req.body.stripeCode)
    .then(hotelInfo =>
      Employee.createInitial({
        ...req.body.admin,
        adminLevel: 2,
        hotelId: hotelInfo.id,
      })
    )
    .then(employeeInfo => {
      // send email to that employee.
      const htmlOptions = {
        firstName: req.body.admin.firstName,
        password: req.body.admin.password,
        userId: employeeInfo.id,
        hotelName: req.body.hotel.name,
        email: req.body.admin.email,
      };
      sendMail({
        subject: 'this is a test email. ',
        to: 'shonum@gmail.com',
        htmlOptions,
      });
      return employeeInfo;
    })
    .catch(error => logger.error('the error', error));

exports.update = async req => {
  const { hotelInfo, shouldHandleImageBlobs } = req.body;
  if (!shouldHandleImageBlobs) {
    return Hotel.updateProfile(hotelInfo);
  }
  const photos = await imageHosting.getImageUrls(
    hotelInfo.photos,
    hotelInfo.id
  );
  return Hotel.updateProfile({ ...hotelInfo, photos });
};

exports.deletePhotos = req => imageHosting.erasePhotosArray(req.body.photos);
