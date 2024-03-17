const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "10kb" }));
// Serving our Static Images
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({ origin: true }));

const userRoutes = require("./routes/userRoutes");
const orderRoute = require("./routes/ordersRoute");

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/orders", orderRoute);

module.exports = app;
