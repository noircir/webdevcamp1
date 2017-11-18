var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/cat_app', { useMongoClient: true });
mongoose.Promise = global.Promise;

// defining DB pattern
var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

// after compiling the pattern into a model,
// var Cat is not just a pattern anymore, but an object
// that has mongodb methods.
// The object will have a collection called Cats (creates it on its own!)
var Cat = mongoose.model("Cat", catSchema);

// add a new cat to the DB

// var george = new Cat({
//     name: "Tabby",
//     age: 7,
//     temperament: "Independent"
// })

// now save it into the DB
// "george" is what we are trying to save to the db,
// and "cat" is what is coming back from the db
// george.save(function(err, cat){
//     if (err) {
//         console.log("SOMETHING WENT WRONG!");
//     } else {
//         console.log("WE JUST SAVED A CAT TO THE DB:");
//         console.log(cat);
//     }
// });

// CREATE method does both: creates a new Cat object and saves into the DB

Cat.create({
    name: "Snow White",
    age: 1,
    temperament: "Playful"
}, function(err, cat) {
    if (err) {
        console.log("ERROR DETECTED");
        console.log(err);
    } else {
        console.log(cat);
    }
});



// retrieve all cats from the DB and console.log each one

Cat.find(function(err, cats){
    if (err) {
        console.log("OH NO!!! ERROR!");
        console.log(err);
    } else {
        console.log("ALL THE CATS...:");
        console.log(cats);
    }
});