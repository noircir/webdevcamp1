var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/yelp_camp', { useMongoClient: true });
mongoose.Promise = global.Promise;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
// to serve custom CSS
app.use(express.static("public"));

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Granite Hill",
//         image: "http://www.photosforclass.com/download/3820664827",
//         description: "Beautiful site, proximity to lakes, kayak rentals, showers, fireplaces."
//     }, 
//     function(err, campground) {
//         if (err) {
//             console.log("Problem creating new campground!!")
//         } else {
//             console.log("CAMPGROUND CREATED: ");
//             console.log(campground);
//         }
// });

app.get("/", function(req, res) {
    res.render("landing");
});

// INDEX - get
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

// INDEX - post
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

// NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

// SHOW - shows more info about one campground
// The ID is passed by the button "More Info" on the index.html page
app.get ("/campgrounds/:id", function(req, res) {
    // find the campground with the provided ID
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // render show template with that background
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started, port: " + process.env.PORT + ", IP: " + process.env.IP);
});