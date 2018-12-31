var User = require("../models/user"),
    Post = require("../models/post");

var middlewear = {};


middlewear.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

middlewear.sanitizeLogin = function(req, res, next){
  req.body.username = req.sanitize(req.body.username);
  req.body.password = req.sanitize(req.body.password);
  next();
}

middlewear.checkPostOwnership = function (req, res, next) {
    if(req.isAuthenticated()){
         Post.findById(req.params.post_id, function(err, foundPost){
        if(err || !foundPost){
           res.redirect("back");
        }
        else{

           if(foundPost.owner.id.equals(req.user._id)){
               next();
           }

           else{
               res.redirect("back");
           }
       }
       });
    }
    else{
        res.redirect("back");
    }
};

middlewear.checkProfileOwnership = function (req, res, next) {
    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundProfile){
        if(err || !foundProfile){
           res.redirect("back");
        }
        else{

           if(foundProfile._id.equals(req.user._id)){
               next();
           }

           else{
               res.redirect("back");
           }
       }
       });
    }
    else{
        res.redirect("back");
    }
};


module.exports = middlewear;
