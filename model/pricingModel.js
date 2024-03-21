const mongoose = require("mongoose");

const pricingSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "A pricing must have a title"],
  },
  description: {
    type: [String],
    required: [true, "A pricing must have a description"],
  },
  amount: {
    type: [String],
    required: [true, "A pricing must have a description"],
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const Pricing = mongoose.model("Pricing", pricingSchema);

module.exports = Pricing;
