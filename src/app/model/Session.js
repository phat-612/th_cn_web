const session = require("express-session");
const mongoose = require("mongoose");
const sessionSchema = new mongoose.Schema({
  session: {
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
    },
    role: {
      type: Number,
    },
  },
});
const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
