import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  Award,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const CollegeReportsView: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (name: string) => {
    setDownloading(name);
    setTimeout(() => {
      setDownloading(null);
    }, 1500);
  };

  const reports = [
    {
      title: 'Institutional NAAC Skill Accreditation Audit 2026',
      description: 'Formal mapping of SkillSetu cryptographically verified competencies to NAAC Criterion 1.2 and 2.5 benchmarks.',
      type: 'PDF Audit Document',
      size: '4.8 MB',
      date: 'Generated March 2026',
      accreditation: 'NAAC A++ Compliant'
    },
    {
      title: 'AICTE Curriculum Skill Gap & Industry Deficit Report',
      description: 'Department-by-department evaluation of syllabus alignment against 1,200+ industry hiring partner requirements.',
      type: 'Official Syllabus Audit',
      size: '6.2 MB',
      date: 'Updated Yesterday',
      accreditation: 'AICTE Model Curriculum'
    },
    {
      title: 'NIRF Ranking Data - Metric 4: Placement & Higher Studies',
      description: 'Verified student placement numbers, median CTC packages, and corporate hiring partner offer letters.',
      type: 'Institutional Data Sheet',
      size: '2.4 MB',
      date: 'Annual 2025-26',
      accreditation: 'NIRF Engineering Top 10'
    },
    {
      title: 'Batch 2026 Verifiable Skill Passport Registry',
      description: 'Tamper-proof blockchain SHA-256 ledger of all 1,894 active student Skill Passports and their assessment logs.',
      type: 'Cryptographic Ledger Export',
      size: '11.5 MB',
      date: 'Real-time Live Sync',
      accreditation: 'W3C Verifiable Credentials'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <FileText className="w-3.5 h-3.5" /> Official Accreditation Documents
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Institutional Reports & NAAC Audit
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Download certified audit exports for NAAC, NBA, NIRF, and AICTE compliance verified via SkillSetu protocol.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Audit Status</span>
          <span className="text-3xl font-black text-emerald-400">NAAC A++</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">100% Skill Evidence Verifiable</span>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map(rep => (
          <div
            key={rep.title}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {rep.accreditation}
                </span>
                <span className="text-xs text-slate-400 font-medium">{rep.size}</span>
              </div>

              <h3 className="font-bold text-base text-slate-900 leading-snug">{rep.title}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{rep.description}</p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {rep.date}
              </span>
              <button
                onClick={() => handleDownload(rep.title)}
                disabled={downloading === rep.title}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {downloading === rep.title ? 'Downloading...' : 'Download Certified PDF'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
