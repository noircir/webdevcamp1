var express = require("express");
// Here, we would usually declare:
// var app = express();
// But, instead, we declare variable "router".
// It is not express, it is its router part.
// (a new instance of express router)
var router  = express.Router();

var Campground = require("../models/campground");
var middleware = require("../middleware");


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

router.post("/", middleware.isLoggedIn, function(req, res) {
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

router.get("/new", middleware.isLoggedIn, function(req, res) {
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

// =============
// EDIT ROUTE
// =============
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});


// =============
// UPDATE ROUTE
// =============

router.put("/:id", middleware.checkCampgroundOwnership, function(req,res) {
    // req.body.blog.body = req.sanitize(req.body.blog.body);
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

// =============
// DESTROY ROUTE
// =============

router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;