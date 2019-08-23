var express             = require("express"),
    router              = express.Router(),
    moment              = require("moment"),
    middlewear          = require("../middlewear"),
    Post                = require("../models/post"),
    Comment             = require("../models/comment");

router.post("/api/post/:post_id/comment",middlewear.isLoggedIn, (req, res) => {
    req.body.text = req.sanitize(req.body.text);
    if(!req.body.text) return res.json("Error a comment needs text");
    Post.findById(req.params.post_id, (err, foundPost) => {
        if(err || !foundPost) return res.json(err);
        Comment.create(req.body, (err, newComment) => {
            if(err) return res.json(err);
            newComment.owner.username = req.user.username;
            newComment.owner.id = req.user._id;
            newComment.save();
            foundPost.comments.unshift(newComment);
            foundPost.save();
            res.json(newComment);
        });
   });
});

router.get("/post/:post_id/comments", (req, res) => {
    Post.findById(req.params.post_id).populate("comments").exec((err, foundPost) => {
        if(err || !foundPost) return res.redirect("back");
        res.render("post/comment/show-comments", {post: foundPost, moment: moment});
    });
});

module.exports = router;