// src/models/dashboardModel.js
const pool = require("../config/db");

// ---------- Date range helper (mirrors analytics) ----------
const buildRange = (range, customStart, customEnd) => {
  const today = new Date();
  const fmt = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  let start = null;
  let end = fmt(today);

  switch (range) {
    case "today":
      start = fmt(today);
      break;
    case "this_month": {
      const s = new Date(today.getFullYear(), today.getMonth(), 1);
      start = fmt(s);
      break;
    }
    case "this_fy": {
      const y = today.getFullYear();
      const fyStartYear = today.getMonth() >= 3 ? y : y - 1;
      start = fmt(new Date(fyStartYear, 3, 1));
      break;
    }
    case "custom":
      start = customStart || null;
      end = customEnd || end;
      break;
    default:
      start = null;
  }

  if (start) {
    return { clause: ` AND DATE(${""}) >= ? AND DATE(${""}) <= ?`, start, end };
  }
  return { start: null, end: null };
};

const DashboardModel = {
  /**
   * Master summary for the top KPI cards.
   */
  async getSummary(range = "this_month", customStart, customEnd) {
    const { start, end } = buildRange(range, customStart, customEnd);
    const rangeClause = start
      ? " AND DATE(created_at) >= ? AND DATE(created_at) <= ?"
      : "";
    const rangeParams = start ? [start, end] : [];

    // Customers
    const [custTotal] = await pool.query(
      `SELECT COUNT(*) AS total FROM customers`,
    );
    const [custNew] = await pool.query(
      `SELECT COUNT(*) AS new_in_period FROM customers WHERE 1=1 ${rangeClause}`,
      rangeParams,
    );
    const [kycCounts] = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN kyc_status='approved' THEN 1 ELSE 0 END),0) AS approved,
        COALESCE(SUM(CASE WHEN kyc_status='pending' THEN 1 ELSE 0 END),0) AS pending,
        COALESCE(SUM(CASE WHEN kyc_status='rejected' THEN 1 ELSE 0 END),0) AS rejected
      FROM customers
    `);

    // Agents
    const [agentTotal] = await pool.query(
      `SELECT COUNT(*) AS total FROM agents`,
    );
    const [agentActive] = await pool.query(
      `SELECT COUNT(*) AS active FROM agents WHERE is_active = TRUE`,
    );
    const [agentNew] = await pool.query(
      `SELECT COUNT(*) AS new_in_period FROM agents WHERE 1=1 ${rangeClause}`,
      rangeParams,
    );

    // Banks
    const [bankTotal] = await pool.query(`SELECT COUNT(*) AS total FROM banks`);
    const [bankActive] = await pool.query(
      `SELECT COUNT(*) AS active FROM banks WHERE is_active = TRUE`,
    );

    // Loans
    const [loanTotals] = await pool.query(`
      SELECT 
        COUNT(*) AS total,
        COALESCE(SUM(CASE WHEN loan_status IN ('Active','Disbursed') THEN 1 ELSE 0 END),0) AS active,
        COALESCE(SUM(CASE WHEN loan_status IN ('Disbursed','Active','Completed') THEN approved_amount ELSE 0 END),0) AS total_disbursed
      FROM loans
    `);
    const [loanNew] = await pool.query(
      `SELECT COUNT(*) AS new_in_period FROM loans WHERE 1=1 ${rangeClause}`,
      rangeParams,
    );

    // Collections
    const [collAllTime] = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN status='Paid' THEN emi_amount ELSE 0 END),0) AS collected_all_time,
        COALESCE(SUM(CASE WHEN status IN ('Pending','Overdue') THEN emi_amount ELSE 0 END),0) AS outstanding,
        COALESCE(SUM(CASE WHEN status='Overdue' THEN emi_amount ELSE 0 END),0) AS overdue
      FROM repayment_emis
    `);
    const [collPeriod] = await pool.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN status='Paid' THEN emi_amount ELSE 0 END),0) AS collected_in_period
       FROM repayment_emis
       WHERE 1=1 ${start ? "AND DATE(paid_date) >= ? AND DATE(paid_date) <= ?" : ""}`,
      rangeParams,
    );

    return {
      customers: {
        total: Number(custTotal[0].total ?? 0),
        new_in_period: Number(custNew[0].new_in_period ?? 0),
      },
      kyc: {
        approved: Number(kycCounts[0].approved ?? 0),
        pending: Number(kycCounts[0].pending ?? 0),
        rejected: Number(kycCounts[0].rejected ?? 0),
      },
      agents: {
        total: Number(agentTotal[0].total ?? 0),
        active: Number(agentActive[0].active ?? 0),
        new_in_period: Number(agentNew[0].new_in_period ?? 0),
      },
      banks: {
        total: Number(bankTotal[0].total ?? 0),
        active: Number(bankActive[0].active ?? 0),
      },
      loans: {
        total: Number(loanTotals[0].total ?? 0),
        active: Number(loanTotals[0].active ?? 0),
        total_disbursed: Number(loanTotals[0].total_disbursed ?? 0),
        new_in_period: Number(loanNew[0].new_in_period ?? 0),
      },
      collections: {
        collected_all_time: Number(collAllTime[0].collected_all_time ?? 0),
        collected_in_period: Number(collPeriod[0].collected_in_period ?? 0),
        outstanding: Number(collAllTime[0].outstanding ?? 0),
        overdue: Number(collAllTime[0].overdue ?? 0),
      },
    };
  },

  /**
   * Recent loans across the business (with customer name + bank).
   */
  async getRecentLoans(limit = 5) {
    const [rows] = await pool.query(
      `SELECT l.loan_id, l.customer_id, l.loan_type, l.requested_amount,
              l.approved_amount, l.loan_status, l.created_at,
              c.first_name, c.last_name, c.primary_phone,
              b.bank_name
       FROM loans l
       JOIN customers c ON l.customer_id = c.customer_id
       LEFT JOIN banks b ON l.bank_id = b.bank_id
       ORDER BY l.created_at DESC
       LIMIT ?`,
      [limit],
    );
    return rows;
  },

  /**
   * Top banks by disbursed amount.
   */
  async getBankBreakdown(limit = 5) {
    const [rows] = await pool.query(
      `SELECT 
         b.bank_id, b.bank_name, b.short_code, b.is_active,
         COUNT(l.loan_id) AS loan_count,
         COALESCE(SUM(CASE WHEN l.loan_status IN ('Disbursed','Active','Completed') 
                          THEN l.approved_amount ELSE 0 END),0) AS total_disbursed
       FROM banks b
       LEFT JOIN loans l ON b.bank_id = l.bank_id
       GROUP BY b.bank_id
       ORDER BY total_disbursed DESC
       LIMIT ?`,
      [limit],
    );
    return rows;
  },

  /**
   * Compact agent performance (top N by portfolio).
   */
  async getAgentPerformanceMini(limit = 5) {
    const [rows] = await pool.query(
      `SELECT 
         a.agent_id, a.full_name, a.email, a.is_active,
         COUNT(DISTINCT c.customer_id) AS total_customers,
         COUNT(DISTINCT l.loan_id) AS total_loans,
         COALESCE(SUM(CASE WHEN l.loan_status IN ('Disbursed','Active') 
                          THEN l.approved_amount ELSE 0 END),0) AS portfolio_value
       FROM agents a
       LEFT JOIN customers c ON a.agent_id = c.agent_id
       LEFT JOIN loans l ON a.agent_id = l.agent_id
       GROUP BY a.agent_id
       ORDER BY portfolio_value DESC, total_customers DESC
       LIMIT ?`,
      [limit],
    );
    return rows;
  },

  /**
   * Monthly collections (last N months) for the bar chart.
   */
  async getCollectionsMonthly(months = 6) {
    const [rows] = await pool.query(
      `SELECT 
         DATE_FORMAT(due_date, '%Y-%m') AS month,
         COALESCE(SUM(CASE WHEN status='Paid' THEN emi_amount ELSE 0 END),0) AS collected
       FROM repayment_emis
       WHERE due_date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
       GROUP BY month
       ORDER BY month ASC`,
      [months],
    );
    return rows;
  },

  /**
   * Customer acquisition trend (last N months).
   */
  async getCustomerTrendMonthly(months = 6) {
    const [rows] = await pool.query(
      `SELECT 
         DATE_FORMAT(created_at, '%Y-%m') AS month,
         COUNT(*) AS count
       FROM customers
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
       GROUP BY month
       ORDER BY month ASC`,
      [months],
    );
    return rows;
  },
};

module.exports = DashboardModel;
