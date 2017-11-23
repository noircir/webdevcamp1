var express = require("express");
// Here, we would usually declare:
// var app = express();
// But, instead, we declare variable "router".
// It is not express, it is its router part.
// (a new instance of express router)
var router  = express.Router();

var Campground = require("../models/campground");


// =============
// INDEX ROUTE
// =============

router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            //console.log(allCampgrounds);
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
   
});

// =============
// CREATE ROUTE
// =============

router.post("/", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    // console.log(author.id);
    // console.log(author.username);
    var newCampground = { name: name, image: image, description: description, author: author };
    // console.log(newCampground);
    Campground.create(newCampground, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            console.log(campground);
            res.redirect("/campgrounds");
        }
    });
});

// =============
// NEW ROUTE
// =============

router.get("/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// =============
// SHOW ROUTE
// =============

// The ID is passed by the button "More Info" on the index.html page
router.get ("/:id", function(req, res) {
    // with "populate", actual comments are visible in the object in db
    // => on the campground show page, as well.
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    // without "populate", the comments' the comment won't show on the page.
    // Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
            console.log(foundCampground);
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;