export interface UserProfileData {
  name: string;
  email: string;
  avatarUrl: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
