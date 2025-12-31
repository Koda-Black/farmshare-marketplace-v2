import { httpRequest } from "./httpRequest";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  isVerified: boolean;
  isBanned: boolean;
  role: "vendor" | "buyer" | "admin";
  createdAt: string;
  updatedAt: string;
  created_at: string; // Add this to match User interface
  businessName?: string;
  businessAddress?: string;
  govtIdType?: string;
  govtIdNumber?: string;
  businessRegistrationNumber?: string;
  taxId?: string;
  verificationStatus?: string;
  settings?: any;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  businessName?: string;
  businessAddress?: string;
  avatarUrl?: string;
}

export class UserService {
  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await httpRequest.get<UserProfile>("/user/profile");
      return response;
    } catch (error: any) {
      console.error("Failed to fetch user profile:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch user profile");
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    try {
      const response = await httpRequest.patch<UserProfile>("/user/update", data);
      return response;
    } catch (error: any) {
      console.error("Failed to update user profile:", error);
      throw new Error(error.response?.data?.message || "Failed to update user profile");
    }
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await httpRequest.post<{ avatarUrl: string }>("/user/avatar", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error: any) {
      console.error("Failed to upload avatar:", error);
      throw new Error(error.response?.data?.message || "Failed to upload avatar");
    }
  }
}

export const userService = new UserService();