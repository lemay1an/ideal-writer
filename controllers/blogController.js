const Blog = require("../model/blogModel");
const factory = require("./../controllers/handlerFactory");

exports.createBlog = factory.createOne(Blog);
exports.deleteBlog = factory.deleteOne(Blog);
exports.updateBlog = factory.updateOne(Blog);
exports.getAllBlogs = factory.getAll(Blog);
exports.getOneBlog = factory.getOne(Blog);
