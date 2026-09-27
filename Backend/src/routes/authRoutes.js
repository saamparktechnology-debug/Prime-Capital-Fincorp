// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  initiateLogin,
  verifyLoginOTP,
  changePassword,
} = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Step 1 - Login with email and password to trigger OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@microfinance.com
 *               password:
 *                 type: string
 *                 example: AdminSecure123!
 *               role:
 *                 type: string
 *                 enum: [admin, agent]
 *                 example: admin
 *     responses:
 *       200:
 *         description: OTP successfully generated and sent.
 *       401:
 *         description: Invalid credentials.
 */
router.post("/login", initiateLogin);

router.post("/verify-otp", verifyLoginOTP);

router.post("/change-password", authenticateToken, changePassword);

module.exports = router;
