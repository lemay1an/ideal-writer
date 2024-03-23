const mongoose = require("mongoose");
const validator = require("validator");

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    requuired: [true, "Name is required"],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },
  phoneNumber: {
    type: String,
    validate: [validator.isMobilePhone, "Please enter a valid phone number"],
  },
  message: {
    type: String,
    minlength: [20, "A message must have more or equal then 200 characters"],
  },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
