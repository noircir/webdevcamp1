var express = require('express');
var app = express();

// "/" => "Hi there!"
app.get('/', function(req, res) {
    res.send('Hello World!');
});

// "bye" => "Goodbye!"
app.get('/bye', function(req, res) {
    res.send('Goodbye!!!!');
});

// "dog" => "MEOW"
app.get('/dog', function(req, res) {
    console.log("SOMEONE MADE REQUEST TO /DOG!!!!");
    res.send('MEOW');
});

app.get('*', function(req, res) {
    res.send('You are a star!');
});


// Tell Express to listen to requests
app.listen (process.env.PORT, process.env.IP, function() {
    console.log('App is listening on port ...!')
    });