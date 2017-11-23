var express             = require("express"),
    methodOverride      = require("method-override"),
    bodyParser          = require("body-parser"),
    expressSanitizer    = require("express-sanitizer"),
    app                 = express(),
    mongoose            = require("mongoose");

// APP CONFIG
mongoose.connect("mongodb://localhost/blog_app", { useMongoClient: true });
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
// sanitizer should be after bodyParser
app.use(expressSanitizer());
app.use(express.static("public"));      // to serve custom CSS
app.use(methodOverride("_method"));

// MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date, 
        default: Date.now
    }
});
var Blog = mongoose.model("Blog", blogSchema); // compile the schema into Blog object. 

// ===============
// RESTFUL ROUTES
// ===============

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

// =============
// INDEX ROUTE
// =============

app.get("/blogs", function(req,res) {
    // -1: sort by descending
    //If an object is passed, values allowed are asc, desc, ascending, descending, 1, and -1.
    Blog.find({}).sort({created: -1}).exec(function(err, blogs) {
        if (err) {
            console.log("/blogs route error!!");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

// =============
// NEW ROUTE
// =============

app.get("/blogs/new", function(req, res) {
    res.render("new");
});


// =============
// CREATE ROUTE
// =============

app.post("/blogs", function(req, res) {
    
    // create blog
    // the "new" form sent req.body.blog (title, url, body)
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            console.log("error creating blog");
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});


// =============
// SHOW ROUTE
// =============

app.get("/blogs/:id", function(req,res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// =============
// EDIT ROUTE
// =============

app.get("/blogs/:id/edit", function(req,res) {
    // res.render("edit");
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

// =============
// UPDATE ROUTE
// =============

app.put("/blogs/:id", function(req,res) {
    // res.send("This is our Update route");
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});


// =============
// DELETE ROUTE
// =============

app.delete("/blogs/:id", function(req,res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started, port: " + process.env.PORT + ", IP: " + process.env.IP);
});