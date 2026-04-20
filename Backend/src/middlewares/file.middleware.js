const multer = require("multer"); // multer install krenge taaki pdf ko read kr ske
// aur pdf kr andar ke data ko read krne ke liye pdf-parse install krenge

//upload middleware bnaye
const upload = multer({
    storage: multer.memoryStorage(), // temporary store krenge file ko
    limits:{
        fileSize: 3*1024*1024 // 3mb
    }
})

module.exports = upload;