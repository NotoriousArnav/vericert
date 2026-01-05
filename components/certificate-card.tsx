"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Award, Building } from "lucide-react";

interface CertificateCardProps {
  data: any; // Flexible payload
}

export function CertificateCard({ data }: CertificateCardProps) {
  // Extract common fields if they exist, otherwise fallback
  const recipientName = data.name || data.recipient || "Unknown Recipient";
  const courseName = data.course || data.title || "Certificate of Completion";
  const issuer = data.issuer || "BroCode";
  const issueDate = data.issuedAt ? new Date(data.issuedAt).toLocaleDateString() : "Unknown Date";
  const certId = data.certId || data.id || "N/A";

  return (
    <Card className="w-full max-w-2xl bg-[#F9F9F0] text-[#361E19] border-none shadow-xl overflow-hidden relative">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#DE9F68] via-[#EEB086] to-[#DE9F68]" />
      
      <CardHeader className="text-center pb-2 pt-8">
        <div className="mx-auto mb-4 w-16 h-16 bg-[#361E19] rounded-full flex items-center justify-center text-[#F9F9F0]">
          <Award className="w-8 h-8" />
        </div>
        <CardTitle className="text-3xl font-serif tracking-wide text-[#361E19]">
          {courseName}
        </CardTitle>
        <p className="text-[#DE9F68] font-medium uppercase tracking-widest text-sm mt-1">
          Official Certificate
        </p>
      </CardHeader>

      <CardContent className="space-y-8 px-8 pb-10">
        <div className="text-center space-y-2">
          <p className="text-sm text-[#361E19]/60 uppercase tracking-wider">Presented To</p>
          <h3 className="text-2xl font-bold border-b border-[#DE9F68]/30 pb-4 inline-block min-w-[200px]">
            {recipientName}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#361E19]/5">
            <Building className="text-[#DE9F68] w-5 h-5" />
            <div>
              <p className="text-xs text-[#361E19]/60 uppercase">Issuer</p>
              <p className="font-semibold">{issuer}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#361E19]/5">
            <Calendar className="text-[#DE9F68] w-5 h-5" />
            <div>
              <p className="text-xs text-[#361E19]/60 uppercase">Issued On</p>
              <p className="font-semibold">{issueDate}</p>
            </div>
          </div>
        </div>

        {/* Raw JSON viewer for tech transparency */}
        <div className="mt-8 pt-6 border-t border-[#361E19]/10">
          <p className="text-xs font-mono text-[#361E19]/40 mb-2">CRYPTOGRAPHIC PAYLOAD</p>
          <div className="bg-[#361E19] text-[#F9F9F0] p-4 rounded-md font-mono text-xs overflow-x-auto shadow-inner">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-[#361E19]/40 mt-4">
          <span>ID: {certId}</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Securely Verified</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
