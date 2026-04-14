const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: _.get(config, 'cloudinary.cloudName', process.env.CLOUDINARY_CLOUD_NAME || ''),
  api_key: _.get(config, 'cloudinary.apiKey', process.env.CLOUDINARY_API_KEY || ''),
  api_secret: _.get(config, 'cloudinary.apiSecret', process.env.CLOUDINARY_API_SECRET || ''),
});

/**
 * Upload a base64 image or URL to Cloudinary
 * @param {string} image - base64 string or URL
 * @param {string} folder - folder name on Cloudinary
 */
const uploadImage = async (image, folder = 'bdshy') => {
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder,
      resource_type: 'image',
    });
    return { success: true, url: result.secure_url, publicId: result.public_id };
  } catch (err) {
    logger.logError('Cloudinary upload error:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Delete an image from Cloudinary by publicId
 */
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (err) {
    logger.logError('Cloudinary delete error:', err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Upload multiple images
 */
const uploadImages = async (images, folder = 'bdshy') => {
  const results = await Promise.all(images.map((img) => uploadImage(img, folder)));
  return results;
};

module.exports = {
  uploadImage,
  deleteImage,
  uploadImages,
};
