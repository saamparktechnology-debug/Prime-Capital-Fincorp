// src/controllers/loanController.js
const LoanModel = require("../models/loanModel");
const EMIModel = require("../models/emiModel");
const audit = require("../utils/auditLog");

/**
 * Agent / Admin: Create a Loan Application
 */
const createLoan = async (req, res) => {
  const {
    customer_id,
    loan_type,
    bank_id,
    requested_amount,
    tenure_months,
    interest_rate,
    interest_type,
    purpose,
  } = req.body;

  if (
    !customer_id ||
    !loan_type ||
    !requested_amount ||
    !tenure_months ||
    !interest_rate ||
    !purpose
  ) {
    return res.status(400).json({
      status: "fail",
      message: "All loan application fields including loan_type are required.",
    });
  }

  try {
    // KYC Approval Gate
    const isKycApproved = await LoanModel.checkCustomerKycApproved(customer_id);
    if (!isKycApproved) {
      return res.status(400).json({
        status: "fail",
        message:
          "Loan application denied. Customer KYC must be approved by Admin before applying for a loan.",
      });
    }

    // Determine assigned agent
    let agentId;
    if (req.user.role === "agent") {
      agentId = req.user.id;
    } else if (req.user.role === "admin") {
      agentId = req.body.agent_id;
      if (!agentId) {
        return res.status(400).json({
          status: "fail",
          message: "Admin must specify an agent_id for the loan.",
        });
      }
    } else {
      return res.status(403).json({
        status: "fail",
        message: "Unauthorized role for loan creation.",
      });
    }

    const loanId = await LoanModel.create(
      {
        customer_id,
        loan_type,
        bank_id: bank_id || null,
        requested_amount,
        tenure_months,
        interest_rate,
        interest_type: interest_type || "flat",
        purpose,
      },
      agentId,
    );

    // ---- Audit ----
    audit(req, "create", "loan", loanId, null, {
      customer_id,
      loan_type,
      bank_id: bank_id || null,
      requested_amount,
      tenure_months,
      interest_rate,
      interest_type: interest_type || "flat",
      agent_id: agentId,
    });

    return res.status(201).json({
      status: "success",
      message: "Loan application submitted successfully.",
      data: { loan_id: loanId, loan_status: "Applied" },
    });
  } catch (error) {
    console.error("Create Loan Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error while creating loan.",
    });
  }
};

/**
 * Agent / Admin: Update Loan Application
 */
const updateLoan = async (req, res) => {
  const { loanId } = req.params;
  const {
    loan_type,
    bank_id,
    requested_amount,
    tenure_months,
    interest_rate,
    interest_type,
    purpose,
  } = req.body;

  try {
    const loan = await LoanModel.findById(loanId);
    if (!loan) {
      return res
        .status(404)
        .json({ status: "fail", message: "Loan application not found." });
    }

    // Agent-only restrictions
    if (req.user.role === "agent") {
      if (loan.agent_id !== req.user.id) {
        return res.status(403).json({
          status: "fail",
          message: "Unauthorized access to this loan record.",
        });
      }
      const allowed = ["Draft", "Applied", "Under Review"];
      if (!allowed.includes(loan.loan_status)) {
        return res.status(400).json({
          status: "fail",
          message: `Loan cannot be modified. Current status is '${loan.loan_status}' (Updates allowed only before approval).`,
        });
      }
    }

    const oldSnapshot = {
      loan_type: loan.loan_type,
      bank_id: loan.bank_id,
      requested_amount: loan.requested_amount,
      tenure_months: loan.tenure_months,
      interest_rate: loan.interest_rate,
      interest_type: loan.interest_type,
      purpose: loan.purpose,
    };

    const success = await LoanModel.updateLoanByAgent(loanId, {
      loan_type: loan_type || loan.loan_type,
      bank_id: bank_id !== undefined ? bank_id : loan.bank_id,
      requested_amount: requested_amount || loan.requested_amount,
      tenure_months: tenure_months || loan.tenure_months,
      interest_rate: interest_rate || loan.interest_rate,
      interest_type: interest_type || loan.interest_type,
      purpose: purpose || loan.purpose,
    });

    if (!success) {
      return res.status(400).json({
        status: "fail",
        message: "Failed to update loan application.",
      });
    }

    // ---- Audit ----
    audit(req, "update", "loan", Number(loanId), oldSnapshot, {
      loan_type: loan_type || loan.loan_type,
      bank_id: bank_id !== undefined ? bank_id : loan.bank_id,
      requested_amount: requested_amount || loan.requested_amount,
      tenure_months: tenure_months || loan.tenure_months,
      interest_rate: interest_rate || loan.interest_rate,
      interest_type: interest_type || loan.interest_type,
      purpose: purpose || loan.purpose,
    });

    return res.status(200).json({
      status: "success",
      message: "Loan application updated successfully.",
    });
  } catch (error) {
    console.error("Update Loan Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error while updating loan.",
    });
  }
};

/**
 * Admin: Update Loan Status
 */
