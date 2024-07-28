const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with proper credentials
cloudinary.config({
    cloud_name: "dyefcclcz", // Use your actual Cloudinary cloud name
    api_key: "867454216412617", // Use your actual Cloudinary API key
    api_secret: "7ZOu5Hd3AahDrih1jioNYFst0xk", // Use your actual Cloudinary API secret
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats: ["png", "jpg", "jpeg"], // Corrected typo
    },
});

module.exports = {
    cloudinary,
    storage
};
