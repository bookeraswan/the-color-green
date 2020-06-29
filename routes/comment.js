var express             = require("express"),
    router              = express.Router(),
    moment              = require("moment"),
    middlewear          = require("../middlewear"),
    Post                = require("../models/post"),
    Reply               = require("../models/reply"),
    Comment             = require("../models/comment");


// Post.find({})
// .populate("comments")
// .exec((err, posts) => {
//     posts.forEach(post => {
//         post.comments.forEach(comment => {
//             comment.parent = post._id
//             comment.replies.forEach(replyId => {
//                 Reply.findById(replyId, (e, r) => {
//                     r.parent.post = post._id
//                     r.parent.comment = comment._id
//                     r.save()
//                 })
//             })
//             comment.save()
//         })
//     })
// })

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
            newComment.parent = foundPost._id
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
            newReply.parent.post = comment.parent
            newReply.parent.comment = comment._id
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

router.get("/comment/:comment_id/edit", middlewear.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) =>{
        if(err || !comment) return res.render("index/404")
        res.render("post/comment/edit-comment", {comment: comment, commentType: "comment"})
    })
})

router.put("/comment/:comment_id/update", middlewear.checkCommentOwnership, (req, res) => {
    req.body.comment.text = req.sanitize(req.body.comment.text);
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, doc) => {
        if(err || !doc) return res.redirect("back")
        res.redirect(`/comment/${req.params.comment_id}/replies`)
    })
})

router.get("/reply/:reply_id/edit", middlewear.checkReplyOwnership, (req, res) => {
    Reply.findById(req.params.reply_id, (err, reply) =>{
        if(err || !reply) return res.render("index/404")
        res.render("post/comment/edit-comment", {comment: reply, commentType: "reply"})
    })
})

router.put("/reply/:reply_id/update", middlewear.checkReplyOwnership, (req, res) => {
    req.body.comment.text = req.sanitize(req.body.comment.text);
    Reply.findByIdAndUpdate(req.params.reply_id, req.body.comment, (err, reply) => {
        if(err || !reply) return res.redirect("back")
        res.redirect(`/comment/${reply.parent.comment}/replies`)
    })
})

router.get("/comment/:comment_id/delete", middlewear.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if(err || !comment) res.redirect("back")
        res.render("post/comment/comment-delete", {comment: comment, commentType: "comment"})
    })
})

router.get("/reply/:reply_id/delete", middlewear.checkReplyOwnership, (req, res) => {
    Reply.findById(req.params.reply_id, (err, reply) => {
        console.log("||||||||||||||||||||||||||||||")
        console.log(err)
        console.log("###################################################")
        console.log(reply)
        if(err || !reply) return res.redirect("back")
        res.render("post/comment/comment-delete", {comment: reply, commentType: "reply"})
    })
})



module.exports = router;