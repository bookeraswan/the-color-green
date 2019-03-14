var express                 = require("express"),
    app                     = express(),
    mongoose                = require("mongoose"),
    compression             = require("compression"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    LocalStratigy           = require("passport-local"),
    methodOverride          = require("method-override"),
    expressSanitizer        = require("express-sanitizer"),
    middlewear              = require("./middlewear"),
    User                    = require("./models/user"),
    Post                    = require("./models/post")
// _____________________________________
//          Require routes
        var GeneralRoutes   = require("./routes"),
            authRoutes      = require("./routes/auth"),
            userRoutes      = require("./routes/user"),
            postRoutes      = require("./routes/post"),
            commentRoutes   = require("./routes/comment");
// _____________________________________

mongoose.connect(process.env.THECOLORGREEN_DATABASEURL,{ useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
mongoose.set('useFindAndModify', false);

// +++++++++++++++++++++++++++++++++++++++++++++++
//      Autentication Set Up
// +++++++++++++++++++++++++++++++++++++++++++++++

app.use(require("express-session")({
    secret: process.env.THECOLORGREEN_SECRET,
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

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("all seeds turn green");
});
