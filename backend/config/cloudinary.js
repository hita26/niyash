let cloudinary;
try {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'pqtjp0ci',
    api_key: process.env.CLOUDINARY_API_KEY || '199431634722625',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'FaHnnSi1-fRFSFxuzgosx-td4xA',
    secure: true,
  });
} catch (e) {
  cloudinary = {
    uploader: {
      upload: async () => { throw new Error('Cloudinary package not installed'); },
      destroy: async () => {}
    }
  };
}

module.exports = cloudinary;
