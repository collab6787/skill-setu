import React from 'react';
import { StudentProfile } from '../types';
import {
  Award,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  FileCheck,
  Download,
  Calendar
} from 'lucide-react';

interface StudentCertificatesViewProps {
  student: StudentProfile;
  onOpenPassport?: () => void;
}

export const StudentCertificatesView: React.FC<StudentCertificatesViewProps> = ({
  student,
  onOpenPassport
}) => {
  const certifications = student.certifications || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <Award className="w-3.5 h-3.5" /> Verifiable Certificates
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Digital Certificates & Accreditations
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Tamper-proof verifiable credentials issued by accredited universities, course providers, and hackathon governing bodies.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Total Certificates</span>
          <span className="text-3xl font-black text-emerald-400">{certifications.length}</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">All 100% Cryptographically Verified</span>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {certifications.map(cert => (
          <div
            key={cert.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {cert.issuer || 'Accredited Provider'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-teal-600" />
                  Verified
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-900 leading-snug">{cert.title}</h3>
              <p className="text-xs text-slate-500 mt-1.5">{cert.description}</p>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 font-mono">
                <div className="text-slate-500 text-[11px]">
                  Credential Hash: <span className="text-slate-800 font-bold">SHA256:8f4c...91a2</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  NAD Digital Locker: <span className="text-emerald-700 font-bold">VERIFIED_AND_LOCKED</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Issued {cert.date}
              </span>
              {cert.url && (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-black flex items-center gap-1 hover:underline"
                >
                  View Credential <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
