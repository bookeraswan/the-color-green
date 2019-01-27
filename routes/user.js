var express             = require("express"),
    router              = express.Router(),
    expressSanitizer    = require("express-sanitizer"),
    User                = require("../models/user"),
    Post                = require("../models/post"),
    Comment             = require("../models/comment"),
    middlewear          = require("../middlewear"),
    cloudinary          = require("cloudinary"),
    multer              = require("multer");

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

cloudinary.config({
  cloud_name: 'ddxbyvkui',
  api_key: process.env.THECOLORGREEN_CLOUDINARYAPIKEY,
  api_secret: process.env.THECOLORGREEN_CLOUDINARYAPISECRET
});





router.get("/user/:id", function(req, res) {
    User.findById(req.params.id).populate("posts").exec(function(err, foundUser){
        if(err || !foundUser){
            console.log(err + " err Lorem");
            console.log(foundUser + " foundUser");
            res.redirect("/");
        }
        else{
            res.render("user/profile", {user: foundUser});
        }
    });
});

router.get("/user/:id/edit",middlewear.checkProfileOwnership, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if(err || !foundUser){
            res.redirect("back");
        }
        else{
            res.render("user/edit-profile", {user: foundUser});
        }
    });
});

router.post("/api/image", function(req, res){
    console.log(req.body);
});

router.put("/user/:id",middlewear.checkProfileOwnership, upload.single("image"), function(req, res) {
  req.body.user.bio = req.sanitize(req.body.user.bio);
  req.body.user.email = req.sanitize(req.body.user.email);
  User.findById(req.params.id, async function(err, foundUser){
      if(err || !foundUser){
          res.redirect("back");
      }
      else{
            if(req.file){
                try{
                    if(foundUser.imageId){
                        await cloudinary.v2.uploader.destroy(foundUser.imageId);
                    }
                    let result = await cloudinary.v2.uploader.upload(req.file.path);

                    foundUser.imageId = result.public_id;
                    foundUser.image = result.secure_url;
                }catch(err){
                    console.log(err);
                    return res.redirect("back");
                }
            }


            foundUser.email = req.body.user.email;
            foundUser.bio = req.body.user.bio;
            foundUser.save();
          res.redirect("/user/" + req.params.id);

      }
  });
});

router.get("/user/:id/delete_account",middlewear.checkProfileOwnership, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
       if(err || !foundUser){
           res.redirect("back");
       }
       else{
           res.render("user/delete-account", {user: foundUser});
       }
    });
});


router.get("/user/:id/followers", function(req, res){
    User.findById(req.params.id).populate("followers").exec(function(err, foundUser) {
        if(err || !foundUser){
            res.redirect("back");
        }
        else{
            res.render("user/followers", {user: foundUser});
        }
    });
});

router.get("/user/:id/following", function(req, res){
    User.findById(req.params.id).populate("following").exec(function(err, foundUser) {
        if(err || !foundUser){
            res.redirect("back");
        }
        else{
            res.render("user/following", {user: foundUser});
        }
    });
});


router.post("/user/:id/follow",middlewear.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser) {
       if(err || !foundUser || foundUser._id.equals(req.user._id)){
           res.redirect("back");
       }
       else{
            if(foundUser.followers.indexOf(req.user._id) === -1){
                foundUser.followers.push(req.user._id);
                foundUser.save();
                req.user.following.push(foundUser._id);
                req.user.save();
                res.redirect("back");
            }
            else{
                res.redirect("/");
            }
       }
    });
});

router.post("/user/:id/unfollow",middlewear.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser) {
       if(err || !foundUser){
           res.redirect("back");
       }
       else{
            var account = foundUser.followers.indexOf(req.user._id);
            var me = req.user.following.indexOf(foundUser._id);
            if(account > -1  && me > -1){
                foundUser.followers.splice(account, 1);
                foundUser.save();
                User.findById(req.user._id, function(err, myaccount) {
                    if(err){

                    }
                    else{
                        myaccount.following.splice(me, 1);
                        myaccount.save();
                    }
                });
                res.redirect("back");
            }
            else{
                console.log(me);
                console.log(account);
                res.redirect("/users");
            }
       }
    });
});


router.delete("/user/:id",middlewear.checkProfileOwnership, function(req, res){
    User.findById(req.params.id).populate("posts").exec( async function(err, foundUser) {
      if(err || !foundUser){
          console.log(err);
          res.redirect("back");
      }
      else{

            try{
                if(foundUser.imageId){
                    await cloudinary.v2.uploader.destroy(foundUser.imageId);
                }
            }
            catch(err){
                    console.log(err);
                    return res.redirect("back");
            }


          foundUser.posts.forEach(function(post){
              Post.findById(post._id).populate("comments").exec( async function(err, foundPost) {
                  if(err || !foundPost){

                  }
                  else{

                    if(foundPost.imageId){
                        await cloudinary.v2.uploader.destroy(foundPost.imageId, function(err){
                            console.log(err);
                        });
                    }
                    post.comments.forEach(function(comment){
                        Comment.findByIdAndRemove(comment._id, function(err){
                            if(err){
                                console.log(err);
                                console.log("comment remove ERROR");
                            }
                            else{
                                console.log("comment removed");
                            }
                        });
                    });
                    Post.findByIdAndRemove(post._id, function(err){
                      if(err){
                            console.log(err);
                            console.log("post remove ERROR");
                      }
                      else{
                          console.log("post removed");
                          console.log("________________________________________");
                      }
                    });
                  }
              });
          });



        foundUser.followers.forEach(function(follower){
                User.findById(follower, function(err, foundfollower){
                  if(err){
                      console.log(err);
                      console.log("remove follower ERROR");
                  }
                  else{
                      var index = foundfollower.following.indexOf(foundUser._id);
                      console.log("following Before " + foundfollower.username);
                      console.log("following Before " + "followers: " + foundfollower.followers + " following: " + foundfollower.following);
                      console.log("follower array index:" + index);
                      if(index > -1){
                            foundfollower.following.splice(index, 1);
                            foundfollower.save();
                            console.log("removed follower");
                      }
                      console.log("following After " + foundfollower.username);
                      console.log("following After " + "followers: " + foundfollower.followers + " following: " + foundfollower.following);
                  }
              });
          });


          foundUser.following.forEach(function(following){
                User.findById(following, function(err, foundperson){
                  if(err || !foundperson){
                      console.log(err);
                      console.log("remove person ERROR");
                  }
                  else{
                      var index = foundperson.followers.indexOf(foundUser._id);
                      console.log("following Before " + foundperson.username);
                      console.log("following Before " + "followers: " + foundperson.followers + " following: " + foundperson.following);
                      console.log("following array index: " + index);
                      if(index > -1){
                            foundperson.followers.splice(index, 1);
                            foundperson.save();
                            console.log("removed person");
                      }
                      console.log("following After " + foundperson.username);
                      console.log("following After " + "followers: " + foundperson.followers + " following: " + foundperson.following);
                  }
              });
          });

          User.findByIdAndRemove(foundUser._id, function(err){
              if(err){
                  console.log(err);
              }
              else{
                  console.log("removed User!!!");
                  res.redirect("/signup");
              }
          });
        }
    });
});


module.exports = router;
