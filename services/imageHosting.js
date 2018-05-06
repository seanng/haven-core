const Storage = require('@google-cloud/storage');
const Promise = require('bluebird');
const { getConfigurationValue } = require('../config/env');

const BUCKET_NAME = 'haven-server-images';
const fs = Promise.promisifyAll(require('fs'));

const keyFilenamePath = 'GCS-key.json';
const logger = require('../logger');

const storage = Storage({
  projectId: getConfigurationValue('gcs').projectId,
  keyFilename: keyFilenamePath,
});

const getPublicUrl = filename =>
  `https://storage.googleapis.com/${BUCKET_NAME}/${filename}`;

const getInfoFromUrl = url => {
  const route = url.split('https://storage.googleapis.com/')[1];
  const bucketName = route.split('/')[0];
  const fileName = route.split(`${bucketName}/`)[1];
  return { bucketName, fileName };
};

const createFile = blob =>
  new Promise((resolve, reject) => {
    const path = `${__dirname}/temp.png`;
    const fileStream = fs.createWriteStream(path);
    fileStream.write(blob);
    fileStream.end(() => {
      fs.readFile(path, (err, data) => {
        if (err) {
          logger.error('error in fs.readFile', err);
          reject(err);
        }
        fs.unlink(path);
        resolve(data);
      });
    });
  }).catch(createFileErr => {
    logger.error('error in createFile', createFileErr);
  });

const decodeBase64Image = dataString => {
  const matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (matches.length !== 3) {
    throw new Error('Invalid input string');
  }
  return Buffer.from(matches[2], 'base64');
};

const sendUploadToGCS = (fileBuffer, prefix) =>
  new Promise((resolve, reject) => {
    const gcsname = `${prefix}/${Date.now()}`;
    const bucket = storage.bucket(BUCKET_NAME);
    const bucketFile = bucket.file(gcsname);
    const cloudStream = bucketFile.createWriteStream({
      metadata: { contentType: 'image/png' },
    });
    cloudStream.on('error', error => reject(error));
    cloudStream.on('finish', () => {
      bucketFile.makePublic().then(() => resolve(gcsname));
    });
    cloudStream.end(fileBuffer);
  });

const deletePhotoFromCloudStorage = photoUrl => {
  const { bucketName, fileName } = getInfoFromUrl(photoUrl);
  const bucket = storage.bucket(bucketName);
  return bucket.file(fileName).delete();
};

const erasePhotosArray = async photos => {
  // eslint-disable-next-line
  for (const url of photos) {
    // eslint-disable-next-line
    await deletePhotoFromCloudStorage(url);
  }
};

const getImageUrls = (oldPhotos, hotelId) =>
  Promise.map(oldPhotos, oldPhoto => {
    const containsUrl =
      typeof oldPhoto === 'string' && oldPhoto.search('http') === 0;
    if (containsUrl) {
      return oldPhoto;
    }
    return createFile(oldPhoto)
      .then(data => sendUploadToGCS(data, `hotels/profiles/${hotelId}`))
      .then(gcsname => getPublicUrl(gcsname))
      .then(photoUrl => photoUrl);
  });

module.exports = {
  createFile,
  getPublicUrl,
  sendUploadToGCS,
  erasePhotosArray,
  deletePhotoFromCloudStorage,
  decodeBase64Image,
  getImageUrls,
};
