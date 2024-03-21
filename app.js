const express = require("express");
const path = require("path");
const cors = require("cors");
const globalErrorHandler = require("./controllers/errrorControler");

const app = express();

app.use(express.json({ limit: "10kb" }));
// Serving our Static Images
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({ origin: true }));

const userRoutes = require("./routes/userRoutes");
const orderRoute = require("./routes/ordersRoute");
const blogRoute = require("./routes/blogRoute");
const priceRoute = require("./routes/pricingRoutes");

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/blogs", blogRoute);
app.use("/api/v1/price", priceRoute);

app.use(globalErrorHandler);

module.exports = app;
