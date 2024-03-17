const catchAsync = require("../utils/catchAsync");
const Order = require("../model/orderModel");
const { sendEmail } = require("../utils/email");
const multer = require("multer");
const path = require("path");
const AppError = require("../utils/appError");

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/content/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Math.random(30000000)}-${Date.now()}${path.extname(
        file.originalname
      )}`
    );
  },
});

const upload = multer({
  storage: storage,
});

exports.uploadOrderAttachment = upload.single("attachement");

exports.createOrder = catchAsync(async (req, res, next) => {
  const { name, email, phone, description } = req.body;

  let attachement;

  if (req.file) attachement = req.file.filename;

  const newOrder = await Order.create({
    name,
    email,
    phone,
    description,
    attachment: attachement,
  });

  const message = `This is a confirmation email that you created order -${newOrder?.id} - at ${newOrder?.createdAt}. If it was not you, please reach out to support.`;

  sendEmail(email, "Passord Reset", message, res, "resetURL", true, newOrder);
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({}).sort("-createdAt").select("+active");

  res.status(200).json({
    status: "success",
    totalOrders: orders?.length,
    data: orders,
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("No order with that ID"));
  }

  await Order.findByIdAndDelete(id);

  res.status(200).json({});
});

exports.markAsActive = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("No order with that ID"));
  }

  await Order.findByIdAndUpdate(id, { active: true });

  res.status(200).json({});
});
