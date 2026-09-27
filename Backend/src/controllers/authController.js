// src/controllers/authController.js
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NotificationService = require("../services/notificationService");
const audit = require("../utils/auditLog");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const initiateLogin = async (req, res) => {
  const { email, password, role } = req.body;
  console.log(`[LOGIN ATTEMPT] Email: ${email}, Role: ${role}`);

  if (!email || !password || !role) {
    return res.status(400).json({
      status: "fail",
      message: "Email, password, and role are required.",
    });
  }

  try {
    let table = role === "admin" ? "admins" : "agents";
    let idField = role === "admin" ? "admin_id" : "agent_id";

    let query =
      role === "admin"
        ? `SELECT * FROM admins WHERE email = ?`
        : `SELECT * FROM agents WHERE email = ? AND is_active = TRUE`;

    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      audit(
        req,
        "login_failed",
        role,
        0,
        null,
        { email, reason: "user_not_found_or_inactive" },
        { actorType: "system", actorId: 0 },
      );
      return res.status(401).json({
        status: "fail",
        message: "Invalid credentials or inactive account.",
      });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      audit(
        req,
        "login_failed",
        role,
        user[idField],
        null,
        { email, reason: "wrong_password" },
        { actorType: role, actorId: user[idField] },
      );
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid credentials." });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `UPDATE ${table} SET otp_code = ?, otp_expires_at = ? WHERE ${idField} = ?`,
      [otp, expiresAt, user[idField]],
    );

    const emailSubject = "Your Microfinance System Login OTP";
    const emailHtml = `
      <h3>Hello ${user.full_name},</h3>
      <p>Your verification code for logging into the Microfinance Management System is:</p>
      <h1 style="color: #2563eb; letter-spacing: 2px;">${otp}</h1>
      <p>This code is valid for 10 minutes. Do not share it with anyone.</p>
    `;
    await NotificationService.sendEmail(email, emailSubject, emailHtml);

    if (user.phone_number || user.primary_phone) {
      const phone = user.phone_number || user.primary_phone;
      await NotificationService.sendSMS(
        phone,
        `Your Microfinance OTP is: ${otp}. Valid for 10 mins.`,
      );
    }

    console.log(`[OTP SERVICE] Dispatched OTP for ${email}: ${otp}`);

    return res.status(200).json({
      status: "success",
      message:
        "Credentials verified successfully. OTP has been sent to your email/SMS.",
      data: { email, channel: "Email/SMS" },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error during login.",
    });
  }
};

const verifyLoginOTP = async (req, res) => {
  const { email, otp, role } = req.body;

  console.log(`[OTP VERIFICATION] Email: ${email}, Role: ${role}`);

  if (!email || !otp || !role) {
    return res.status(400).json({
      status: "fail",
      message: "Email, OTP, and role are required.",
    });
  }

  try {
    let table = role === "admin" ? "admins" : "agents";
    let idField = role === "admin" ? "admin_id" : "agent_id";

    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE email = ?`, [
      email,
    ]);

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "User not found." });
    }

    const user = rows[0];

    if (!user.otp_code || user.otp_code !== otp) {
      audit(
        req,
        "otp_failed",
        role,
        user[idField],
        null,
        { email, reason: "invalid_otp" },
        { actorType: role, actorId: user[idField] },
      );
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid OTP code." });
    }

    if (new Date() > new Date(user.otp_expires_at)) {
      audit(
        req,
        "otp_failed",
        role,
        user[idField],
        null,
        { email, reason: "expired_otp" },
        { actorType: role, actorId: user[idField] },
      );
      return res.status(400).json({
        status: "fail",
        message: "OTP has expired. Please log in again.",
      });
    }

    await pool.query(
      `UPDATE ${table} SET otp_code = NULL, otp_expires_at = NULL WHERE ${idField} = ?`,
      [user[idField]],
    );

    const tokenPayload = {
      id: user[idField],
      role,
      email,
      fullName: user.full_name,
    };

    const accessToken = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "8h" },
    );

    // ---- Audit: successful login ----
    audit(
      req,
      "login",
      role,
      user[idField],
      null,
      { email, role, full_name: user.full_name },
      { actorType: role, actorId: user[idField] },
    );

    return res.status(200).json({
      status: "success",
      message: "Login successful via OTP verification.",
      data: {
        access_token: accessToken,
        user: tokenPayload,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error during OTP verification.",
    });
  }
};

const changePassword = async (req, res) => {
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    return res.status(400).json({
      status: "fail",
      message: "Current and new password are required.",
    });
  }

  if (new_password.length < 6) {
    return res.status(400).json({
      status: "fail",
      message: "New password must be at least 6 characters.",
    });
  }

  try {
    const role = req.user.role;
    const table = role === "admin" ? "admins" : "agents";
    const idField = role === "admin" ? "admin_id" : "agent_id";

    const [rows] = await pool.query(
      `SELECT password_hash FROM ${table} WHERE ${idField} = ?`,
      [req.user.id],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found." });
    }

    const valid = await bcrypt.compare(current_password, rows[0].password_hash);

    if (!valid) {
      audit(req, "password_change_failed", role, req.user.id, null, {
        reason: "wrong_current_password",
      });
      return res
        .status(401)
        .json({ status: "fail", message: "Current password is incorrect." });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    await pool.query(
      `UPDATE ${table} SET password_hash = ? WHERE ${idField} = ?`,
      [newHash, req.user.id],
    );

    audit(req, "password_change", role, req.user.id, null, null);

    return res
      .status(200)
      .json({ status: "success", message: "Password changed successfully." });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
};

module.exports = {
  initiateLogin,
  verifyLoginOTP,
  changePassword,
};
