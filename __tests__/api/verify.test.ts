/**
 * @jest-environment node
 */

// Mock jose before importing anything else
jest.mock("jose", () => ({
  importSPKI: jest.fn(),
  jwtVerify: jest.fn(),
}));

import { POST } from "@/app/api/verify/route";
import { NextRequest } from "next/server";
import { verifyCertificateToken } from "@/lib/jwt";

// Mock the JWT verification
jest.mock("@/lib/jwt");

const mockVerify = verifyCertificateToken as jest.MockedFunction<
  typeof verifyCertificateToken
>;

describe("POST /api/verify", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("with valid token", () => {
    it("should return valid result", async () => {
      const token = "valid.jwt.token";
      const payload = { name: "John Doe", iat: 1234567890 };

      mockVerify.mockResolvedValue({
        valid: true,
        payload,
      });

      const request = new NextRequest("http://localhost:3000/api/verify", {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(true);
      expect(data.payload).toEqual(payload);
    });

    it("should pass custom public key to verification", async () => {
      const token = "valid.jwt.token";
      const customKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjAN...";
      const payload = { name: "Jane Doe" };

      mockVerify.mockResolvedValue({
        valid: true,
        payload,
      });

      const request = new NextRequest("http://localhost:3000/api/verify", {
        method: "POST",
        body: JSON.stringify({ token, publicKey: customKey }),
      });

      await POST(request);

      expect(mockVerify).toHaveBeenCalledWith(token, customKey);
    });
  });

  describe("with invalid token", () => {
    it("should return invalid result with error message", async () => {
      const token = "invalid.jwt.token";
      const errorMsg = "Invalid signature. This certificate may have been tampered with.";

      mockVerify.mockResolvedValue({
        valid: false,
        error: errorMsg,
      });

      const request = new NextRequest("http://localhost:3000/api/verify", {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(false);
      expect(data.error).toBe(errorMsg);
    });

    it("should handle expired token", async () => {
      const token = "expired.jwt.token";
      const errorMsg = "This certificate has expired.";

      mockVerify.mockResolvedValue({
        valid: false,
        error: errorMsg,
      });

      const request = new NextRequest("http://localhost:3000/api/verify", {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.valid).toBe(false);
      expect(data.error).toBe(errorMsg);
    });

    it("should handle malformed token", async () => {
      const token = "malformed";
      const errorMsg = "Malformed certificate token.";

      mockVerify.mockResolvedValue({
        valid: false,
        error: errorMsg,
      });

      const request = new NextRequest("http://localhost:3000/api/verify", {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.valid).toBe(false);
      expect(data.error).toBe(errorMsg);
    });
  });

  describe("error handling", () => {
    it("should return 400 when no token provided", async () => {
      const request = new NextRequest("http://localhost:3000/api/verify", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.valid).toBe(false);
      expect(data.error).toBe("No token provided.");
    });

    it("should return 400 when body is empty", async () => {
      const request = new NextRequest("http://localhost:3000/api/verify", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it("should handle JSON parse errors with 500", async () => {
      const request = new NextRequest("http://localhost:3000/api/verify", {
        method: "POST",
        body: "invalid json",
      });

      // This will throw during JSON parsing
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.valid).toBe(false);
      expect(data.error).toBe("Internal server error.");
    });
  });

  describe("request body parsing", () => {
    it("should correctly extract token from request body", async () => {
      const token = "test.token.here";
      mockVerify.mockResolvedValue({
        valid: true,
        payload: { test: true },
      });

      const request = new NextRequest("http://localhost:3000/api/verify", {
        method: "POST",
        body: JSON.stringify({ token, extra: "field" }),
      });

      await POST(request);

      expect(mockVerify).toHaveBeenCalledWith(token, undefined);
    });

    it("should handle request with null publicKey", async () => {
      const token = "test.token.here";
      mockVerify.mockResolvedValue({
        valid: true,
        payload: { test: true },
      });

      const request = new NextRequest("http://localhost:3000/api/verify", {
        method: "POST",
        body: JSON.stringify({ token, publicKey: null }),
      });

      await POST(request);

      expect(mockVerify).toHaveBeenCalledWith(token, null);
    });

    it("should handle request with empty string publicKey", async () => {
      const token = "test.token.here";
      mockVerify.mockResolvedValue({
        valid: true,
        payload: { test: true },
      });

      const request = new NextRequest("http://localhost:3000/api/verify", {
        method: "POST",
        body: JSON.stringify({ token, publicKey: "" }),
      });

      await POST(request);

      expect(mockVerify).toHaveBeenCalledWith(token, "");
    });
  });

  describe("response format", () => {
    it("should return JSON response", async () => {
      const token = "valid.jwt.token";
      mockVerify.mockResolvedValue({
        valid: true,
        payload: { test: true },
      });

      const request = new NextRequest("http://localhost:3000/api/verify", {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      const response = await POST(request);

      expect(response.headers.get("content-type")).toContain("application/json");
    });

    it("should include payload in successful response", async () => {
      const token = "valid.jwt.token";
      const expectedPayload = {
        name: "Test User",
        email: "test@example.com",
        iat: 1234567890,
      };

      mockVerify.mockResolvedValue({
        valid: true,
        payload: expectedPayload,
      });

      const request = new NextRequest("http://localhost:3000/api/verify", {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.payload).toEqual(expectedPayload);
    });
  });
});
