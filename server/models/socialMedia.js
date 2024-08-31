const { Schema, model } = require("mongoose");

const socialMediaSchema = new Schema({
  platform: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
});

const SocialMedia = model("SocialMedia", socialMediaSchema);
module.exports = SocialMedia;
