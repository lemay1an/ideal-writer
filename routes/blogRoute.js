const express = require("express");
const blogController = require("./../controllers/blogController");

const router = express.Router();

router.post("/createBlog", blogController.createBlog);
router.delete("/deleteBlog/:id", blogController.deleteBlog);
router.patch("/updateBlog/:id", blogController.updateBlog);
router.get("/getAll", blogController.getAllBlogs);

module.exports = router;
