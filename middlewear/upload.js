const multer              = require('multer');

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'ddxbyvkui',
    api_key: process.env.THECOLORGREEN_CLOUDINARYAPIKEY,
    api_secret: process.env.THECOLORGREEN_CLOUDINARYAPISECRET
});

exports.cloudinary = function(){
    return cloudinary;
}

exports.file =  multer({ storage: storage, fileFilter: imageFilter});