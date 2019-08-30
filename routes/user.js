var express             = require("express"),
    router              = express.Router(),
    User                = require("../models/user"),
    Post                = require("../models/post"),
    Comment             = require("../models/comment"),
    middlewear          = require("../middlewear"),
    deleteFns           = require("../helpers/delete"),
    upload              = require("../middlewear/upload");

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};


router.get("/user/:id/edit",middlewear.checkProfileOwnership, (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err || !foundUser) return res.redirect("back");
        res.render("user/edit-profile", {user: foundUser});
    })
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
        if(err || !foundUser) res.redirect("back");
        else res.render("user/followers", {user: foundUser});
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
           res.json("server error")
       }
       else{
            if(foundUser.followers.indexOf(req.user._id) === -1){
                foundUser.followers.push(req.user._id);
                foundUser.markModified('followers')
                foundUser.save();
                req.user.following.push(foundUser._id);
                req.user.markModified('following')
                req.user.save();
                res.json(true);
            }
            else{
                res.json("you are already following this person");
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
                foundUser.markModified('followers')
                foundUser.save();
                User.findById(req.user._id, function(err, myaccount) {
                    if(err) res.json("server error");
                    else{
                        myaccount.following.splice(me, 1);
                        myaccount.markModified('following')
                        myaccount.save();
                    }
                });
                res.json(true);
            }
            else{
                console.log(me);
                console.log(account);
                res.json("you are already following this person");
            }
       }
    });
});

router.route("/user/:id")
    .get((req, res) => {
        User.findById(req.params.id).populate("posts")
            .exec((err, foundUser) => {
                if(err || !foundUser) return res.redirect("/");
                res.render("user/profile", {user: foundUser});
            })
    })
    .put(middlewear.checkProfileOwnership, upload.file.single("image"), function(req, res) {
        req.body.user.bio = req.sanitize(req.body.user.bio);
        req.body.user.email = req.sanitize(req.body.user.email);
        User.findById(req.params.id, async function(err, foundUser){
                if(err || !foundUser) return res.redirect("back");
                if(req.file){
                    try{
                        if(foundUser.imageId){
                            await upload.cloudinary().v2.uploader.destroy(foundUser.imageId);
                        }
                        let result = await upload.cloudinary().v2.uploader.upload(req.file.path);

                        var fullSizeImage = result.secure_url;
                        var image = result.secure_url.splice(result.secure_url.indexOf("upload/")+7,0,"w_500/");
                        var profileIconImage = result.secure_url.splice(result.secure_url.indexOf("upload/")+7,0,"w_100/");
                        foundUser.imageId = result.public_id;
                        foundUser.fullSizeImage = fullSizeImage;
                        foundUser.image = image;
                        foundUser.profileIconImage = profileIconImage;
                    }catch(err){
                        return res.redirect("back");
                    }
                }
                foundUser.email = req.body.user.email;
                foundUser.bio = req.body.user.bio;
                foundUser.save();
                res.redirect("/user/" + req.params.id);
        })
    })
    .delete(middlewear.checkProfileOwnership, function(req, res){
        User.findById(req.params.id).populate("posts").exec( async function(err, foundUser) {
            if(err || !foundUser) return res.redirect("back");

            try{
                if(foundUser.imageId) await upload.cloudinary().v2.uploader.destroy(foundUser.imageId);
            }
            catch(err){
                    return res.redirect("back");
            }



            await foundUser.posts.forEach(deleteFns.post);

    // NOTE: this code is not working. Hack is on line 67. To fix go to /helpers/delete.js line 40
            /* 
                await foundUser.followers.forEach( follower => {
                    deleteFns.removeFollowers(follower, foundUser)
                });
            */   
    // NOTE: this code is not working. Hack is on line 86. To fix go to /helpers/delete.js line 55           
            /*
                await foundUser.following.forEach(people => {
                    deleteFns.removeFollowing(people, foundUser)
                });
            */

            User.findByIdAndRemove(foundUser._id, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("removed User!!!");
                    res.redirect("/signup");
                }
            });
        });
    });


module.exports = router;