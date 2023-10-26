const multer = require('multer');
const uuid = require("uuid");
const imageId = uuid.v4();

const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "public/img");
    },
    filename: (req, file, callback) => {
        const ext = file.mimetype.split("/")[1];
        callback(null, `profile-picture-${imageId}-${Date.now()}.${ext}`);
      },
    });

    const multerFilter = (req, file, callback) => {
        if (file.mimetype.startsWith("image")) {
          callback(null, true);
        } else {
          callback(new Error("file type not supported"), false);
        }
      };

      const upload = multer({
        storage: multerStorage,
        fileFilter: multerFilter,
      });

const uploadPicture = upload.single('image')
module.exports = { uploadPicture }