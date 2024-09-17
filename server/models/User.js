const { Schema, model } = require("mongoose");
const crypto = require('crypto');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must match an email address!'],
  },
  school: {
    type: Schema.Types.ObjectId,
    ref: "School",
  },
  years: {
    type: [Number],
  },
  register: {
    type: Boolean,
    default: false,
  },
  designationRole: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  magicToken: {
    type: String,
  },
  tokenExpiresAt: {
    type: Date,
  },
});

userSchema.methods.generateMagicToken = function () {
  this.magicToken = crypto.randomBytes(20).toString('hex');
  this.tokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
  return this.magicToken;
};

const User = model("User", userSchema);
module.exports = User;
