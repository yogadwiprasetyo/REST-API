const multer = require("multer");

/**
 * setup disk storage for handling file uploads
 *
 * destination: The folder to which the file has been saved
 * getFileName: The name of the file within the destination
 */

// Generate file name with timeseconds
function getFileName(req, file, cb) {
  const posExtension = file.originalname.lastIndexOf(".");
  const dateNow = Date.now();
  const extension = file.originalname.substr(posExtension);
  const fileName = `${dateNow}${extension}`;
  cb(null, fileName);
}

// Storage for handling uploads about products
const storageProducts = multer.diskStorage({
  filename: getFileName,
  destination: function (req, file, cb) {
    cb(null, "./uploads/products");
  },
});

// Storage for handling uploads about a profile
const storageProfiles = multer.diskStorage({
  filename: getFileName,
  destination: function (req, file, cb) {
    cb(null, "./uploads/profiles");
  },
});

const uploadProducts = multer({
  storage: storageProducts,
  limits: { fileSize: 1000000 },
});

const uploadProfiles = multer({
  storage: storageProfiles,
  limits: { fileSize: 2000000 },
});

module.exports = {
  uploadProducts,
  uploadProfiles,
};
