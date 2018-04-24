const { Customer } = require('../../db/models');
const { signToken } = require('../../db/helpers');
const {
  deletePhotoFromCloudStorage,
  decodeBase64Image,
  createFile,
  sendUploadToGCS,
  getPublicUrl,
} = require('../../services/imageHosting');

exports.createNewCustomer = async req => {
  const customer = await Customer.create({ ...req.body });
  return { data: { token: signToken(customer.Id), user: customer } };
};

exports.deletePhoto = req => deletePhotoFromCloudStorage(req.body.photo);

exports.update = async req => {
  const { shouldHandleBase64, profile } = req.body;
  if (!shouldHandleBase64) {
    return Customer.updateProfile(profile);
  }
  const blob = await decodeBase64Image(profile.avatarUrl);
  const data = await createFile(blob);
  const gcsname = await sendUploadToGCS(
    data,
    `customers/profiles/${profile.id}`
  );
  const avatarUrl = await getPublicUrl(gcsname);
  return Customer.updateProfile({ ...profile, avatarUrl });
};
