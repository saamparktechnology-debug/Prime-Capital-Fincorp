// modules/auth/services/authService.ts
import { api, unwrap } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type {
  LoginPayload,
  LoginResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "../types";

export const authService = {
  /**
   * Step 1: email + password + role → backend generates OTP, sends email/SMS.
   * No JWT issued at this step.
   */
  async initiateLogin(payload: LoginPayload): Promise<LoginResponse> {
    const res = await api.post(ENDPOINTS.AUTH.LOGIN, payload);
    return unwrap<LoginResponse>(res);
  },

  /**
   * Step 2: email + otp + role → backend validates OTP, returns JWT + user.
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
    const res = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, payload);
    return unwrap<VerifyOtpResponse>(res);
  },
};
