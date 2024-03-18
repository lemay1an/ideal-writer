const mongoose = require("mongoose");
const validator = require("validator");

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "A blog must have a title"],
    trim: true,
    maxlength: [40, "A  blog title must have less or equal then 40 characters"],
    minlength: [10, "A  blog title must have more or equal then 10 characters"],
  },
  description: {
    type: String,
    required: [true, "A blog must have a description"],
    trim: true,
    minlength: [
      200,
      "A blog description must have more or equal then 200 characters",
    ],
  },
  likes: {
    type: Number,
    default: 0,
  },
  shareCount: {
    type: Number,
    default: 0,
  },
  coverImage: String,
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
