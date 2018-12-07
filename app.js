var express                 = require("express"),
    app                     = express(),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    LocalStratigy           = require("passport-local"),
    methodOverride          = require("method-override"),
    middlewear              = require("./middlewear"),
    User                    = require("./models/user"),
    Post                    = require("./models/post");

// _____________________________________
//          Require routes
        var GeneralRoutes   = require("./routes"),
            authRoutes      = require("./routes/auth"),
            userRoutes      = require("./routes/user"),
            postRoutes      = require("./routes/post"),
            commentRoutes   = require("./routes/comment");
// _____________________________________

// mongodb://localhost:27017/thecolorgreen-v1
mongoose.connect(process.env.THECOLORGREEN_DATABASEURL,{ useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
mongoose.set('useFindAndModify', false);

// +++++++++++++++++++++++++++++++++++++++++++++++
//      Autentication Set Up
// +++++++++++++++++++++++++++++++++++++++++++++++

app.use(require("express-session")({
    secret: "All seeds turn green, sin arboles no hay vida, trees grow",
    resave: false,
    saveUninitialized: false

}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStratigy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// +++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++

// add values to all templates
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

// ====================================
//                ROUTES

            app.use(authRoutes);
            app.use(userRoutes);
            app.use(postRoutes);
            app.use(commentRoutes);
            app.use(GeneralRoutes);

// ====================================

app.listen(process.env.THECOLORGREEN_PORT, process.env.IP, function(){
   console.log("all seeds turn green");
});
