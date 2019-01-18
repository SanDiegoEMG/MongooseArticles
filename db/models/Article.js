var mongoose = require("mongoose");

// assign variable to constructor
var Schema = mongoose.Schema;

// create new UserSchema object using  Schema constructor
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },
  // `note` is an object that stores a Note id the ref property links the ObjectId to the Note model & allows us to populate the Article with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// creates model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
