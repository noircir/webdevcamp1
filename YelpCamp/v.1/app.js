var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var campgrounds = [
    {name: "Mauricie", image: "http://s1.1zoom.me/big0/710/302473-frederika.jpg"},
    {name: "L'Escale Pointe Calumet", image: "https://source.unsplash.com/ACAK6F9mzgs"},
    {name: "Lac Lafontaine", image: "http://www.cruisesaintlawrence.com/upload/Attach/600_450/2147FR.jpg"},
    {name: "Lac Lafontaine", image: "http://www.cruisesaintlawrence.com/upload/Attach/600_450/2147FR.jpg"},
    {name: "L'Escale Pointe Calumet", image: "https://source.unsplash.com/ACAK6F9mzgs"},
    {name: "Pointe-des-Cascades", image: "https://source.unsplash.com/gcCcIy6Fc_M"}, 
    {name: "L'Escale Pointe Calumet", image: "https://source.unsplash.com/ACAK6F9mzgs"},
    {name: "Pointe-des-Cascades", image: "https://source.unsplash.com/gcCcIy6Fc_M"},
    {name: "Mauricie", image: "http://s1.1zoom.me/big0/710/302473-frederika.jpg"},
    {name: "Mauricie", image: "http://s1.1zoom.me/big0/710/302473-frederika.jpg"},
    {name: "Lac Lafontaine", image: "http://www.cruisesaintlawrence.com/upload/Attach/600_450/2147FR.jpg"},
    {name: "Pointe-des-Cascades", image: "https://source.unsplash.com/gcCcIy6Fc_M"}
]

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {sendCampgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) {
    //res.send("YOU HIT THE POST ROUTE!");
    // get data from form and add to camgrounds array
    var name = req.body.name;
    var image = req.body.image;
    campgrounds.push({name: name, image: image});
    //redirect back to the campgrounds page
    res.redirect("/campgrounds");
});

app.get ("/campgrounds/new", function(req, res) {
    res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started, port: " + process.env.PORT + ", IP: " + process.env.IP);
});