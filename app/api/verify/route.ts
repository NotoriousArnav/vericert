import { NextRequest, NextResponse } from "next/server";
import { verifyCertificateToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "No token provided." },
        { status: 400 }
      );
    }

    const result = await verifyCertificateToken(token);

    if (result.valid) {
      return NextResponse.json(result);
    } else {
      // Even if invalid, we return 200 OK because the "check" succeeded,
      // but the certificate itself is invalid.
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { valid: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
