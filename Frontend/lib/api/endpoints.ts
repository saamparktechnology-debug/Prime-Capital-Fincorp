// lib/api/endpoints.ts

/**
 * Single source of truth for all backend API paths.
 * Base URL comes from NEXT_PUBLIC_API_URL (see lib/config/env.ts).
 */

export const ENDPOINTS = {
  // ---------- Auth ----------
  AUTH: {
    LOGIN: "/auth/login",
    VERIFY_OTP: "/auth/verify-otp",
  },

  // ---------- Customers ----------
  CUSTOMERS: {
    LIST: "/customers",
    CREATE: "/customers",
    DETAIL: (id: number | string) => `/customers/${id}`,
  },

  // ---------- KYC ----------
  KYC: {
    REVIEW: (customerId: number | string) => `/kyc/${customerId}/review`,
    RESUBMIT: (customerId: number | string) => `/kyc/${customerId}/resubmit`,
    UPLOAD_DOCUMENT: (customerId: number | string) =>
      `/kyc/${customerId}/documents`,
    LIST_DOCUMENTS: (customerId: number | string) =>
      `/kyc/${customerId}/documents`,
    DELETE_DOCUMENT: (
      customerId: number | string,
      documentId: number | string,
    ) => `/kyc/${customerId}/documents/${documentId}`,
  },

  // ---------- Loans ----------
  LOANS: {
    LIST: "/loans",
    CREATE: "/loans",
    UPDATE: (loanId: number | string) => `/loans/${loanId}`,
    UPDATE_STATUS: (loanId: number | string) => `/loans/${loanId}/status`,
  },

  // ---------- EMIs ----------
  EMIS: {
    BY_LOAN: (loanId: number | string) => `/emis/loan/${loanId}`,
    UPDATE_STATUS: (emiId: number | string) => `/emis/${emiId}/status`,
    UPCOMING: "/emis/upcoming",
    SEND_REMINDER: (emiId: number | string) => `/emis/${emiId}/send-reminder`,
  },

  AGENTS: {
    LIST: "/agents",
    CREATE: "/agents",
    DETAIL: (id: number | string) => `/agents/${id}`,
    GET_PERMISSIONS: (id: number | string) => `/agents/${id}/permissions`,
    TOGGLE_STATUS: (id: number | string) => `/agents/${id}/status`,
    UPDATE_PERMISSIONS: (id: number | string) => `/agents/${id}/permissions`,
  },

  AGENT_KYC: {
    ME: "/agent-kyc/me",
    DETAIL: (agentId: number | string) => `/agent-kyc/${agentId}`,
    UPDATE: (agentId: number | string) => `/agent-kyc/${agentId}`,
    REVIEW: (agentId: number | string) => `/agent-kyc/${agentId}/review`,
    LIST_DOCUMENTS: (agentId: number | string) =>
      `/agent-kyc/${agentId}/documents`,
    UPLOAD_DOCUMENT: (agentId: number | string) =>
      `/agent-kyc/${agentId}/documents`,
    DELETE_DOCUMENT: (agentId: number | string, documentId: number | string) =>
      `/agent-kyc/${agentId}/documents/${documentId}`,
  },

  // ---------- Banks ----------
  BANKS: {
    LIST: "/banks",
    CREATE: "/banks",
    DETAIL: (id: number | string) => `/banks/${id}`,
    UPDATE: (id: number | string) => `/banks/${id}`,
  },

  // ---------- Analytics ----------
  ANALYTICS: {
    AGENT_DASHBOARD: "/analytics/agent-dashboard",
    ADMIN_AGENTS_OVERVIEW: "/analytics/admin/agents-overview",
    ADMIN_AGENT_SUMMARY: (agentId: number | string) =>
      `/analytics/admin/agents/${agentId}/summary`,

    // Business-wide
    BUSINESS_KPIS: "/analytics/business/kpis",
    BUSINESS_FUNNEL: "/analytics/business/funnel",
    BUSINESS_COLLECTIONS_TREND: "/analytics/business/collections-trend",
    BUSINESS_CUSTOMER_TREND: "/analytics/business/customer-trend",
    BUSINESS_BANK_DISTRIBUTION: "/analytics/business/bank-distribution",
    BUSINESS_OVERDUE_AGING: "/analytics/business/overdue-aging",
    BUSINESS_RECENT_ACTIVITY: "/analytics/business/recent-activity",
    BUSINESS_TOP_CUSTOMERS: "/analytics/business/top-customers",
  },

  // ---------- Reports ----------
  REPORTS: {
    FETCH: (reportType: string) => `/reports/${reportType}`,
  },

  // ---------- Audit Logs ----------
  AUDIT: {
    LIST: "/audits",
  },

  // ---------- Health ----------
  HEALTH: "/health",
} as const;
