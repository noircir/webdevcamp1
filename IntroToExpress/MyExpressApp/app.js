var express = require('express');
var app = express();

// "/" => "Hi there!"
app.get('/', function(req, res) {
    res.send('Hi there, welcome to my assignment!');
});

// "bye" => "Goodbye!"
app.get('/speak/:animal', function(req, res) {
    var sounds = {
        pig: "Oink",
        cow: "Moo",
        dog: "Woof! Woof!",
        cat: "I hate you human",
        goldfish: "..."
    }
    var animal = req.params.animal.toLowerCase();
    var sound = sounds[animal];
    res.send('The ' + animal + ' says "' + sound +'"');
});

app.get('/repeat/:word/:times', function(req, res) {
    var word = req.params.word;
    var times = Number(req.params.times);
    var result = "";
    for (var i=0; i<times; i++) {
        result += word + " ";
    }
    res.send(result);
});


app.get('*', function(req, res) {
    res.send('Sorry, page not found... What are you doing with your life?');
});


// Tell Express to listen to requests
app.listen (process.env.PORT, process.env.IP, function() {
    console.log('App is listening on port ...!')
});