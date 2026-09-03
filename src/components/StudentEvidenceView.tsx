import React, { useState } from 'react';
import { StudentProfile } from '../types';
import {
  ShieldCheck,
  Award,
  Upload,
  ExternalLink,
  CheckCircle2,
  Clock,
  Github,
  FileCode,
  FileCheck,
  Plus
} from 'lucide-react';

interface StudentEvidenceViewProps {
  student: StudentProfile;
  onOpenEvidenceModal?: () => void;
  onOpenAadhaarModal?: () => void;
}

export const StudentEvidenceView: React.FC<StudentEvidenceViewProps> = ({
  student,
  onOpenEvidenceModal,
  onOpenAadhaarModal
}) => {
  const allEvidence = [
    ...(student.projects || []),
    ...(student.certifications || [])
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Evidence & Cryptographic Verification
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Skill Evidence Vault
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            All claims on your Skill Passport must be backed by verifiable artifacts: GitHub repositories, capstone projects, academic reviews, or industry certifications.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onOpenEvidenceModal && (
            <button
              onClick={onOpenEvidenceModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Upload Evidence
            </button>
          )}
        </div>
      </div>

      {/* Aadhaar Identity Verification Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              National Identity Verification: {student.identityVerification?.status === 'OFFICIAL_VERIFIED' || student.identityVerification?.status === 'DEMO_VERIFIED' ? 'Verified' : 'Pending'}
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                Aadhaar Sandbox
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identity Token: <span className="font-mono text-slate-700 font-bold">{student.identityVerification?.maskedNumber || 'XXXX-XXXX-8921'}</span>
            </p>
          </div>
        </div>

        {onOpenAadhaarModal && (
          <button
            onClick={onOpenAadhaarModal}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            Re-verify Sandbox
          </button>
        )}
      </div>

      {/* Evidence Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {allEvidence.map((ev, i) => (
          <div
            key={ev.id || i}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                  {ev.type || 'PROJECT'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-teal-600" />
                  {ev.verificationStatus || 'Verified'}
                </span>
              </div>

              <h4 className="font-bold text-base text-slate-900 mt-1">{ev.title}</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ev.description}</p>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Skill Demonstrated:</span>
                  <span className="font-bold text-emerald-800">{ev.skillName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Verification Source:</span>
                  <span className="font-medium text-slate-700">{ev.verificationSource}</span>
                </div>
                {ev.issuer && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Issuer / Auditor:</span>
                    <span className="font-medium text-slate-700">{ev.issuer}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Recorded {ev.date}</span>
              {ev.url && (
                <a
                  href={ev.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline"
                >
                  Inspect Evidence <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
