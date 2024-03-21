const express = require("express");
const pricingCotroller = require("../controllers/pricingController");

const router = express.Router();
router.post("/createPricing", pricingCotroller.createPricing);

module.exports = router;
