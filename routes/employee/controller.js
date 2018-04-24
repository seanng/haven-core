const { Employee } = require('../../db/models');
const {
  deletePhotoFromCloudStorage,
  createFile,
  sendUploadToGCS,
  getPublicUrl,
} = require('../../services/imageHosting');
const { generatePassword } = require('../../utils/helpers');
const { sendMail } = require('../../services');

exports.getHotelEmployees = req =>
  Employee.fetchAll({ hotelId: req.params.hotelId });

exports.updateEmployee = req =>
  Employee.update(req.body, {
    where: { id: req.params.id },
    returning: true,
    plain: true,
    raw: true,
  }).then(data => data[1]);

exports.addEmployee = async req => {
  const newUserDetails = {
    ...req.body.details,
    password: generatePassword(),
    inviterId: req.body.userId,
    hotelId: req.body.hotelId,
  };
  const userInfo = await Employee.create(req.body);
  const htmlOptions = {
    firstName: userInfo.firstName,
    password: newUserDetails.password,
    userId: userInfo.id,
    hotelName: userInfo['hotel.name'],
    email: userInfo.email,
  };
  sendMail({
    to: userInfo.email,
    htmlOptions,
  });
  const employees = await Employee.fetchAll({
    hotelId: newUserDetails.hotelId,
  });
  return employees;
};

exports.deleteEmployee = req => Employee.delete({ id: req.params.id });

exports.deletePhoto = req => deletePhotoFromCloudStorage(req.body.photo);

exports.createPhoto = async req => {
  const data = await createFile(req.body.photoUrl);
  const gcsname = await sendUploadToGCS(
    data,
    `employees/profiles/${req.params.id}`
  );
  return getPublicUrl(gcsname);
};
