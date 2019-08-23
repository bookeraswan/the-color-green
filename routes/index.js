var express           = require("express"),
    router            = express.Router(),
    User              = require("../models/user"),
    Post              = require("../models/post");

router.get("/", async function(req, res){
    if(!req.user) return res.render("index/landing");
    if(!req.user.following[0]) return res.render("user/feed", {posts: []});

    var followingArr = req.user.following.reduce(function(acc, val) {
      acc.push({"owner.id": val.toString()});
      return acc;
    }, []);

    Post.find({$or: followingArr}).sort({"created": -1}).exec(function(err, recentPosts){
        if(err || !recentPosts) return res.render("user/feed", {posts: []});
        recentPosts = recentPosts.splice(0, 10);
        res.render("user/feed", {posts: recentPosts});
    });
});

router.get("/users", function(req, res) {
        var query = req.sanitize(req.query.search);
        if(!query) return res.redirect("back");
        // { username: {$regex: query, $options: "i"}},{textScore: { $meta: 'textScore' }}
        User.find({username: query}, (err, foundUsers) => {
          if(err) return res.redirect("/");
          res.render("users/users", {user: foundUsers});
      });
    });

router.get("*", (req, res) => res.render("index/404"));

module.exports = router;