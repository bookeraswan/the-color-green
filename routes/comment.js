var express             = require("express"),
    router              = express.Router(),
    moment              = require("moment"),
    middlewear          = require("../middlewear"),
    Post                = require("../models/post"),
    Reply               = require("../models/reply"),
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
                repliesLen: newComment.replies.length || 0,
                when: "just now"
            }
            res.json(comment);
        });
   });
});

router.post("/api/comment/:comment_id/reply",middlewear.isLoggedIn, (req, res) => {
    req.body.text = req.sanitize(req.body.text);
    console.log(req.body)
    if(!req.body.text) return res.json({msg: "Error a comment needs text"});
    Comment.findById(req.params.comment_id, (err, comment) => {
        if(err || !comment) return res.json(err);
        console.log(comment)
        Reply.create(req.body, (err, newReply) => {
        console.log(newReply)
        newReply.owner.username = req.user.username
            newReply.owner.id = req.user._id
            newReply.save()
            comment.replies.push(newReply)
            comment.save()
            let reply = {
                _id:   newReply._id,
                owner: newReply.owner,
                text:  newReply.text,
                when: "just now"
            }
            res.json(reply)
        })
    })
})

router.get("/api/post/:post_id/comments", (req, res) => {
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
                    repliesLen: comment.replies.length || 0,
                    when: moment(comment.created).startOf('second').fromNow()
                }
            })
            res.json(comments)
        });
});

router.get("/comment/:comment_id/replies", (req, res) => {
    Comment.findById(req.params.comment_id).populate("replies").exec((err, comment) => {
        if(err || !comment) return res.render("index/404")
        comment.when = moment(comment.created).startOf('second').fromNow()
        res.render("post/comment/comment-replies", {comment: comment})
    })
})

// /api/comment/:comment_id/replies

router.get("/api/comment/:comment_id/replies", (req, res) => {
    Comment.findById(req.params.comment_id)
        .populate({
            path: "replies",
            options: {
                limit: Number(req.query.limit || 1),
                sort: { created: -1},
                skip: Number(req.query.offset || 0)
            }
        })
        .exec((err, foundComment) => {
            if(err || !foundComment) return res.json({msg: "Comment not found..."});
            let replies = foundComment.replies.map(reply => {
                return {
                    _id:   reply._id,
                    owner: reply.owner,
                    text:  reply.text,
                    when: moment(reply.created).startOf('second').fromNow()
                }
            })
            res.json(replies)
        });
});

module.exports = router;