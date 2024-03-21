const express = require("express");
const pricingCotroller = require("../controllers/pricingController");

const router = express.Router();
router.post("/createPricing", pricingCotroller.createPricing);
router.get("/getPricing", pricingCotroller.getPricing);
router.get("/getAllPricing", pricingCotroller.getAllPricing);
router.delete("/deletePricing/:id", pricingCotroller.deletePricing);
router.patch("/updatePricing/:id", pricingCotroller.updatePricing);

module.exports = router;
