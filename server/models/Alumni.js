const { Schema, model } = require("mongoose");

const alumniSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  bio: {
    type: String,
  },
  public: {
    type: Boolean,
    required: true,
  },
  websiteLinks: [
    {
      urlLink: { type: String },
      description: { type: String },
    },
  ],
  studentExhibitions: [
    {
      exhibition: {
        type: Schema.Types.ObjectId,
        ref: "StudentExhibition",
      },
      references: [{ type: String }], // Array of references for this specific exhibition
    },
  ],
  socialMedia: [
    {
      platform: {
        type: Schema.Types.ObjectId,
        ref: "SocialMedia",
      },
      url: {
        type: String,
        default: "",
      },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Alumni = model("Alumni", alumniSchema);

module.exports = Alumni;
