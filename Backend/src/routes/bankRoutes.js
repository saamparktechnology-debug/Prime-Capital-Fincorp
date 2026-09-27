// src/routes/bankRoutes.js
const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/authMiddleware");
const {
  getAllBanks,
  getBankById,
  createBank,
  updateBank,
} = require("../controllers/bankController");

// All bank routes require authentication
router.use(authenticateToken);

// Read — Admin + Agent
router.get("/", getAllBanks);
router.get("/:id", getBankById);

// Write — Admin only
router.post("/", requireAdmin, createBank);
router.put("/:id", requireAdmin, updateBank);

module.exports = router;
