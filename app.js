var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    User            = require("./models/user"),
    Post            = require("./models/post");
    
    
    

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
    

    
    
mongoose.connect("mongodb://localhost:27017/thecolorgreen-v1");
    
    
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));




// ====================================
//                ROUTES
// ====================================

app.get("/", function(req, res){
    res.render("index/home"); 
});

app.get("/featured", function(req, res){
   res.render("index/featured", {featured: data}); 
});

app.get("/user/:id", function(req, res) {
    User.findById(req.params.id).populate("posts").exec(function(err, foundUser){
        if(err || !foundUser){
            res.redirect("/");
        }
        else{
            res.render("user/profile", {user: foundUser}); 
        }
    });
});

app.get("/users", function(req, res) {
        User.find({}, function(err, foundUsers){
        if(err || !foundUsers){
            res.redirect("/");
        }
        else{
            res.render("user/users", {user: foundUsers}); 
        }
});

});

app.get("/login", function(req, res) {
   res.render("auth/login"); 
});

app.get("/signup", function(req, res) {
   res.render("auth/signup"); 
});

app.post("/signup", function(req, res){
   User.create(req.body.newuser, function(err, newUser){
       if(err){
           res.redirect("/login");
       }
       else{
           res.redirect("/");
       }
   });
});




// -------------------------------
//        NEW  POSTS ROUTES
// -------------------------------

app.get("/user/:id/post/new", function(req, res) {
   User.findById(req.params.id, function(err, foundUser){
      if(err || !foundUser){
          res.redirect("/");
      } 
      else{
          res.render("post/newpost", {user: foundUser}); 
      }
   });
});

app.post("/user/:id/post", function(req, res){
   User.findById(req.params.id, function(err, foundUser) {
       if(err || !foundUser){
           res.redirect("back");
       }
       else{
           Post.create(req.body.post, function(err, post){
               if(err){
                   res.redirect("/");
               }
               else{
                   post.owner.username = "Booker";
                   post.save();
                   foundUser.posts.push(post); 
                   foundUser.save();
                   res.redirect("/user/" + req.params.id);
               }
           });
       }
   });
});

app.get("/user/:id/post/:post_id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if(err || !foundUser){
            res.redirect("/users");
        }
        else{
            Post.findById(req.params.post_id, function(err, foundPost) {
                if(err || !foundPost){
                    res.redirect("/users");
                }
                else{
                res.render("post/show-post", {post: foundPost});
                }
            }); 
        }
    });
});




// ++++++++++++++++++++++++++++++++++++++++
//              ELSE
// ++++++++++++++++++++++++++++++++++++++++
app.get("*", function(req, res) {
   res.redirect("/users"); 
});
// ++++++++++++++++++++++++++++++++++++++++

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("all seeds turn green"); 
});