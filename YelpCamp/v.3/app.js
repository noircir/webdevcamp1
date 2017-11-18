var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Campground      = require("./models/campground"),
    seedDB          = require("./seeds");

mongoose.connect('mongodb://localhost/yelp_camp_v3', { useMongoClient: true });
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
// to serve custom CSS
app.use(express.static("public"));

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
            res.render("index", {campgrounds: allCampgrounds});
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
    res.render("new");
});

// =============
// SHOW ROUTE
// =============

// The ID is passed by the button "More Info" on the index.html page
app.get ("/campgrounds/:id", function(req, res) {
    // with "populate", actual comments are visible in the object in db
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
    // without "populate", the comments' object id is added to the campground
    // Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // render show template with that background
            res.render("show", {campground: foundCampground});
            console.log(foundCampground);
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started, port: " + process.env.PORT + ", IP: " + process.env.IP);
});