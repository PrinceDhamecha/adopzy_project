const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

let upload;
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'pet_adoption',
      allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
      transformation: [{ width: 800, height: 600, crop: 'limit' }],
      public_id: () => Date.now() + '-' + Math.round(Math.random() * 1E9)
    }
  });
  upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });
} else {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });
}

module.exports = upload;
