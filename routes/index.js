var express           = require("express"),
    router            = express.Router(),
    expressSanitizer  = require("express-sanitizer"),
    User              = require("../models/user"),
    Post              = require("../models/post"),
    middlewear        = require("../middlewear");


function resetFollowersAndFollowing() {
  foundUsers.forEach(function(user){
    user.followers = [];
    user.following = [];
    user.save();
  });
}

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

router.get("/users", function(req, res) {
        req.query.search = req.sanitize(req.query.search);
        if(!req.query.search || req.query.search === ""){
            return res.redirect("back");
        }
        // { username: {$regex: req.query.search, $options: "i"}},{textScore: { $meta: 'textScore' }}
        User.find({username: req.query.search}, function(err, foundUsers){
          if(err){
              console.log(err);
              res.redirect("/");
          }
          else{
              // resetFollowersAndFollowing()
              res.render("users/users", {user: foundUsers});
          }
      });
    });


// ++++++++++++++++++++++++++++++++++++++++
//              ELSE
// ++++++++++++++++++++++++++++++++++++++++
router.get("*", function(req, res) {
   res.render("index/404");
});


module.exports = router;