const updateLoanStatusByAdmin = async (req, res) => {
  const { loanId } = req.params;
  const {
    loan_status,
    approved_amount,
    bank_reference_number,
    rejection_reason,
    bank_id,
  } = req.body;

  const validStatuses = [
    "Draft",
    "Applied",
    "Under Review",
    "Approved",
    "Rejected",
    "Disbursed",
    "Active",
    "Completed",
    "Overdue",
    "Cancelled",
  ];

  if (!validStatuses.includes(loan_status)) {
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid loan status provided." });
  }

  if (loan_status === "Rejected" && !rejection_reason) {
    return res.status(400).json({
      status: "fail",
      message: "Rejection reason is required when rejecting a loan.",
    });
  }

  if (
    (loan_status === "Approved" || loan_status === "Disbursed") &&
    !bank_reference_number
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Bank reference number is required for approval/disbursement.",
    });
  }

  try {
    const loan = await LoanModel.findById(loanId);
    if (!loan) {
      return res
        .status(404)
        .json({ status: "fail", message: "Loan not found." });
    }

    const oldSnapshot = {
      loan_status: loan.loan_status,
      approved_amount: loan.approved_amount,
      bank_reference_number: loan.bank_reference_number,
      rejection_reason: loan.rejection_reason,
      bank_id: loan.bank_id,
    };

    const success = await LoanModel.updateLoanStatusByAdmin(
      loanId,
      loan_status,
      approved_amount || loan.approved_amount,
      bank_reference_number || loan.bank_reference_number,
      rejection_reason || loan.rejection_reason,
      bank_id || loan.bank_id,
    );

    if (!success) {
      return res
        .status(500)
        .json({ status: "error", message: "Failed to update loan status." });
    }

    // ---- Audit ----
    audit(req, "update_status", "loan", Number(loanId), oldSnapshot, {
      loan_status,
      approved_amount: approved_amount || loan.approved_amount,
      bank_reference_number:
        bank_reference_number || loan.bank_reference_number,
      rejection_reason: rejection_reason || loan.rejection_reason,
      bank_id: bank_id || loan.bank_id,
    });

    // Auto-generate EMI schedule on disbursement
    let emisGenerated = 0;
    if (loan_status === "Disbursed") {
      try {
        const existing = await EMIModel.findByLoanId(loanId);
        if (existing.length === 0) {
          const totalAmount =
            approved_amount || loan.approved_amount || loan.requested_amount;
          const startDate = new Date().toISOString().split("T")[0];

          await EMIModel.generateSchedule(
            loanId,
            loan.customer_id,
            loan.tenure_months,
            Number(totalAmount),
            startDate,
            Number(loan.interest_rate),
            loan.interest_type || "flat",
          );

          emisGenerated = loan.tenure_months;

          // ---- Audit: EMI generation ----
          audit(req, "generate_emis", "loan", Number(loanId), null, {
            installments: loan.tenure_months,
            total_amount: totalAmount,
            interest_type: loan.interest_type || "flat",
          });

          console.log(
            `[LOAN] Generated ${loan.tenure_months} EMIs for loan #${loanId}`,
          );
        }
      } catch (emiErr) {
        console.error("EMI generation failed (non-blocking):", emiErr.message);
      }
    }

    return res.status(200).json({
      status: "success",
      message: `Loan status successfully updated to '${loan_status}'.`,
      data: { loan_id: loanId, loan_status, emis_generated: emisGenerated },
    });
  } catch (error) {
    console.error("Update Loan Status Error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
};

/**
 * Get Loans (Scoped by Role)
 */
const getLoans = async (req, res) => {
  try {
    const loans = await LoanModel.findAll(req.user.role, req.user.id);
    return res.status(200).json({
      status: "success",
      count: loans.length,
      data: loans,
    });
  } catch (error) {
    console.error("Get Loans Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error while fetching loans.",
    });
  }
};

/**
 * Admin: Manually generate EMI schedule for a Disbursed/Active loan
 */
const generateEMISchedule = async (req, res) => {
  const { loanId } = req.params;

  try {
    const loan = await LoanModel.findById(loanId);
    if (!loan) {
      return res
        .status(404)
        .json({ status: "fail", message: "Loan not found." });
    }

    if (!["Disbursed", "Active"].includes(loan.loan_status)) {
      return res.status(400).json({
        status: "fail",
        message:
          "EMI schedule can only be generated for Disbursed or Active loans.",
      });
    }

    const existing = await EMIModel.findByLoanId(loanId);
    if (existing.length > 0) {
      return res.status(400).json({
        status: "fail",
        message: "EMI schedule already exists for this loan.",
      });
    }

    const totalAmount = loan.approved_amount || loan.requested_amount;
    const startDate = new Date().toISOString().split("T")[0];

    await EMIModel.generateSchedule(
      loanId,
      loan.customer_id,
      loan.tenure_months,
      Number(totalAmount),
      startDate,
      Number(loan.interest_rate),
      loan.interest_type || "flat",
    );

    // ---- Audit ----
    audit(req, "generate_emis", "loan", Number(loanId), null, {
      installments: loan.tenure_months,
      total_amount: totalAmount,
      interest_type: loan.interest_type || "flat",
      trigger: "manual",
    });

    return res.status(201).json({
      status: "success",
      message: `EMI schedule generated: ${loan.tenure_months} installments.`,
      data: {
        loan_id: loanId,
        installments: loan.tenure_months,
        total_amount: totalAmount,
        interest_type: loan.interest_type,
      },
    });
  } catch (error) {
    console.error("Generate EMI Schedule Error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
};

module.exports = {
  createLoan,
  updateLoan,
  updateLoanStatusByAdmin,
  getLoans,
  generateEMISchedule,
};
