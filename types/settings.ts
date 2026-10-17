export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  requiresReauthentication?: boolean;
}

export interface AdminProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminProfile;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  profilePicture?: File | null;
  removeProfilePicture?: boolean;
}

export interface UpdateProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AdminProfile;
}

export interface UserProfileData {
  name: string;
  email: string;
  avatarUrl: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
