var express             = require("express"),
    router              = express.Router(),
    expressSanitizer    = require("express-sanitizer"),
    moment              = require("moment"),
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

router.post("/api/post/:post_id/comment",middlewear.isLoggedIn, function(req, res){
    if(!req.body.text || req.body.text === ""){
        return res.json("a comment needs text");
    }
   req.body.text = req.sanitize(req.body.text);
   Post.findById(req.params.post_id, function(err, foundPost){
       if(err || !foundPost){
           console.log(err);
           res.json(err);
       }
       else{
           Comment.create(req.body, function(err, newComment){
               if(err){
                   console.log(err);
                   res.redirect("back");
               }
               else{
                   newComment.owner.username = req.user.username;
                   newComment.owner.id = req.user._id;
                   newComment.save();
                   foundPost.comments.unshift(newComment);
                   foundPost.save();
                   res.json(newComment);
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
