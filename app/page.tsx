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
    <div className="w-full min-h-screen bg-black flex flex-col">
       <Vortex
         backgroundColor="black"
         rangeY={600}
         particleCount={500}
         baseHue={220}
         className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full flex-1"
       >
         <Suspense fallback={<div className="text-zinc-500">Loading...</div>}>
           <VerifyContent />
         </Suspense>
       </Vortex>
      <hr />

      {/* Footer with Community Links */}
      <footer className="bg-zinc-950 border-t border-zinc-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* VeriCert Info */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">VeriCert</h3>
              <p className="text-gray-400 text-sm">
                Secure JWT certificate verification platform with RS256 encryption.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/NotoriousArnav/vericert.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  title="GitHub Repository"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* BroCode */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">BroCode</h3>
              <p className="text-gray-400 text-sm">
                Learn coding, web development, and software engineering.
              </p>
              <a
                href="https://brocode-tech.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-semibold rounded-lg transition-all"
              >
                Visit BroCode →
              </a>
            </div>

            {/* Event Horizon */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">Event Horizon</h3>
              <p className="text-gray-400 text-sm">
                Discover and register for community events and workshops.
              </p>
              <a
                href="https://events.neopanda.tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-semibold rounded-lg transition-all"
              >
                View Events →
              </a>
            </div>

            {/* Bromine */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">Bromine</h3>
              <p className="text-gray-400 text-sm">
                Share and discover tech blogs from the BroCode community.
              </p>
              <a
                href="https://bromine.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm font-semibold rounded-lg transition-all"
              >
                Read Blogs →
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                Made with ❤️ by BroCode Tech Community • MIT Licensed • Open Source
              </p>
              <div className="flex gap-6 text-sm">
                <a
                  href="https://github.com/NotoriousArnav/vericert.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  License (MIT)
                </a>
                <a
                  href="https://github.com/NotoriousArnav/vericert.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Source Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
