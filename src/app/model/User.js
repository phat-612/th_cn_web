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
  hoten: {
    type: String,
    required: true,
  },
  gioitinh: {
    type: String,
    required: true,
  },
  ngaysinh: {
    type: String,
    required: true,
  },
  quequan: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
