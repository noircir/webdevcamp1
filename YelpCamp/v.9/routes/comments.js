var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

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
            // req.body.comment.text = req.sanitize(req.body.comment.text);
            Comment.create(req.body.comment, function(err, newComment) {
                if (err) {
                    console.log(err);
                } else {
                    // add username and id to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    // console.log("new user username will be : " + req.user.username)
                    newComment.save();
                    campground.comments.push(newComment);
                    campground.save();
                    // redirect to campground show page
                    console.log("new comment is: " + newComment);
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