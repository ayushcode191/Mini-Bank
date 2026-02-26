const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    accountNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\d{10}$/,
    },
    holderName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 60,
    },
    balance: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isKYCVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);
