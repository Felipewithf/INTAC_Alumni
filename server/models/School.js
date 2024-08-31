const { Schema, model } = require("mongoose");

const schoolsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  country: {
    type: String,
    required: true,
  },
});

const School = model("School", schoolsSchema);
module.exports = School;
