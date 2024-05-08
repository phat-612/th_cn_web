const mongoose = require("mongoose");

const standardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  criterias: [
    {
      name: { type: String },
      score: { type: Number },
    },
  ],
});

const Standard = mongoose.model("Standard", standardSchema);

module.exports = Standard;
