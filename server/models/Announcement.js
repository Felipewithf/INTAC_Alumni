const { Schema, model } = require("mongoose");

const announcementSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  alumProfile: {
    type: Schema.Types.ObjectId,
    ref: "AlumProfile",
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  isOnGoing: {
    type: Boolean,
    required: true,
  },
  ctaLink: {
    type: String,
    required: true,
  },
  ctaText: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

const Announcement = model("Announcement", announcementSchema);
module.exports = Announcement;
