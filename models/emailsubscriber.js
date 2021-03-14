const mongoose = require("mongoose");

const emailSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailSubscriber", emailSubscriberSchema);
