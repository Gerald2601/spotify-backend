const { Schema, model } = require("mongoose");

const songSchema = new Schema({
  title: { type: String, required: true },
  duration: { type: Number, required: true },
  genre: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  photo: { type: String, required: true },
});

const Song = model("song", songSchema);

module.exports = Song;