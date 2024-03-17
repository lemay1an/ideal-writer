const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:token", authController.resetPassword);
router.post("/signup", authController.signUp);
router.post("/login", authController.logIn);

router.delete("/deleteUser/:id", authController.deleteUser);
router.patch("/markAsAdmin/:id", authController.markAsAdmin);

router.use(authController.protect);
router.delete("/delete/me", authController.deleteMe);
router.patch("/password/update", authController.updatePassword);
router.get("/logout", authController.logOut);
router.patch(
  "/updateMe",
  authController.uploadUserPhoto,
  authController.resizeUserPhoto,
  authController.updateMe
);
router.get("/getUsers", authController.getAllUsers);
module.exports = router;
