const mongoose = require("mongoose");
const validator = require("validator");

const orderSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "This field is required"],
  },
  email: {
    type: String,
    required: [true, "This field is required"],
    validate: [validator.isEmail, "Please enter a valid email address"],
    lowerCase: true,
  },
  phone: {
    type: String,
    required: [true, "This field is required"],
    validate: [validator.isMobilePhone, "Please enter a valid email address"],
  },
  description: String,
  attachment: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  active: {
    type: Boolean,
    default: false,
    select: false,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
