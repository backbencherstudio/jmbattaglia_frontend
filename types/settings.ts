export interface AdminProfile {
  id: number | string;
  email: string;
  name: string;
  role?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  requiresReauthentication?: boolean;
}

export interface TeamMember {
  id: string;
  email: string;
  role: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorEmail?: string;
  actorRole?: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
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
