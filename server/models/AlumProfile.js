const { Schema, model } = require("mongoose");

const websiteLinkSchema = new Schema({
  urlLink: { type: String, required: true },
  description: { type: String },
});

const alumProfileSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bio: { type: String, required: true },
  public: { type: Boolean, default: false },
  websiteLinks: [websiteLinkSchema],
  exhibitions: [{ type: Schema.Types.ObjectId, ref: "Exhibition" }],
  socialMedia: [{ type: Schema.Types.ObjectId, ref: "SocialMediaLink" }],
  exhibitionsReferences: [{ type: Schema.Types.ObjectId, ref: "ExhibitionReference" }],
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const AlumProfile = model("AlumProfile", alumProfileSchema);

module.exports = AlumProfile;
