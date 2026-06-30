const multer = require("multer");

// 1. Storage setup (where + how file is saved)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // folder where files go
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // unique name
    }
});

// 2. Create multer instance
const upload = multer({ storage });

// 3. Export it
module.exports = upload;