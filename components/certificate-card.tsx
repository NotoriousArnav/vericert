"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Award, Building, Fingerprint, User, ShieldCheck, Download, FileText, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState, useRef } from "react";

interface CertificateCardProps {
  data: any; // Flexible payload
}

export function CertificateCard({ data }: CertificateCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Extract common fields if they exist, otherwise fallback
  const recipientName = data.name || data.recipient || "Unknown Recipient";
  const courseName = data.event || data.course || data.title || "Certificate of Completion";
  const issuer = data.issuer || "BroCode";
  
  // Handle both issuedAt and iat (JWT standard)
  const iatTimestamp = data.iat || data.issuedAt;
  const issueDate = iatTimestamp 
    ? new Date(iatTimestamp * 1000).toLocaleDateString() 
    : "Unknown Date";
  
  const certId = data.certId || data.id || "N/A";

  // Filter out redundant keys for the JSON view
  const techDetails = Object.entries(data).filter(([key]) => 
    !['name', 'recipient', 'course', 'event', 'title', 'issuer', 'issuedAt', 'iat', 'certId', 'id'].includes(key)
  );

  const downloadAsPDF = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#000000",
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${recipientName}-certificate.pdf`);
    } catch (err) {
      console.error("PDF download error:", err);
    } finally {
      setIsDownloading(false);
      setShowDropdown(false);
    }
  };

  const downloadAsPNG = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#000000",
        scale: 2,
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${recipientName}-certificate.png`;
      link.click();
    } catch (err) {
      console.error("PNG download error:", err);
    } finally {
      setIsDownloading(false);
      setShowDropdown(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl relative"
    >
      {/* Download Dropdown Button */}
      <div className="absolute -top-12 right-0 z-50">
        <div className="relative">
          <Button
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={isDownloading}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full px-4 h-10 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            title="Download Certificate"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          
          {/* Dropdown Menu */}
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-12 right-0 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden w-48 z-50"
            >
              <button
                onClick={downloadAsPDF}
                disabled={isDownloading}
                className="w-full flex items-center gap-3 px-4 py-3 text-zinc-200 hover:bg-zinc-800 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="h-4 w-4 text-red-400" />
                <span>Download as PDF</span>
              </button>
              <button
                onClick={downloadAsPNG}
                disabled={isDownloading}
                className="w-full flex items-center gap-3 px-4 py-3 text-zinc-200 hover:bg-zinc-800 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed border-t border-zinc-800"
              >
                <ImageIcon className="h-4 w-4 text-blue-400" />
                <span>Download as PNG</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <Card ref={cardRef} className="w-full bg-zinc-950 text-zinc-100 border-zinc-800 shadow-2xl overflow-hidden relative backdrop-blur-xl bg-opacity-90">
        {/* Decorative holographic gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-gradient-x" />
        
        <CardHeader className="text-center pb-6 pt-10 relative">
          <div className="absolute top-4 right-4">
             <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 px-3 py-1 gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified
             </Badge>
          </div>
          
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-6 w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 shadow-inner group hover:scale-105 transition-transform duration-300"
          >
            <Award className="w-10 h-10 text-white group-hover:text-cyan-400 transition-colors duration-300" />
          </motion.div>
          
          <CardTitle className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
            {courseName}
          </CardTitle>
          <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-xs mt-3">
            Official Certification
          </p>
        </CardHeader>

        <CardContent className="space-y-10 px-8 pb-12">
          {/* Main Recipient Section */}
          <div className="text-center space-y-3 py-4 border-y border-zinc-900/50 bg-zinc-900/20">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
              <User className="w-3 h-3" /> Presented To
            </p>
            <h3 className="text-3xl font-bold text-white tracking-wide">
              {recipientName}
            </h3>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors">
              <div className="p-3 bg-zinc-800 rounded-lg">
                <Building className="text-cyan-400 w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Issuer</p>
                <p className="font-semibold text-zinc-200">{issuer}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors">
              <div className="p-3 bg-zinc-800 rounded-lg">
                <Calendar className="text-purple-400 w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Issued Date</p>
                <p className="font-semibold text-zinc-200">{issueDate}</p>
              </div>
            </div>
          </div>

          {/* Tech/JSON Payload Showcase */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-2 text-zinc-500">
               <Fingerprint className="w-4 h-4" />
               <h4 className="text-xs font-mono uppercase tracking-widest font-bold">Cryptographic Payload</h4>
            </div>
            
            <div className="bg-black/80 rounded-xl border border-zinc-800 p-6 font-mono text-xs md:text-sm overflow-hidden relative group">
              {/* Syntax Highlighted JSON Simulation */}
              <div className="space-y-1.5">
                <div className="text-zinc-600">{"{"}</div>
                
                 {/* Standard Fields */}
                 <JsonLine keyName="certId" value={certId} color="text-yellow-400" />
                 <JsonLine keyName="recipient" value={recipientName} color="text-green-400" />
                 <JsonLine keyName="event" value={courseName} color="text-blue-400" />
                 <JsonLine keyName="issuer" value={issuer} color="text-purple-400" />
                 <JsonLine keyName="iat" value={data.iat} color="text-orange-400" />

                {/* Dynamic Extra Fields */}
                {techDetails.map(([key, value]) => (
                  <JsonLine key={key} keyName={key} value={value} color="text-cyan-400" />
                ))}

                <div className="text-zinc-600">{"}"}</div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
            </div>
          </div>

          {/* ID Footer */}
          <div className="flex justify-between items-center text-[10px] text-zinc-600 font-mono border-t border-zinc-900 pt-4 mt-2">
            <span className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
               SECURE_VERIFICATION_V1
            </span>
            <span className="uppercase tracking-widest">ID: {certId}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Interactive JSON Line Component
function JsonLine({ keyName, value, color }: { keyName: string, value: any, color: string }) {
  return (
    <div className="pl-4 group/line flex hover:bg-zinc-800/50 rounded px-2 -ml-2 transition-colors cursor-default relative">
      <span className="text-pink-400">"{keyName}"</span>
      <span className="text-zinc-500 mr-2">:</span>
      <span className={`${color} truncate max-w-[200px] md:max-w-[400px]`}>
        {typeof value === 'string' ? `"${value}"` : String(value)}
      </span>
      <span className="text-zinc-600">,</span>
      
      {/* Tooltip on Hover */}
      <div className="absolute left-full ml-2 top-0 bg-zinc-800 text-zinc-300 text-[10px] px-2 py-1 rounded border border-zinc-700 opacity-0 group-hover/line:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
        {typeof value}
      </div>
    </div>
  );
}
