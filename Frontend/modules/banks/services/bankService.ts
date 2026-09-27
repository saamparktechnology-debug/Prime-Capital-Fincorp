// modules/banks/services/bankService.ts
import { api, unwrap } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Bank, CreateBankPayload, UpdateBankPayload } from "../types";

export const bankService = {
  async list(): Promise<Bank[]> {
    const res = await api.get(ENDPOINTS.BANKS.LIST);
    return unwrap<Bank[]>(res);
  },

  async detail(id: number | string): Promise<Bank> {
    const res = await api.get(ENDPOINTS.BANKS.DETAIL(id));
    return unwrap<Bank>(res);
  },

  async create(payload: CreateBankPayload): Promise<Bank> {
    const res = await api.post(ENDPOINTS.BANKS.CREATE, payload);
    return unwrap<Bank>(res);
  },

  async update(id: number | string, payload: UpdateBankPayload): Promise<void> {
    await api.put(ENDPOINTS.BANKS.UPDATE(id), payload);
  },
};
