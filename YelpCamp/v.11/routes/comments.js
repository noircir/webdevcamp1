var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//=============================================
//  NEW  ROUTE  campgrounds/:id/comments/new
//=============================================

router.get("/new", middleware.isLoggedIn, function(req, res) {
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

router.post("/", middleware.isLoggedIn, function(req, res) {
    
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


//===============================================
//  EDIT ROUTE campgrounds/:id/comments/:id/edit
//===============================================

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
            console.log(err);
        } else {
            // req.params.id is campground's id
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })
    
});

//===============================================
//  UPDATE ROUTE campgrounds/:id/comments/:id/edit
//===============================================

router.put("/:comment_id", function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+ req.params.id);
        }
    })
    
});

//======================================================
//  DESTROY ROUTE campgrounds/:id/comments/:comment_id
//======================================================

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;