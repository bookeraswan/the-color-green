var express             = require("express"),
    router              = express.Router(),
    middlewear          = require("../middlewear"),
    User                = require("../models/user"),
    Post                = require("../models/post"),
    upload              = require("../middlewear/upload");

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

router.get("/user/:id/post/new", middlewear.checkProfileOwnership, function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
            if(err || !foundUser) return res.redirect("/");
            res.render("post/newpost", {user: foundUser});
    });
});

router.post("/user/:id/post", middlewear.checkProfileOwnership, upload.file.single('image'), (req, res) => {
    req.body.post.text = req.sanitize(req.body.post.text);
    if(!req.body.post.text && !req.file) return res.redirect("back");
    User.findById(req.params.id, (err, foundUser) => {
        if(err || !foundUser) return res.redirect("back");
        if(req.file){
            upload.cloudinary().v2.uploader.upload(req.file.path, (err, result) => {
                if(err) return res.redirect("back");
                var resizedImage = result.secure_url.splice(result.secure_url.indexOf("upload/")+7,0,"w_1000/");
                req.body.post.image = resizedImage;
                req.body.post.imageId = result.public_id;
                post(req, res, foundUser)
            });
        }else{
            post(req, res, foundUser)
        }
    });
});

function post(req, res, foundUser){
    Post.create(req.body.post, (err, post) => {
        if(err) return res.redirect("back");
        post.owner.username = req.user.username;
        post.owner.id = req.user._id;
        post.save();
        foundUser.posts.unshift(post);
        foundUser.save();
        res.redirect("back");
    });
}

router.get("/post/:post_id/edit", middlewear.checkPostOwnership, (req, res) => {
    Post.findById(req.params.post_id, function(err, foundPost) {
        if(err || !foundPost) return res.redirect("back");
        res.render('post/edit-post', {post : foundPost});
    });
});

router.get("/post/:post_id/delete_post", middlewear.checkPostOwnership, (req, res) => {
    res.render("post/delete-post", {post_id : req.params.post_id});
 });

router.route("/post/:post_id")
    .get((req, res) => {
        Post.findById(req.params.post_id, (err, foundPost) => {
            if(err || !foundPost) return res.redirect("/users");
            res.render("post/show-post", {post: foundPost});
        });
    })
    .put(middlewear.checkPostOwnership, function(req, res){
        req.body.post.text = req.sanitize(req.body.post.text);
        Post.findByIdAndUpdate(req.params.post_id, req.body.post, function(err, updatedPost){
            if(err || !updatedPost) return res.redirect("/");
            res.redirect("/user/" + updatedPost.owner.id);
        });
    })
    .delete(middlewear.checkPostOwnership, (req, res) =>{
        Post.findById(req.params.post_id, async function(err, foundPost){
            if(err || !foundPost)  return res.redirect("back");
            if(foundPost.imageId){
                await upload.cloudinary().v2.uploader.destroy(foundPost.imageId,(err) =>{
                    if(err) console.log(err);
                });
            }
            foundPost.remove();
            res.redirect("/");
        });
    });

module.exports = router;