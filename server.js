// Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var app = express();

// Require all models
var db = require("./db/models");

var PORT = 3000;

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoArticles", { useNewUrlParser: true });


// html file rendered on home route
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/public/src/views/index.html"));
  });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});
