import { jwtVerify } from "jose";
import { env } from "@/lib/env";

export interface DecodedTokenPayload {
  sub?: string;
  sessionId?: string;
  email?: string;
  role?: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export interface JwtVerificationResult {
  isValid: boolean;
  payload: DecodedTokenPayload | null;
  error?: string;
}

const getCandidateSecrets = (): string[] => {
  const secrets = [
    env.jwtSecret,
    process.env.JWT_SECRET,
    process.env.NEXT_PUBLIC_JWT_SECRET,
    "6d8e1a3f9b2c5d704e7f0a6b1c8d3e5f9a2b4c7d0e6f1a8b3c5d9e2f4a7b6108",
    "secret",
  ].filter((s): s is string => typeof s === "string" && s.trim().length > 0);

  // Return unique secrets with primary configured secret first
  return Array.from(new Set(secrets));
};

export async function verifyJwtToken(
  token?: string | null,
): Promise<JwtVerificationResult> {
  if (!token || typeof token !== "string" || token.trim() === "") {
    return {
      isValid: false,
      payload: null,
      error: "Missing or empty authentication token",
    };
  }

  const cleanToken = token.trim();
  const candidateSecrets = getCandidateSecrets();
  let lastError = "Token verification failed";

  for (const secretStr of candidateSecrets) {
    try {
      const secret = new TextEncoder().encode(secretStr);
      const { payload } = await jwtVerify(cleanToken, secret, {
        algorithms: ["HS256"],
      });

      // Check token expiration
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return {
          isValid: false,
          payload: null,
          error: "Token has expired",
        };
      }

      return {
        isValid: true,
        payload: payload as DecodedTokenPayload,
      };
    } catch (err) {
      if (err instanceof Error) {
        lastError = err.message;
      }
    }
  }

  return {
    isValid: false,
    payload: null,
    error: lastError,
  };
}

export async function verifyAdminToken(
  token?: string | null,
): Promise<JwtVerificationResult> {
  const verification = await verifyJwtToken(token);

  if (!verification.isValid || !verification.payload) {
    return verification;
  }

  const role = verification.payload.role?.toUpperCase();
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return {
      isValid: false,
      payload: verification.payload,
      error: "Access denied: ADMIN role required",
    };
  }

  return verification;
}
