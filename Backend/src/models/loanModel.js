// src/models/loanModel.js
const pool = require("../config/db");

const LoanModel = {
  async checkCustomerKycApproved(customerId) {
    const [rows] = await pool.query(
      "SELECT kyc_status FROM customers WHERE customer_id = ?",
      [customerId],
    );
    return rows[0] && rows[0].kyc_status === "approved";
  },

  async create(loanData, agentId) {
    const query = `
    INSERT INTO loans (
      customer_id, loan_type, agent_id, bank_id,
      requested_amount, tenure_months, interest_rate, interest_type, purpose, loan_status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Applied')
  `;
    const values = [
      loanData.customer_id,
      loanData.loan_type,
      agentId,
      loanData.bank_id || null,
      loanData.requested_amount,
      loanData.tenure_months,
      loanData.interest_rate,
      loanData.interest_type || "flat",
      loanData.purpose,
    ];
    const [result] = await pool.query(query, values);
    return result.insertId;
  },

  async updateLoanByAgent(loanId, loanData) {
    const query = `
    UPDATE loans
    SET loan_type = ?,
        requested_amount = ?,
        tenure_months = ?,
        interest_rate = ?,
        interest_type = COALESCE(?, interest_type),
        purpose = ?,
        bank_id = COALESCE(?, bank_id)
    WHERE loan_id = ? AND loan_status IN ('Draft', 'Applied', 'Under Review')
  `;
    const [result] = await pool.query(query, [
      loanData.loan_type,
      loanData.requested_amount,
      loanData.tenure_months,
      loanData.interest_rate,
      loanData.interest_type ?? null,
      loanData.purpose,
      loanData.bank_id ?? null,
      loanId,
    ]);
    return result.affectedRows > 0;
  },

  async findById(loanId) {
    const [rows] = await pool.query(
      `SELECT l.*, b.bank_name, b.short_code AS bank_short_code
       FROM loans l
       LEFT JOIN banks b ON l.bank_id = b.bank_id
       WHERE l.loan_id = ?`,
      [loanId],
    );
    return rows[0] || null;
  },

  async updateLoanStatusByAdmin(
    loanId,
    status,
    approvedAmount = null,
    bankRef = null,
    rejectionReason = null,
    bankId = null,
  ) {
    const query = `
      UPDATE loans
      SET loan_status = ?,
          approved_amount = ?,
          bank_reference_number = ?,
          rejection_reason = ?,
          bank_id = COALESCE(?, bank_id)
      WHERE loan_id = ?
    `;
    const [result] = await pool.query(query, [
      status,
      approvedAmount,
      bankRef,
      rejectionReason,
      bankId,
      loanId,
    ]);
    return result.affectedRows > 0;
  },

  async findAll(role, agentId) {
    let query = `
    SELECT 
      l.*,
      b.bank_name, 
      b.short_code AS bank_short_code,
      c.first_name, 
      c.last_name,
      c.primary_phone,
      a.full_name AS agent_name
    FROM loans l
    LEFT JOIN banks b ON l.bank_id = b.bank_id
    LEFT JOIN customers c ON l.customer_id = c.customer_id
    LEFT JOIN agents a ON l.agent_id = a.agent_id
  `;
    const params = [];

    if (role === "agent") {
      query += " WHERE l.agent_id = ?";
      params.push(agentId);
    }
    query += " ORDER BY l.created_at DESC";

    const [loans] = await pool.query(query, params);
    return loans;
  },
};

module.exports = LoanModel;
