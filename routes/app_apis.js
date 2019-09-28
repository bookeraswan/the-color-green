 const express                 =  require("express"),
       router                  =  express.Router(),
       passport                = require("passport"),
       middlewear              =  require("../middlewear"),
       User                    =  require("../models/user");

       var lastUser = {}

router.get("/isLoggedin", function(req, res){
    if(req.user) res.json(true)
    else return res.json(false)
})

router.post("/login",// passport.authenticate("local"),
 function(req, res){
    lastUser = req.body
    res.json(req.user)
})

router.get("/lastapilogin", (req, res) => res.json(lastUser))

router.get("/currentuser", function(req, res){
    if(!req.user) return res.json(false)
    var user = {
        _id : req.user._id,
        bio : req.user.bio || "",
        image : req.user.image,
        imageSm : req.user.profileIconImage,
        username : req.user.username,
        followers : req.user.followers.length,
        following : req.user.following.length
    }
    if(req.query.with_posts == "true") sendAll(req, res, user)
    else res.json(user)
})

function sendAll(req, res, sendObj){
    User.findById(req.user._id)
        .populate("posts")
        .exec((err, user) => {
            if(err || !user) return res.json(false)
            var posts = user.posts.map(function(post){
                return {
                    _id: post._id,
                    text: post.text,
                    image: post.image,
                    created: post.created.toDateString(),
                    comments: post.comments.length
                }
            })
            sendObj.posts = posts
            res.json(sendObj)
        })
}

module.exports = router