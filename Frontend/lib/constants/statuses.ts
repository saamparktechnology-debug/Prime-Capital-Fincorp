// lib/constants/statuses.ts

// ---------- KYC ----------
export const KYC_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type KycStatus = (typeof KYC_STATUS)[keyof typeof KYC_STATUS];

export const KYC_STATUS_LABELS: Record<KycStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

// ---------- Loan ----------
export const LOAN_STATUS = {
  DRAFT: "Draft",
  APPLIED: "Applied",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  DISBURSED: "Disbursed",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
} as const;

export type LoanStatus = (typeof LOAN_STATUS)[keyof typeof LOAN_STATUS];

export const LOAN_STATUS_LIST: LoanStatus[] = Object.values(LOAN_STATUS);

// Agent can edit only in these statuses (mirrors backend DECISION-009)
export const LOAN_STATUS_EDITABLE_BY_AGENT: LoanStatus[] = [
  LOAN_STATUS.DRAFT,
  LOAN_STATUS.APPLIED,
  LOAN_STATUS.UNDER_REVIEW,
];

// ---------- EMI ----------
export const EMI_STATUS = {
  PENDING: "Pending",
  PAID: "Paid",
  OVERDUE: "Overdue",
} as const;

export type EmiStatus = (typeof EMI_STATUS)[keyof typeof EMI_STATUS];

export const EMI_STATUS_LIST: EmiStatus[] = Object.values(EMI_STATUS);

// ---------- Loan types (extend as business grows) ----------
export const LOAN_TYPES = [
  "Personal",
  "Business",
  "Emergency",
  "Education",
  "Agriculture",
  "Home Improvement",
] as const;

export type LoanType = (typeof LOAN_TYPES)[number];

// ---------- Roles ----------
export const ROLE = {
  ADMIN: "admin",
  AGENT: "agent",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];
