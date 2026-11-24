let cloudinary;
try {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
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
