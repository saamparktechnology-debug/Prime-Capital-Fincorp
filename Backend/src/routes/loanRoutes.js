// src/routes/loanRoutes.js
const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/authMiddleware");
const {
  createLoan,
  updateLoan,
  updateLoanStatusByAdmin,
  generateEMISchedule,
  getLoans,
} = require("../controllers/loanController");

// All loan routes require authentication
router.use(authenticateToken);

router.post("/", createLoan);
router.get("/", getLoans);
router.put("/:loanId", updateLoan);
router.post("/:loanId/generate-emis", requireAdmin, generateEMISchedule);
router.patch("/:loanId/status", requireAdmin, updateLoanStatusByAdmin);

module.exports = router;
