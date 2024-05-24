const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    name: String,
    desc: String,
    standards: [
      {
        name: String,
        criterias: [
          {
            name: String,
            score: Number,
          },
        ],
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
    reviews: [
      {
        idUser: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        details: [[Boolean]],
        total: Number,
        status: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
