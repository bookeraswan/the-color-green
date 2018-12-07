var express                 =  require("express"),
    router                  =  express.Router(),
    passport                = require("passport"),
    middlewear              = require("../middlewear"),
    User                    = require("../models/user"),
    multer              = require('multer');

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
var upload = multer({ storage: storage, fileFilter: imageFilter});

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'ddxbyvkui',
  api_key: process.env.THECOLORGREEN_CLOUDINARYAPIKEY,
  api_secret: process.env.THECOLORGREEN_CLOUDINARYAPISECRET
});


router.get("/login", function(req, res) {
   res.render("auth/login");
});


router.post("/login", passport.authenticate("local",{
    successRedirect: "/loginresponse",
    failureRedirect: "/login"
}),function(req, res){
});


router.get("/loginresponse",middlewear.isLoggedIn, function(req, res) {
    res.redirect("/user/" + req.user._id);
});


router.get("/signup", function(req, res) {
   res.render("auth/signup");
});

router.post("/signup", upload.single('image'), function(req, res){

    cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
        if(err){
            console.log(err);
            res.redirect("back");
        }

  req.body.newuser.image = result.secure_url;
  req.body.newuser.imageId = result.public_id;

   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.redirect("back");
      }
      else{
            User.findByIdAndUpdate(user._id, req.body.newuser, function(err, newUser){
                if(err){
                    console.log(err);
                    res.redirect("/login");
                }
                else{
                    passport.authenticate("local")(req, res, function(){
                    res.redirect("/user/" + user._id);
            });
                }
            });
      }
    });
    });
  });


router.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/");
});

module.exports = router;
