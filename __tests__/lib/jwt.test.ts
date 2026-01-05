/**
 * @jest-environment node
 */

import { verifyCertificateToken, VerificationResult } from "@/lib/jwt";

// Mock the jose library
jest.mock("jose", () => ({
  importSPKI: jest.fn(),
  jwtVerify: jest.fn(),
}));

import { importSPKI, jwtVerify } from "jose";

const mockImportSPKI = importSPKI as jest.MockedFunction<typeof importSPKI>;
const mockJwtVerify = jwtVerify as jest.MockedFunction<typeof jwtVerify>;

describe("verifyCertificateToken", () => {
  const validPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2a2rwplBCXvhA8jFh3/E
-----END PUBLIC KEY-----`;

  const validToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature";

  const validPayload = {
    sub: "1234567890",
    name: "John Doe",
    iat: 1516239022,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variable
    delete process.env.JWT_PUBLIC_KEY;
  });

  describe("with valid token and custom public key", () => {
    it("should return valid result with payload", async () => {
      mockImportSPKI.mockResolvedValue("mockPublicKey" as any);
      mockJwtVerify.mockResolvedValue({
        payload: validPayload,
      } as any);

      const result = await verifyCertificateToken(validToken, validPublicKey);

      expect(result.valid).toBe(true);
      expect(result.payload).toEqual(validPayload);
      expect(result.error).toBeUndefined();
      expect(importSPKI).toHaveBeenCalledWith(validPublicKey, "RS256");
      expect(jwtVerify).toHaveBeenCalled();
    });
  });

  describe("with valid token and environment key", () => {
    it("should verify using JWT_PUBLIC_KEY environment variable", async () => {
      const envKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----`;

      process.env.JWT_PUBLIC_KEY = envKey;

      mockImportSPKI.mockResolvedValue("mockPublicKey" as any);
      mockJwtVerify.mockResolvedValue({
        payload: validPayload,
      } as any);

      const result = await verifyCertificateToken(validToken);

      expect(result.valid).toBe(true);
      expect(result.payload).toEqual(validPayload);
      expect(importSPKI).toHaveBeenCalledWith(envKey, "RS256");
    });
  });

  describe("error handling", () => {
    it("should return error when no public key is provided or in env", async () => {
      mockImportSPKI.mockResolvedValue("mockPublicKey" as any);

      const result = await verifyCertificateToken(validToken);

      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        "Server configuration error: Public key not found."
      );
      expect(result.payload).toBeUndefined();
    });

    it("should handle invalid signature error", async () => {
      const signatureError = new Error("Signature verification failed") as any;
      signatureError.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";

      mockImportSPKI.mockResolvedValue("mockPublicKey" as any);
      mockJwtVerify.mockRejectedValue(signatureError);

      const result = await verifyCertificateToken(validToken, validPublicKey);

      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        "Invalid signature. This certificate may have been tampered with."
      );
    });

    it("should handle expired token error", async () => {
      const expiredError = new Error("Token expired") as any;
      expiredError.code = "ERR_JWT_EXPIRED";

      mockImportSPKI.mockResolvedValue("mockPublicKey" as any);
      mockJwtVerify.mockRejectedValue(expiredError);

      const result = await verifyCertificateToken(validToken, validPublicKey);

      expect(result.valid).toBe(false);
      expect(result.error).toBe("This certificate has expired.");
    });

    it("should handle malformed token error", async () => {
      const malformedError = new Error("Malformed token") as any;
      malformedError.code = "ERR_JWS_INVALID";

      mockImportSPKI.mockResolvedValue("mockPublicKey" as any);
      mockJwtVerify.mockRejectedValue(malformedError);

      const result = await verifyCertificateToken(validToken, validPublicKey);

      expect(result.valid).toBe(false);
      expect(result.error).toBe("Malformed certificate token.");
    });

    it("should handle generic verification errors", async () => {
      const genericError = new Error("Unknown verification error");

      mockImportSPKI.mockResolvedValue("mockPublicKey" as any);
      mockJwtVerify.mockRejectedValue(genericError);

      const result = await verifyCertificateToken(validToken, validPublicKey);

      expect(result.valid).toBe(false);
      expect(result.error).toBe("Certificate verification failed.");
    });
  });

  describe("VerificationResult interface", () => {
    it("should have correct structure when valid", async () => {
      mockImportSPKI.mockResolvedValue("mockPublicKey" as any);
      mockJwtVerify.mockResolvedValue({
        payload: validPayload,
      } as any);

      const result: VerificationResult = await verifyCertificateToken(
        validToken,
        validPublicKey
      );

      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("payload");
      expect(result.valid).toBe(true);
    });

    it("should have correct structure when invalid", async () => {
      const error = new Error("Invalid") as any;
      error.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";

      mockImportSPKI.mockResolvedValue("mockPublicKey" as any);
      mockJwtVerify.mockRejectedValue(error);

      const result: VerificationResult = await verifyCertificateToken(
        validToken,
        validPublicKey
      );

      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("error");
      expect(result.valid).toBe(false);
    });
  });

  describe("algorithm enforcement", () => {
    it("should only accept RS256 algorithm", async () => {
      mockImportSPKI.mockResolvedValue("mockPublicKey" as any);
      mockJwtVerify.mockResolvedValue({
        payload: validPayload,
      } as any);

      await verifyCertificateToken(validToken, validPublicKey);

      // Verify jwtVerify was called with RS256 algorithm constraint
      expect(mockJwtVerify).toHaveBeenCalledWith(
        validToken,
        "mockPublicKey",
        { algorithms: ["RS256"] }
      );
    });
  });
});
