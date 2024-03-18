const Blog = require("../model/blogModel");
const catchAsync = require("../utils/catchAsync");

exports.createBlog = catchAsync(async (req, res, next) => {
  const newBlog = await Blog.create({ ...req.body });

  res.status(201).json({
    status: "succes",
    data: newBlog,
  });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  const { id } = req.body;
});
