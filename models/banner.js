const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bannerSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    imageMobile: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isShow: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Banner", bannerSchema);
