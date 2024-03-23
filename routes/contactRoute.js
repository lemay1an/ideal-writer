const express = require("express");
const contactController = require("../controllers/contactController");

const router = express.Router();

router.post("/makeContact", contactController.makeContact);
router.get("/getAllContact", contactController.getAllContact);
router.get("/getContact/:id", contactController.getContact);
router.delete("/deleteContact/:id", contactController.deleteContact);

module.exports = router;
