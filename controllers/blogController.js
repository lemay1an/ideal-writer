const Blog = require("../model/blogModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./../controllers/handlerFactory");

exports.createBlog = factory.createOne(Blog);
exports.deleteBlog = factory.deleteOne(Blog);
