"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { PDFUploader } from "@/components/pdf-uploader";
import { CertificateCard } from "@/components/certificate-card";
import { VerificationStatus } from "@/components/verification-status";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const verifyToken = searchParams.get("verifyCert");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (verifyToken) {
      verifyCertificate(verifyToken);
    }
  }, [verifyToken]);

  async function verifyCertificate(token: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ valid: false, error: "Network error occurred." });
    } finally {
      setLoading(false);
    }
  }

  const resetVerification = () => {
    setResult(null);
    window.history.replaceState(null, "", "/");
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-[400px] w-full rounded-xl bg-primary/10" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 bg-primary/10" />
            <Skeleton className="h-4 w-1/2 bg-primary/10" />
          </div>
        </div>
        <p className="text-primary font-mono animate-pulse">
          Verifying Cryptographic Signature...
        </p>
      </div>
    );
  }

  // 2. Result State
  if (result) {
    return (
      <div className="flex flex-col items-center space-y-6 w-full max-w-4xl px-4 animate-in slide-in-from-bottom-10 duration-700">
        <VerificationStatus valid={result.valid} error={result.error} />
        
        {result.valid && result.payload && (
          <CertificateCard data={result.payload} />
        )}

        <Button 
          onClick={resetVerification}
          variant="outline" 
          className="mt-8 border-primary/20 hover:bg-primary/10 text-primary"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Verify Another Certificate
        </Button>
      </div>
    );
  }

  // 3. Initial / Upload State
  return (
    <div className="flex flex-col items-center space-y-8 z-20 w-full px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#DE9F68] to-[#F9F9F0]">
          VeriCert
        </h1>
        <p className="text-muted-foreground text-sm md:text-base font-medium uppercase tracking-widest opacity-80">
          By BroCode
        </p>
      </div>
      
      <div className="w-full max-w-md">
        <PDFUploader />
      </div>

      <div className="absolute bottom-8 opacity-50">
         <Image 
            src="/logo.png" 
            alt="BroCode Logo" 
            width={40} 
            height={40} 
            className="grayscale hover:grayscale-0 transition-all duration-300"
         />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <BackgroundRippleEffect className="bg-[#361E19]">
      <Suspense fallback={<div className="text-[#DE9F68]">Loading...</div>}>
        <VerifyContent />
      </Suspense>
    </BackgroundRippleEffect>
  );
}
