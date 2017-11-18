var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");
    
var data = [
    {
        name        : "Cloud's Rest",
        image       : "https://goo.gl/4KL3kx",
        description : "Nonne vides quid sit? Tu es ... Jesse me respice. Tu ... blowfish sunt. A blowfish! Cogitare. Statura pusillus, nec sapientium panem, nec artificum. "
    },
    {
        name        : "La Mauricie National Park",
        image       : "https://goo.gl/sYAGpA",
        description : "Chase mice run in circles yet mark territory sleep on keyboard. Claw drapes. Intently sniff hand burrow under covers for behind the couch but inspect anything brought into the house. Intently stare at the same spot flop over or give attitude or hide when guests come over yet hide when guests come over mark territory."
    },
    {
        name        : "Forillon National Park",
        image       : "https://goo.gl/rzKcVo",
        description : "Nonne vides quid sit? Tu es ... Jesse me respice. Tu ... blowfish sunt. A blowfish! Cogitare. Statura pusillus, nec sapientium panem, nec artificum. "
    }
    
]
    
function seedDB() {
    // remove all campgrounds
    Campground.remove({}, function(err) {
        if (err) {
            console.log("error");
        }
        console.log("removed campgrounds!!")
        Comment.remove({}, function(err) {
            if (err) {
                console.log("error");
            }
            console.log("removed comments!!")
        });
        
        // add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if (err) {
                    console.log(err)
                } else {
                    console.log("Added new campground");
                    // console.log(seed);
                    // create a comment
                    Comment.create({
                        text: "Great campground, five stars, will return again!!!",
                        author: "Heisenberg"
                        
                    }, function(err, comment) {
                        if (err)  {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new comment.");
                        }
                    });
                }
            });  // end forEach loop
        });  // end callback of Campground.remove() 
    }); // end function seedDB()
    
    // add a few comments
    
    
    
    
}

module.exports = seedDB;