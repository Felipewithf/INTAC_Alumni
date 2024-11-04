const { Schema, model } = require("mongoose");

const exhibitionSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  poster: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  alumniExhibition: { type: Boolean, default: false }
});

const Exhibition = model("Exhibition", exhibitionSchema);

module.exports = Exhibition;
