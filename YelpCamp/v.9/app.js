// New packages in v.6 :
//  npm install passport passport-local passport-local-mongoose express-session --save

var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    Campground              = require("./models/campground"),
    Comment                 = require("./models/comment"),
    seedDB                  = require("./seeds"),
    passport                = require("passport"),
    User                    = require("./models/user"),
    localStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose");

// requiring routes from three files (which they are exporting)
// Just declarations here!! Using them further down.
var campgroundRoutes        = require("./routes/campgrounds"),  
    commentRoutes           = require("./routes/comments"),
    indexRoutes             = require("./routes/index");
    

mongoose.connect('mongodb://localhost/yelp_camp_v9', { useMongoClient: true });
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

// seedDB();

// =========================
// PASSPORT CONFIGURATION
// =========================
app.use(require("express-session")({
    secret: "Whitenose is Blacknose's sister",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); 

// User methods come from plugin "passport-local-mongoose"
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=========================
// PASS-THROUGH USER SETUP
//=========================

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
})

// using routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started, port: " + process.env.PORT + ", IP: " + process.env.IP);
});