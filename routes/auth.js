var express                 =  require("express"),
    router                  =  express.Router(),
    passport                = require("passport"),
    expressSanitizer        = require("express-sanitizer"),
    middlewear              = require("../middlewear"),
    User                    = require("../models/user"),
    multer                  = require('multer');

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

router.post("/login", middlewear.sanitizeLogin, passport.authenticate("local",{
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

router.post("/api/checkusername", function(req, res){
    User.find({username: req.body.username}, function(err, found){
        if(err){
            res.json(err);
        }
        else if(found.length > 0){
            res.json(false);
        }
        else{
            res.json(true);
        }
    })
});

router.post("/api/signup",// upload.single('image'),
 function(req, res){
    req.body.username = req.sanitize(req.body.username);
    req.body.password = req.sanitize(req.body.password);
    if(req.body.username.length < 3){
        return res.json({error: "username must be longer than two characters"});
    }
    if(req.body.password.length < 8){
        return res.json({error: "password must be longer than eight characters"});
    }

    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.json({error: err.message});
        }
        else{
            passport.authenticate("local")(req, res, function(){
                res.json({id: user._id});
            });
        }
    });
  });


router.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/");
});

module.exports = router;
