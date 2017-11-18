var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    seedDB          = require("./seeds");

mongoose.connect('mongodb://localhost/yelp_camp_v5', { useMongoClient: true });
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

seedDB();

// ===============
// RESTFUL ROUTES
// ===============

app.get("/", function(req, res) {
    res.render("landing");
});

// =============
// INDEX ROUTE
// =============

app.get("/campgrounds", function(req, res) {
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

app.post("/campgrounds", function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = { name: name, image: image, description: description };
    
    Campground.create(newCampground, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// =============
// NEW ROUTE
// =============

app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

// =============
// SHOW ROUTE
// =============

// The ID is passed by the button "More Info" on the index.html page
app.get ("/campgrounds/:id", function(req, res) {
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


//=============================================
//=============================================
//  NESTED ROUTES: COMMENTS ROUTES
//=============================================
//=============================================



//=============================================
//  NEW  ROUTE  campgrounds/:id/comments/new
//=============================================

app.get("/campgrounds/:id/comments/new", function(req, res) {
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

app.post("/campgrounds/:id/comments", function(req, res) {
    
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

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started, port: " + process.env.PORT + ", IP: " + process.env.IP);
});