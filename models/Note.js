// Require mongoose
var mongoose = require("mongoose");

// assign variable to constructor
var Schema = mongoose.Schema;


// create new NoteSchema object using the Schema constructor
var NoteSchema = new Schema({
  title: String,
  body: String
});

// creates model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
