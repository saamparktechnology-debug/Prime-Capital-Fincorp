// lib/types/bank.ts

export interface Bank {
  bank_id: number;
  bank_name: string;
  short_code?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBankPayload {
  bank_name: string;
  short_code?: string;
}

export interface UpdateBankPayload {
  bank_name?: string;
  short_code?: string;
  is_active?: boolean;
}
