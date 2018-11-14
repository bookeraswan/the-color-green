var express                 =  require("express"),
    router                  =  express.Router(),
    passport                = require("passport"),
    middlewear              = require("../middlewear"),
    User                    = require("../models/user");



router.get("/login", function(req, res) {
   res.render("auth/login"); 
});


router.post("/login", passport.authenticate("local",{
    successRedirect: "/loginresponse",
    failureRedirect: "/login"
}),function(req, res){
});


router.get("/loginresponse",middlewear.isLoggedIn, function(req, res) {
    res.redirect("/user/" + req.user._id);
});


router.get("/signup", function(req, res) {
   res.render("auth/signup"); 
});


router.post("/signup", function(req, res){
    req.body.username;
    req.body.password;
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.redirect("back");
      }
      else{
            User.findByIdAndUpdate(user._id, req.body.newuser, function(err, newUser){
                if(err){
                    console.log(err);
                    res.redirect("/login");
                }
                else{
                    passport.authenticate("local")(req, res, function(){
                    res.redirect("/user/" + user._id);
            });
                }
            });
      }
    });
  });
  
  
router.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/");
});

module.exports = router;