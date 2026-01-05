"use client";

import React, { useState, useCallback } from "react";
import ScanCanvasQR from "react-pdf-image-qr-scanner"; // Changed import
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function PDFUploader() {
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const canvasScannerRef = React.useRef<any>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }

    setIsScanning(true);
    try {
      // The library requires the canvas ref to be present
      if (!canvasScannerRef.current) {
        throw new Error("Scanner not initialized");
      }

      const qrCodeText = await canvasScannerRef.current.scanFile(file);
      
      if (!qrCodeText) {
        toast.error("No QR code found in this PDF.");
        setIsScanning(false);
        return;
      }

      // Extract ?verifyCert=TOKEN
      let token = "";
      try {
        const url = new URL(qrCodeText);
        token = url.searchParams.get("verifyCert") || "";
      } catch {
        if (qrCodeText.includes("verifyCert=")) {
             token = qrCodeText.split("verifyCert=")[1];
        }
      }

      if (!token) {
        toast.error("QR code found, but it doesn't contain a valid verification link.");
        setIsScanning(false);
        return;
      }

      toast.success("Certificate detected! Verifying...");
      // Redirect to verification view
      router.push(`/?verifyCert=${token}`);

    } catch (err) {
      console.error("Scanning error:", err);
      toast.error("Failed to read the PDF. Please try again.");
      setIsScanning(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Hidden Scanner Component */}
      <div className="hidden">
        <ScanCanvasQR ref={canvasScannerRef} />
      </div>

      <Card 
        className={`border-2 border-dashed transition-colors duration-200 bg-card/50 backdrop-blur-sm ${
          isDragOver 
            ? "border-primary bg-primary/10" 
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-10 px-6 text-center space-y-4">
          <div className="p-4 rounded-full bg-primary/10 text-primary mb-2">
            {isScanning ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <Upload className="h-8 w-8" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">
              {isScanning ? "Scanning Certificate..." : "Upload Certificate"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Drag and drop your PDF certificate here, or click to browse.
            </p>
          </div>

          <div className="pt-4">
            <input
              type="file"
              id="pdf-upload"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isScanning}
            />
            <label htmlFor="pdf-upload">
              <Button 
                variant="outline" 
                className="cursor-pointer border-primary/20 hover:bg-primary/10 hover:text-primary"
                disabled={isScanning}
                asChild
              >
                <span>
                  <FileText className="mr-2 h-4 w-4" />
                  Select PDF File
                </span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-start gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-200 text-sm">
        <AlertCircle className="h-5 w-5 shrink-0 text-orange-400" />
        <p>
          This tool scans the QR code embedded in your BroCode certificate to verify its authenticity against our digital records.
        </p>
      </div>
    </div>
  );
}
