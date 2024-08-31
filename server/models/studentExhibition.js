const { Schema, model } = require("mongoose");

const studentExhibitionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  poster: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});

const StudentExhibition = model("StudentExhibition", studentExhibitionSchema);

module.exports = StudentExhibition;
