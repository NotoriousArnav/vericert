import { importSPKI, jwtVerify } from "jose";

// To be secure, we always assume RS256 for certificate verification
const ALG = "RS256";

export interface VerificationResult {
  valid: boolean;
  payload?: any;
  error?: string;
}

/**
 * Verifies a JWT token using the stored Public Key (RS256) or a provided custom key.
 * This runs ONLY on the server side.
 */
export async function verifyCertificateToken(
  token: string,
  customPublicKey?: string
): Promise<VerificationResult> {
  try {
    const publicKeyPem = customPublicKey || process.env.JWT_PUBLIC_KEY;

    if (!publicKeyPem) {
      console.error("Missing JWT_PUBLIC_KEY environment variable and no custom key provided");
      return {
        valid: false,
        error: "Server configuration error: Public key not found.",
      };
    }

    // Import the public key
    const publicKey = await importSPKI(publicKeyPem, ALG);

    // Verify the token
    const { payload } = await jwtVerify(token, publicKey, {
      algorithms: [ALG],
    });

    return {
      valid: true,
      payload,
    };
  } catch (err: any) {
    console.error("JWT Verification failed:", err.message);

    // Distinguish between different error types if needed
    let errorMessage = "Certificate verification failed.";

    if (err.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
      errorMessage = "Invalid signature. This certificate may have been tampered with.";
    } else if (err.code === "ERR_JWT_EXPIRED") {
      errorMessage = "This certificate has expired."; // Likely not applicable for perma-certs, but good to handle
    } else if (err.code === "ERR_JWS_INVALID") {
      errorMessage = "Malformed certificate token.";
    }

    return {
      valid: false,
      error: errorMessage,
    };
  }
}
