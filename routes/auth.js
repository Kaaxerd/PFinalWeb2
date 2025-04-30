const express = require("express");
const { validateRegister, validateLogin, validateGetUser } = require("../validators/auth");
const { registerCtrl, loginCtrl, verifyEmailCtrl, getUserCtrl, updateUserCtrl, getUserFromTokenCtrl, deleteUserCtrl, forgotPasswordCtrl, resetPasswordCtrl } = require("../controllers/auth");
const handleValidator = require("../utils/handleValidator");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

router.post("/register", validateRegister, handleValidator, registerCtrl);
router.post("/verify-email", verifyEmailCtrl);
router.post("/login", validateLogin, loginCtrl);
router.put("/:id", updateUserCtrl);
router.get("/me", requireAuth, getUserFromTokenCtrl);
router.delete("/me", requireAuth, deleteUserCtrl);
router.post("/forgot-password", requireAuth, forgotPasswordCtrl);
router.patch("/reset-password", requireAuth, resetPasswordCtrl);

module.exports = router;