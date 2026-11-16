const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'pqtjp0ci',
  api_key: process.env.CLOUDINARY_API_KEY || '199431634722625',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'FaHnnSi1-fRFSFxuzgosx-td4xA',
  secure: true,
});

module.exports = cloudinary;
