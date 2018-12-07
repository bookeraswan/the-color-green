var express         = require("express"),
    router          = express.Router(),
    User            = require("../models/user"),
    middlewear      = require("../middlewear");

    var data = [
        {
            name: "Sana",
            image: "https://res.cloudinary.com/ddxbyvkui/image/upload/v1536326493/pvzgqtxj5z4ji2urlvsv.jpg",
            desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
        {
            name: "Tierra Roja",
            image: "https://res.cloudinary.com/ddxbyvkui/image/upload/v1536420867/gjlco1n62s4jw9ovy71f.jpg",
            desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }
    ];


// router.post("/", function(req, res) {
//   console.log(req.body);
// })

router.get("/", function(req, res){
    if(!req.user){
        res.render("index/home");
    }
    else{
        var currentDate = new Date(Date.now()).getTime() - 3600000;
        // console.log(currentDate);
        // console.log("___________________________________");
        var recentPosts = [];
        req.user.following.forEach(function(follower) {
            User.findById(follower).populate("posts").exec(function(err, foundPerson){
                if(err || !foundPerson){
                    console.log(err + " PERSON NOT FOUND");
                }
                else{
                    foundPerson.posts.forEach(function(post) {
                        var date = post.created.getTime().toString();
                        // date = parseInt(date, 10);
                        // console.log("------------------------------");
                        // console.log(date);
                        // console.log("------------------------------");
                        // if(true){
                            // console.log(post);
                            recentPosts.unshift(post);
                        // }
                    });
                }
            });
        });
        // console.log("[[[[[[[[[[[]]]][][][][][][][][][");
        // console.log(recentPosts);
        // console.log("[][][][][][][][][][][][][][][][]");
        // console.log("'''''''''''''''''''''''''''''''''''''''''''''''''");
        // console.log(currentDate);
        // console.log("'''''''''''''''''''''''''''''''''''''''''''''''''");
        res.render("user/feed", {posts: recentPosts});
    }
});

router.get("/featured", function(req, res){
   res.render("index/featured", {featured: data});
});

router.get("/users", function(req, res) {
        if(req.query.search === "" || !req.query.search){
            return res.redirect("back");
        }
        User.find({ username: {$regex: req.query.search, $options: "i"}},
        {textScore: { $meta: 'textScore' }},
    function(err, foundUsers){
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


            res.render("users/users", {user: foundUsers});
        }
});

// router.post("/users", function(req, res) {
//     User.find({username: req.body.search}, function(err, foundUsers){
//       if(err){
//           console.log(err + "SEARCH USERS ERROR");
//           res.redirect("/");
//       }
//       else{
//           res.redirect("/users");
//       }
//     });
// });

});

// ++++++++++++++++++++++++++++++++++++++++
//              ELSE
// ++++++++++++++++++++++++++++++++++++++++
router.get("*", function(req, res) {
   res.redirect("/users");
});


module.exports = router;
