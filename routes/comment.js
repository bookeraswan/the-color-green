var express             = require("express"),
    router              = express.Router(),
    moment              = require("moment"),
    middlewear          = require("../middlewear"),
    Post                = require("../models/post"),
    Comment             = require("../models/comment");

router.get("/post/:post_id/comments", (req, res) => {
    Post.findById(req.params.post_id, (err, post) => {
        res.render("post/comment/show-comments", {post: post})
    })
})

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
            var comment = {
                owner: newComment.owner,
                _id: newComment._id,
                text: newComment.text,
                when: "just now"
            }
            res.json(comment);
        });
   });
});

router.get("/api/post/:post_id/comments", (req, res) => {
    console.log(req.query.offset)
    Post.findById(req.params.post_id)
        .populate({
            path: "comments",
            options: {
                limit: Number(req.query.limit || 1),
                sort: { created: -1},
                skip: Number(req.query.offset || 0)
            }
        })
        .exec((err, foundPost) => {
            if(err || !foundPost) return res.json({msg: "Post not found..."});
            let comments = foundPost.comments.map(comment => {
                return {
                    _id:   comment._id,
                    owner: comment.owner,
                    text:  comment.text,
                    when: moment(comment.created).startOf('second').fromNow()
                }
            })
            res.json(comments)
        });
});

module.exports = router;