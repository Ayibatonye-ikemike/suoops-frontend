import { apiClient } from "./client";

export interface UpdateProfileRequest {
  name: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  name: string;
}

export async function updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
  const response = await apiClient.patch<UpdateProfileResponse>("/users/me", data);
  return response.data;
}
