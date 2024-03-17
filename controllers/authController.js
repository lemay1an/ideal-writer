const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("./../model/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { sendEmail } = require("./../utils/email");
const crypto = require("crypto");
const multer = require("multer");
const sharp = require("sharp");

const signToken = (id) => {
  console.log(id);
  return jwt.sign({ id }, "nTiKSihTxysi9zjU", {
    expiresIn: "90d",
  });
};

const createResendToken = (user, statusCode, req, res) => {
  // Create token
  const token = signToken(user._id);

  // Set Cookie options
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove the password from the password
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res) => {
  const { email, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    email,
    password,
    passwordConfirm,
  });

  createResendToken(newUser, 201, req, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if there is an email and password
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // Find the User
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // if everything is ok, send the token to the user
  createResendToken(user, 200, req, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get email from the req body
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // Generate a random Token
  const resetToken = await user.createRandomToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetPassword/${resetToken}`;

  const message = `This is an alert that you forgot your password and you are trying resetting it .\nIf you didn't forget your password, please ignore this email!`;

  // send email
  sendEmail(email, "Passord Reset", message, res, resetURL);
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("base64");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createResendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // Check for token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If there is no token
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // Validate the token
  const decodedToken = await promisify(jwt.verify)(token, "nTiKSihTxysi9zjU");

  // Get the current user

  const currentUser = await User.findById(decodedToken.id);

  if (!currentUser) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // Set the current user in the request
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const currentUser = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createResendToken(user, 200, req, res);
});

exports.logOut = catchAsync(async (req, res, next) => {
  res.cookie("jwt", "loggedOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
  });
});

// MULTER UPLOAD IMAGE
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/images/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({}).sort("-createdAt");

  res.status(200).json({
    status: "success",
    totalResults: users?.length,
    data: users,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("No user with that ID", 404));
  }

  const user = await User.findByIdAndDelete(id);

  res.status(200).json();
});

exports.markAsAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new AppError("No user with that ID", 404));
  }

  const newUser = await User.findByIdAndUpdate(id, { role: "admin" });

  res.status(200).json({
    status: "success",
    data: newUser,
  });
});
