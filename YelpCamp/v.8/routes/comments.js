var express = require("express");
// merge parameters of (":id" got lost after splitting into routes)
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//=============================================
//=============================================
//  NESTED ROUTES: COMMENTS ROUTES
//=============================================
//=============================================



//=============================================
//  NEW  ROUTE  campgrounds/:id/comments/new
//=============================================

router.get("/new", isLoggedIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log("Could not find campground by ID");
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
    
});


//=========================================
//  CREATE ROUTE campgrounds/:id/comments
//=========================================

router.post("/", isLoggedIn, function(req, res) {
    
    // look up campground using id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log("Could not find campground by ID");
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comment
            // req.body.comment.text = req.sanitize(req.body.comment.text);
            Comment.create(req.body.comment, function(err, newComment) {
                if (err) {
                    console.log(err);
                } else {
                    // connect new comment to campground
                    campground.comments.push(newComment);
                    campground.save();
                    // redirect to campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// middleware

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;