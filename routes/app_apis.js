 const express                 =  require("express"),
       router                  =  express.Router(),
       passport                = require("passport"),
       middlewear              =  require("../middlewear"),
       User                    =  require("../models/user");


router.get("/isLoggedin", function(req, res){
    if(req.user) res.json(true)
    else return res.json(false)
})

router.post("/login",(req, res, next) => {lastUser = req.body; next()}, passport.authenticate("local"),
 function(req, res){
    res.json(req.user)
})

router.get("/user/:id", function(req, res){
    User.findById(req.params.id).populate("posts").exec(function(err, foundUser){
        if(err || !foundUser) return res.json(false)
        var user = {
            _id : foundUser._id,
            bio : foundUser.bio || "",
            image : foundUser.image,
            imageSm : foundUser.profileIconImage,
            username : foundUser.username,
            followers : foundUser.followers.length,
            following : foundUser.following.length
        }
        if(req.query.with_posts == "true"){
            var posts = foundUser.posts.map(function(post){
                return {
                    _id: post._id,
                    text: post.text,
                    image: post.image,
                    created: post.created.toDateString(),
                    comments: post.comments.length
                }
            })
            user.posts = posts
        }
        res.json(user)
    })
})

module.exports = router