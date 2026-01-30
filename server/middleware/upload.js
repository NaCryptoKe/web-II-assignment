const multer = require('multer');

// Configure Multer to use Memory Storage
// This allows the file to be accessed via req.files[].buffer
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 500, // Limit files to 500MB (adjust as needed)
    }
});

module.exports = upload;