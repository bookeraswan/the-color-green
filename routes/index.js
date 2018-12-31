var express           = require("express"),
    router            = express.Router(),
    expressSanitizer  = require("express-sanitizer"),
    User              = require("../models/user"),
    Post              = require("../models/post"),
    middlewear        = require("../middlewear");


router.get("/", async function(req, res){
    if(!req.user){
        res.render("index/home");
    }
    else{
      if(!req.user.following[0]){
        return res.render("user/feed", {posts: []});
      }
      var followingArr = req.user.following.reduce(function(acc, val) {
        var obj = {
          "owner.id": val.toString()
        };
        acc.push(obj);
        return acc;
      }, []);

              Post.find({$or: followingArr}).sort({"created": -1}).exec(function(err, recentPosts){
                  if(err || !recentPosts){
                      console.log(err + " PERSON NOT FOUND");
                  }
                  else{
                    recentPosts = recentPosts.splice(0, 10);
                    res.render("user/feed", {posts: recentPosts});
                  }
              });
    }
});

router.get("/featured", function(req, res){
   res.render("index/featured", {featured: data});
});

router.get("/users", function(req, res) {
        req.query.search = req.sanitize(req.query.search);
        if(req.query.search === "" || !req.query.search){
            return res.redirect("back");
        }
        User.find({ username: {$regex: req.query.search, $options: "i"}},{textScore: { $meta: 'textScore' }}, function(err, foundUsers){
          if(err){
              console.log(err);
              res.redirect("/login");
          }
          else{

              // RESET FOLLOWERS AND FOLLOWING ON ALL USERS

              // foundUsers.forEach(function(user){
              //     user.followers = [];
              //     user.following = [];
              //     user.save();
              // });
              var s = foundUsers.sort({username: req.query.search});

              res.render("users/users", {user: s});
          }
      });
    });

// ++++++++++++++++++++++++++++++++++++++++
//              ELSE
// ++++++++++++++++++++++++++++++++++++++++
router.get("*", function(req, res) {
   res.redirect("/users");
});


module.exports = router;
