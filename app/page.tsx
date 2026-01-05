"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Vortex } from "@/components/ui/vortex";
import { PDFUploader } from "@/components/pdf-uploader";
import { CertificateCard } from "@/components/certificate-card";
import { VerificationStatus } from "@/components/verification-status";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Settings2, Check, Github } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function VerifyContent() {
  const searchParams = useSearchParams();
  const verifyToken = searchParams.get("verifyCert");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [customPublicKey, setCustomPublicKey] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Load persisted key from localStorage if available
    const storedKey = localStorage.getItem("vericert_custom_key");
    if (storedKey) setCustomPublicKey(storedKey);
  }, []);

  const saveCustomKey = () => {
    localStorage.setItem("vericert_custom_key", customPublicKey);
    toast.success("Custom public key saved!");
    setIsDialogOpen(false);
  };

  const clearCustomKey = () => {
    setCustomPublicKey("");
    localStorage.removeItem("vericert_custom_key");
    toast.info("Custom key removed. Using default BroCode key.");
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (verifyToken) {
      verifyCertificate(verifyToken);
    }
  }, [verifyToken]);

  async function verifyCertificate(token: string) {
    setLoading(true);
    try {
      const storedKey = localStorage.getItem("vericert_custom_key");
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token,
          publicKey: storedKey || undefined // Send custom key if it exists
        }),
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
          <Skeleton className="h-[400px] w-full rounded-xl bg-zinc-800/50" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 bg-zinc-800/50" />
            <Skeleton className="h-4 w-1/2 bg-zinc-800/50" />
          </div>
        </div>
        <p className="text-zinc-400 font-mono animate-pulse">
          Verifying Cryptographic Signature...
        </p>
      </div>
    );
  }

  // 2. Result State
  if (result) {
    return (
      <div className="flex flex-col items-center space-y-6 w-full max-w-4xl px-4 animate-in slide-in-from-bottom-10 duration-700 pb-10 md:pb-0">
        <VerificationStatus valid={result.valid} error={result.error} />
        
        {result.valid && result.payload && (
          <CertificateCard data={result.payload} />
        )}

        <Button 
          onClick={resetVerification}
          variant="outline" 
          className="mt-8 border-zinc-700 hover:bg-zinc-800 text-zinc-300"
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
      <div className="space-y-2 relative">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">
          VeriCert
        </h1>
        <p className="text-zinc-400 text-sm md:text-base font-medium uppercase tracking-widest opacity-80">
          By BroCode Tech Community
        </p>
      </div>

      {/* Settings Dialog for Custom Key */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"
          >
            <Settings2 className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Validation Settings</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Configure a custom Public Key to verify certificates from other communities.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="public-key" className="text-zinc-200">
                Custom Public Key (PEM format)
              </Label>
              <Textarea
                id="public-key"
                placeholder="-----BEGIN PUBLIC KEY-----..."
                className="font-mono text-xs bg-zinc-900 border-zinc-800 h-32"
                value={customPublicKey}
                onChange={(e) => setCustomPublicKey(e.target.value)}
              />
              <p className="text-[10px] text-zinc-500">
                Leave empty to use the default BroCode validation key.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            {customPublicKey && (
              <Button
                variant="destructive"
                onClick={clearCustomKey}
                className="bg-red-900/20 text-red-400 hover:bg-red-900/40 border-red-900/50"
              >
                Reset to Default
              </Button>
            )}
            <Button onClick={saveCustomKey} className="bg-white text-black hover:bg-zinc-200">
              <Check className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="w-full max-w-md">
        <PDFUploader />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-black">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={220}
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full min-h-screen"
      >
        <Suspense fallback={<div className="text-zinc-500">Loading...</div>}>
          <VerifyContent />
        </Suspense>
      </Vortex>

      {/* Floating Action Buttons - Bottom Right */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-40">
        {/* GitHub Repo Button */}
        <a
          href="https://github.com/NotoriousArnav/vericert.git"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
        >
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-36 rounded-full border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
            title="View GitHub Repository"
          >
            <Github className="h-5 w-5" />
            Github Repo
          </Button>
          <div className="absolute right-16 bottom-3 bg-zinc-800 text-zinc-100 text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            GitHub Repository
          </div>
        </a>

        {/* BroCode Community Button */}
        <a
          href="https://brocode-tech.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
        >
          <Button
            size="sm"
            className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-3 h-12 font-semibold flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, #DE9F68 0%, #EEB086 100%)",
            }}
            title="Visit BroCode Tech Community"
          >
            <Image
              src="/brocode-logo.jpg"
              alt="BroCode Logo"
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
            BroCode Tech
          </Button>
          <div className="absolute right-0 bottom-16 bg-zinc-800 text-zinc-100 text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Visit BroCode Tech Community
          </div>
        </a>
      </div>
    </div>
  );
}
