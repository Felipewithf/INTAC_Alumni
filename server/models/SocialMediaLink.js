const { Schema, model } = require("mongoose");

const socialMediaLinkSchema = new Schema({
  socialMediaPlatform: { type: Schema.Types.ObjectId, ref: 'SocialMediaPlatform', required: true },
  urlLink: { type: String, required: true }
});

const SocialMediaLink = model("SocialMediaLink", socialMediaLinkSchema);
module.exports = SocialMediaLink;
