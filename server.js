// Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var app = express();

// NPM tools for scraping 
var axios = require("axios");
var cheerio = require("cheerio");


// makes all files within models folder accessible
var db = require("./models");

// first part of this allows Heroku / mLabs to assign a port
var PORT = process.env.PORT || 3000;

// Use morgan logger to show info on logs
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// To serve static files such as images, CSS files, and JavaScript files, use the express.static - a built-in middleware function in Express.
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/mongoArticles", { useNewUrlParser: true });

// connecting using mLabs mongodb
mongoose.connect("mongodb://heroku_p03q4g48:n3imeinar0egosggpubos7fspa@ds261114.mlab.com:61114/heroku_p03q4g48", {useNewURLParser: true});


// html file rendered on home route
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/src/views/index.html"));
});


// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    //  grab the body of the html with axios
    axios.get("http://www.echojs.com/").then(function(response) {
      // load that into cheerio assign to $ (mimics jquery syntax)
      var $ = cheerio.load(response.data);
  
      // grab every h2 within an article tag - differs depending on website you are scraping
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add text & href of every link - save  as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

        // use Article model with `result` object 
        db.Article.create(result)
          .then(function(art) {
            // View the added result in the console
            console.log(art);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });
  

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(art) {
        // If Articles are successfully found, send them back to the client
        res.json(art);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

// Route for grabbing specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });



// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT);
});
