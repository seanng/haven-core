const { Hotel } = require('../schema');

Hotel.updateProfile = hotelInfo =>
  Hotel.update(hotelInfo, {
    where: { id: hotelInfo.id },
    returning: true,
    plain: true,
    raw: true,
  }).then(data => data[1]);

Hotel.fetchOne = params => Hotel.findOne({ where: params });

module.exports = Hotel;
