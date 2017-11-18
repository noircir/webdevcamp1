var express                 = require("express"),
    app                     = express(),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user"),
    localStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");

mongoose.connect('mongodb://localhost/auth_demo_2', { useMongoClient: true });
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// setting up passport application
// IMPORTANT:
// app.use(require("express-session").... should be before 
// app.use(passport.session())    !!!!!!!!!!
app.use(require("express-session")({
    secret: "Whitenose and Blacknose are sisters",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); 

// User methods come from plugin "passport-local-mongoose"
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==================
// ROUTES
//==================

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res) {
    res.render("secret");
});

//==================
// Auth Routes
//==================

// show sign up form
app.get("/register", function(req, res) {
    res.render("registrationform");
});

// handling user sign-up
app.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("registrationform");
        } 
        // local strategy, which can be replaced with other strategies
        // http://www.passportjs.org/docs
        passport.authenticate("local")(req, res, function() {
            res.redirect("secret");
        });
    });
});


//==================
// Login Routes
//==================

// render login form
app.get("/login", function(req, res) {
    res.render("login");
});

// login logic

// passport.authenticate ======> middleware : a code in between 
// the start of the route and the callback that has to execute 
// before the callback function.

// passport automatically takes the res.body.user and password, 
// so we don't have to explicitly provide.
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res) {});


// logout logic

// logout means that passport will not keep logic of the session,
// from request to request.
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

// middleware to check if user is still logged or not.
// (Without it, one can always open the "secret" page, logged or not)

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started.......");
});