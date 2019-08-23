var express                 =  require("express"),
    router                  =  express.Router(),
    passport                = require("passport"),
    middlewear              = require("../middlewear"),
    User                    = require("../models/user");

router.route("/login")
    .get((req, res) => res.render("auth/login"))
    .post(middlewear.sanitizeLogin, passport.authenticate("local",{
        successRedirect: "/loginresponse",
        failureRedirect: "/login"
    }));

router.get("/loginresponse", middlewear.isLoggedIn, (req, res) => 
    res.redirect("/user/" + req.user._id)
);

router.route("/signup")
    .get((req, res) => res.render("auth/signup"))
    .post((req, res) => {
        var username = req.sanitize(req.body.username);
        var password = req.sanitize(req.body.password);
        if(username.length < 3){
            return res.json({error: "username must be longer than two characters"});
        }
        if(password.length < 8){
            return res.json({error: "password must be longer than eight characters"});
        }

        User.register(new User({username: username}), password, (err, user) => {
            if(err) return res.json({error: err.message});
            passport.authenticate("local")(req, res, () => res.json({id: user._id}));
        });
    });

router.post("/api/checkusername", (req, res) => {
    User.find({username: req.body.username}, (err, found) =>{
        if(err) res.json(err);
        else if(found.length > 0) res.json(false);
        else res.json(true);
    })
});

router.get("/logout", (req, res) => {
   req.logout();
   res.redirect("/");
});

module.exports = router;