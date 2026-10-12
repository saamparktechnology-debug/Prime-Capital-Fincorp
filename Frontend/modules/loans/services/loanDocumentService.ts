import { api, unwrap } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

const LOANS_BASE = "/loans";

export type LoanDocType =
  | "aadhaar"
  | "aadhaar_back"
  | "pan"
  | "business_reg"
  | "udyam"
  | "bank_statement"
  | "nominee";

export interface DocumentChecklistItem {
  doc_type: LoanDocType;
  label: string;
  path: string | null;
  uploaded: boolean;
  /** Only present for bank_statement */
  password?: string | null;
}

export interface DocumentChecklist {
  loan_id: number;
  loan_type: string;
  loan_status: string;
  checklist: DocumentChecklistItem[];
  all_uploaded: boolean;
  uploaded_count: number;
  total_required: number;
}

export const loanDocumentService = {
  async getChecklist(loanId: number | string): Promise<DocumentChecklist> {
    const res = await api.get(`${LOANS_BASE}/${loanId}/documents/status`);
    return unwrap<DocumentChecklist>(res);
  },

  async upload(
    loanId: number | string,
    docType: string,
    file: File,
  ): Promise<{ doc_type: string; file_path: string }> {
    const formData = new FormData();
    formData.append("document", file);
    const res = await api.post(
      `${LOANS_BASE}/${loanId}/documents/${docType}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return unwrap(res);
  },

  async remove(loanId: number | string, docType: string): Promise<void> {
    await api.delete(`${LOANS_BASE}/${loanId}/documents/${docType}`);
  },

  async setBankStatementPassword(
    loanId: number | string,
    password: string | null,
  ): Promise<void> {
    await api.patch(ENDPOINTS.LOANS.BANK_STATEMENT_PASSWORD(loanId), {
      password,
    });
  },
};
