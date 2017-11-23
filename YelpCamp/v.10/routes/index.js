var express     = require("express");
var router      = express.Router();

var passport    = require("passport");
var User        = require("../models/user");

// ===============
// RESTFUL ROUTES
// ===============

router.get("/", function(req, res) {
    res.render("landing");
});

// ======================
// AUTHORIZATION ROUTES
// ======================

// show register form
router.get("/register", function(req, res) {
    res.render("register");
});

// handling user sign-up
router.post("/register", function(req, res) {
    // creating a new user and then authenticate him.
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        } 
        // local strategy, which can be replaced with other strategies
        // http://www.passportjs.org/docs
        passport.authenticate("local")(req, res, function() {
            res.redirect("campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// handling login logic
// assuming the user already exists and authenticating him
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;