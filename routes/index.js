var express           = require("express"),
    router            = express.Router(),
    User              = require("../models/user"),
    Post              = require("../models/post");

router.get("/", async function(req, res){
    if(!req.user) return res.render("index/landing");
    if(!req.user.following[0]) return res.render("user/feed", {posts: []});
    console.log(req.query)
    getFeedItems(req.user, Number(req.query.offset) || 0, Number(req.query.limit) || 10, (err, posts) => {
        console.log(posts)
        if(err || !posts) res.render("user/feed", {posts: []});
        else if(req.query.json) res.json(posts)
        else res.render("user/feed", {posts: posts});
    })
});

function getFeedItems(user, offset, limit, cb){
  let followingArr = user.following.reduce(function(acc, val) {
    acc.push({"owner.id": val.toString()});
    return acc;
  }, []);
  console.log(`offset: ${offset} limit: ${limit}`)
  Post.find({$or: followingArr})
        .sort({"created": -1})
        .skip(offset)
        .limit(limit)
        .exec(cb);
}

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