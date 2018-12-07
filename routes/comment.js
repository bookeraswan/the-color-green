var express             = require("express"),
    router              = express.Router(),
    moment              =require("moment"),
    middlewear          = require("../middlewear"),
    Post                = require("../models/post"),
    Comment             = require("../models/comment");

router.get("/post/:post_id/comment/new",middlewear.isLoggedIn, function(req, res){
    Post.findById(req.params.post_id, function(err, foundPost){
       if(err || !foundPost){
           res.redirect("/users");
       }
       else{
           res.render("post/comment/new", {post: foundPost});
       }
    });
});

router.post("/post/:post_id/comment",middlewear.isLoggedIn, function(req, res){
   Post.findById(req.params.post_id, function(err, foundPost){
       if(err || !foundPost){
           console.log(err);
           res.redirect("back");
       }
       else{
           Comment.create(req.body.comment, function(err, newComment){
               if(err){
                   console.log(err);
                   res.redirect("back");
               }
               else{
                   newComment.owner.username = req.user.username;
                   newComment.owner.id = req.user._id;
                   newComment.save();
                   foundPost.comments.push(newComment);
                   foundPost.save();
                   res.redirect("/post/" + req.params.post_id + "/comments");
               }
           });
       }
   });
});

router.get("/post/:post_id/comments", function(req, res){
   Post.findById(req.params.post_id).populate("comments").exec(function(err, foundPost) {
       if(err || !foundPost){
           res.redirect("back");
       }
       else{
           res.render("post/comment/show-comments", {post: foundPost, moment: moment});
       }
   });
});


module.exports = router;
