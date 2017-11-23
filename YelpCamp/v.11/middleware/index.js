
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {  //isAuthenticated() is a method of passport
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                // Is the logged person the same as the author of the campground?
                // since one id is Object, and the other is String, mongoose can compare with "equals"
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {  //isAuthenticated() is a method of passport
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                // Is the logged person the same as the author of the campground?
                // since one id is Object, and the other is String, mongoose can compare with "equals"
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;