const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  user: [
    {
      idStandard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Standard",
      },
      check: {
        type: Boolean,
        default: false,
      },
    },
  ],
  admin: [
    {
      idStandard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Standard",
      },
      check: {
        type: Boolean,
        default: false,
      },
    },
  ],
  userScore: {
    type: Number,
    required: true,
    default: 0,
  },
  adminScore: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

const Score = mongoose.model("Score", scoreSchema);

module.exports = Score;
