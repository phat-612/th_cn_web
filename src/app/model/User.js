const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 1,
  },
  avatar: {
    type: String,
    default: "https://www.w3schools.com/howto/img_avatar.png",
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: Boolean,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  hometown: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
