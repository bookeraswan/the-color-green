var express             = require("express"),
    router              = express.Router(),
    middlewear          = require("../middlewear"),
    User                = require("../models/user"),
    Post                = require("../models/post");




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
    

router.get("/user/:id/post/new",middlewear.checkProfileOwnership, function(req, res) {
   User.findById(req.params.id, function(err, foundUser){
      if(err || !foundUser){
          res.redirect("/");
      } 
      else{
          res.render("post/newpost", {user: foundUser}); 
      }
   });
});

router.post("/user/:id/post",middlewear.checkProfileOwnership, function(req, res){
   User.findById(req.params.id, function(err, foundUser) {
       if(err || !foundUser){
           res.redirect("back");
       }
       else{
           Post.create(req.body.post, function(err, post){
               if(err){
                   res.redirect("/");
               }
               else{
                   post.owner.username = req.user.username;
                   post.save();
                   foundUser.posts.push(post); 
                   foundUser.save();
                   res.redirect("/user/" + req.params.id);
               }
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



module.exports = router;