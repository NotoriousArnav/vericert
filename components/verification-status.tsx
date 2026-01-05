"use client";

import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VerificationStatusProps {
  valid: boolean;
  error?: string;
  className?: string;
}

export function VerificationStatus({ valid, error, className }: VerificationStatusProps) {
  if (valid) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 space-y-2 ${className}`}>
        <div className="p-3 rounded-full bg-green-500/10 text-green-500 mb-2 ring-1 ring-green-500/20">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-green-500">Certificate Verified</h2>
        <p className="text-muted-foreground text-center max-w-sm">
          This certificate has been cryptographically verified and is authentic.
        </p>
      </div>
    );
  }

  // Error / Invalid State
  return (
    <div className={`flex flex-col items-center justify-center p-6 space-y-2 ${className}`}>
      <div className="p-3 rounded-full bg-red-500/10 text-red-500 mb-2 ring-1 ring-red-500/20">
        <XCircle className="w-12 h-12" />
      </div>
      <h2 className="text-2xl font-bold text-red-500">Verification Failed</h2>
      <p className="text-muted-foreground text-center max-w-sm">
        {error || "This certificate could not be verified and may be invalid or tampered with."}
      </p>
      
      <div className="mt-4">
        <Badge variant="destructive" className="px-4 py-1 text-sm">
          <AlertTriangle className="w-3 h-3 mr-2 inline-block" />
          Invalid Signature
        </Badge>
      </div>
    </div>
  );
}
