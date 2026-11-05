export interface DecodedTokenPayload {
  sub?: string | number;
  email?: string;
  role?: string;
  permissions?: string[];
  [key: string]: unknown;
}

export interface JwtVerificationResult {
  isValid: boolean;
  payload: DecodedTokenPayload | null;
  error?: string;
}

/**
 * Checks if a token is a non-empty string.
 * Sanctum bearer tokens are opaque strings validated by the backend.
 */
export function isValidSanctumToken(token?: string | null): boolean {
  if (!token || typeof token !== "string" || token.trim() === "") {
    return false;
  }
  return true;
}

/**
 * Backward-compatible token verification helper for Sanctum opaque bearer tokens.
 * Backend endpoints enforce full token verification and expiration on every request.
 */
export async function verifyAdminToken(
  token?: string | null,
): Promise<JwtVerificationResult> {
  if (!isValidSanctumToken(token)) {
    return {
      isValid: false,
      payload: null,
      error: "Missing or empty authentication token",
    };
  }

  return {
    isValid: true,
    payload: null,
  };
}
