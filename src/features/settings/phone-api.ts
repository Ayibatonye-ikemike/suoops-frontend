/**
 * Phone Linking API Client
 *
 * Handles phone number addition for WhatsApp bot access.
 * Phone is auto-verified on save — no OTP needed.
 */

import { apiClient } from "@/api/client";

/**
 * Request to add/update phone number
 */
export interface AddPhoneRequest {
  phone: string;
  // Step-up code, required only when CHANGING an existing number.
  otp?: string;
}

/**
 * Response after saving phone number
 */
export interface PhoneVerificationResponse {
  detail: string;
  phone: string;
}

/**
 * Save phone number to account (auto-verified)
 *
 * @param request - Phone number to link
 * @returns Promise with save result
 */
export async function savePhone(request: AddPhoneRequest): Promise<PhoneVerificationResponse> {
  const response = await apiClient.post<PhoneVerificationResponse>("/users/me/phone", request);
  return response.data;
}

/**
 * Request a step-up code (sent to the CURRENT number/email) to authorise
 * changing the login phone number.
 */
export async function requestPhoneChangeOtp(): Promise<{ detail: string }> {
  const response = await apiClient.post<{ detail: string }>("/users/me/phone/request-otp");
  return response.data;
}

/**
 * Remove phone number from account
 *
 * @returns Promise with success message
 */
export async function removePhone(): Promise<{ detail: string }> {
  const response = await apiClient.delete<{ detail: string }>("/users/me/phone");
  return response.data;
}

// Legacy exports for backward compatibility
export const requestPhoneOTP = savePhone;
export async function verifyPhoneOTP(_request: { phone: string; otp: string }): Promise<PhoneVerificationResponse> {
  // No-op: phone is auto-verified on save now
  return { detail: "Phone verified", phone: _request.phone };
}
