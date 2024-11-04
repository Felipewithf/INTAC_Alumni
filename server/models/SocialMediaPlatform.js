const { Schema, model } = require("mongoose");

const socialMediaPlatformSchema = new Schema({
  name: { type: String, required: true },
  logo: { type: String },
});

const SocialMediaPlatform = model("SocialMediaPlatform", socialMediaPlatformSchema);
module.exports = SocialMediaPlatform;
