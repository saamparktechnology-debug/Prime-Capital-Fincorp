// src/controllers/bankController.js
const pool = require("../config/db");
const audit = require("../utils/auditLog");

// GET: Fetch all partner banks
const getAllBanks = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM banks ORDER BY bank_name ASC",
    );
    return res.status(200).json({
      status: "success",
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching banks:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
};

// GET: Fetch a single bank by ID
const getBankById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM banks WHERE bank_id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Bank not found." });
    }

    return res.status(200).json({
      status: "success",
      data: rows[0],
    });
  } catch (error) {
    console.error("Error fetching bank by ID:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
};

// POST: Create a new partner bank
const createBank = async (req, res) => {
  try {
    const { bank_name, short_code } = req.body;

    if (!bank_name) {
      return res
        .status(400)
        .json({ status: "fail", message: "Bank name is required." });
    }

    const [result] = await pool.query(
      "INSERT INTO banks (bank_name, short_code) VALUES (?, ?)",
      [bank_name, short_code || null],
    );

    // ---- Audit ----
    audit(req, "create", "bank", result.insertId, null, {
      bank_name,
      short_code: short_code || null,
    });

    return res.status(201).json({
      status: "success",
      message: "Bank created successfully.",
      data: {
        bank_id: result.insertId,
        bank_name,
        short_code,
        is_active: true,
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ status: "fail", message: "Bank name already exists." });
    }
    console.error("Error creating bank:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
};

// PUT: Update an existing partner bank
const updateBank = async (req, res) => {
  try {
    const { id } = req.params;
    const { bank_name, short_code, is_active } = req.body;

    const [existing] = await pool.query(
      "SELECT * FROM banks WHERE bank_id = ?",
      [id],
    );
    if (existing.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "Bank not found." });
    }

    const oldSnapshot = {
      bank_name: existing[0].bank_name,
      short_code: existing[0].short_code,
      is_active: existing[0].is_active,
    };

    await pool.query(
      `UPDATE banks 
       SET bank_name = COALESCE(?, bank_name), 
           short_code = COALESCE(?, short_code), 
           is_active = COALESCE(?, is_active) 
       WHERE bank_id = ?`,
      [bank_name, short_code, is_active, id],
    );

    // ---- Audit ----
    audit(req, "update", "bank", Number(id), oldSnapshot, {
      bank_name: bank_name ?? existing[0].bank_name,
      short_code: short_code ?? existing[0].short_code,
      is_active: is_active ?? existing[0].is_active,
    });

    return res.status(200).json({
      status: "success",
      message: "Bank updated successfully.",
    });
  } catch (error) {
    console.error("Error updating bank:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error." });
  }
};

module.exports = {
  getAllBanks,
  getBankById,
  createBank,
  updateBank,
};
