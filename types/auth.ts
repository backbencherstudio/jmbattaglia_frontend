export type AuthRole = "ADMIN" | "CLIENT" | "USER" | string | null;

export interface IUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  role: AuthRole;
  permissions?: string[];
  isEmailVerified?: boolean;
  phone?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginParams {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
  user: IUser;
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: LoginData;
}

export interface RefreshTokenParams {
  refreshToken: string;
}

export interface RefreshTokenData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface RefreshTokenResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: RefreshTokenData;
}

export interface IApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data: T;
}

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages?: number;
  totalPages?: number;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data: T[];
  meta?: IPaginationMeta;
}
