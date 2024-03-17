const express = require("express");
const ordersController = require("../controllers/ordersController");

const router = express.Router();
router.post(
  "/create",
  ordersController.uploadOrderAttachment,
  ordersController.createOrder
);
router.get("/getAllOrders", ordersController.getAllOrders);
router.delete("/deleteOrder/:id", ordersController.deleteOrder);
router.patch("/markAsActive/:id", ordersController.markAsActive);

module.exports = router;
