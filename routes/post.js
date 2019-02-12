var express             = require("express"),
    router              = express.Router(),
    path                = require('path'),
    expressSanitizer    = require("express-sanitizer"),
    middlewear          = require("../middlewear"),
    User                = require("../models/user"),
    Post                = require("../models/post"),
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

router.get("/post/:post_id", function(req, res) {
    Post.findById(req.params.post_id).populate("comments").exec(function(err, foundPost) {
        if(err || !foundPost){
            res.redirect("/users");
        }
        else{
            res.render("post/show-post", {post: foundPost});
        }
    });
});

router.get("/user/:id/post/new", middlewear.checkProfileOwnership, function(req, res) {
   User.findById(req.params.id, function(err, foundUser){
      if(err || !foundUser){
          res.redirect("/");
      }
      else{
          res.render("post/newpost", {user: foundUser});
      }
   });
});

router.post("/user/:id/post", middlewear.checkProfileOwnership, upload.single('image'), function(req, res){
  req.body.post.text = req.sanitize(req.body.post.text);
  if(!req.body.post.text || !req.body.post.text === "" || !req.file){
    return res.redirect("back");
  }
   User.findById(req.params.id, function(err, foundUser) {
       if(err || !foundUser){
        res.redirect("back");
       }
       else{
            cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
                if(err){
                    console.log(err);
                    return res.redirect("back");
                }

                req.body.post.image = result.secure_url;
                req.body.post.imageId = result.public_id;

           Post.create(req.body.post, function(err, post){
               if(err){
                res.redirect("back");
               }
               else{
                   post.owner.username = req.user.username;
                   post.owner.id = req.user._id;
                   post.save();
                   foundUser.posts.unshift(post);
                   foundUser.save();
                   res.redirect("back");
               }
           });
           });
       }
  });
});

router.get("/user/:id/post/:post_id", function(req, res) {
    User.findById(req.params.id , function(err, foundUser) {
        if(err || !foundUser){
            res.redirect("/users");
        }
        else{
            Post.findById(req.params.post_id).populate("comments").exec(function(err, foundPost) {
                if(err || !foundPost){
                    res.redirect("/users");
                }
                else{
                res.render("post/show-post", {post: foundPost});
                }
            });
        }
    });
});

router.get("/post/:post_id/edit", middlewear.checkPostOwnership, function(req, res) {
    Post.findById(req.params.post_id, function(err, foundPost) {
        if(err || !foundPost){
            res.redirect("back");
        }
        else{
            res.render('post/edit-post', {post : foundPost});
        }
    });
});

router.put("/post/:post_id", middlewear.checkPostOwnership, function(req, res){
    req.body.post.text = req.sanitize(req.body.post.text);
    Post.findByIdAndUpdate(req.params.post_id, req.body.post, function(err, updatedPost){
       if(err || !updatedPost){
           res.redirect("/");
       }
       else{
           res.redirect("/user/" + updatedPost.owner.id);
       }
    });
});

router.get("/post/:post_id/delete_post", middlewear.checkPostOwnership, function(req, res) {
   res.render("post/delete-post", {post_id : req.params.post_id});
});

router.delete("/post/:post_id", function(req, res){
    Post.findById(req.params.post_id, async function(err, foundPost){
        if(err || !foundPost){
            console.log(err);
            return res.redirect("back");
        }
        console.log("way before " + foundPost.imageId);
        if(foundPost.imageId){
            console.log("before " + foundPost.imageId);
            await cloudinary.v2.uploader.destroy(foundPost.imageId, function(err){
                if(err){
                    console.log(err);
                }
            });
            console.log("after");
        }
        console.log(foundPost + "+++");
        foundPost.remove();
        console.log(foundPost + "---");
        res.redirect("/");
    });
});



module.exports = router;
