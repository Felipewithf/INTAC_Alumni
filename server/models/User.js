const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
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
});

const User = model("User", userSchema);
module.exports = User;
