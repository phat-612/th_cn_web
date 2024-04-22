const mongoose = require("mongoose");

const standardSchema = new mongoose.Schema({
  ten: {
    type: String,
    required: true,
  },
});

const Standard = mongoose.model("Standard", standardSchema);

module.exports = Standard;
