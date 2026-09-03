import React from 'react';
import { SkillPassport } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Calendar,
  Building,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  Users
} from 'lucide-react';

interface PublicVerifyPassportViewProps {
  passport: SkillPassport;
  onBackToApp: () => void;
}

export const PublicVerifyPassportView: React.FC<PublicVerifyPassportViewProps> = ({
  passport,
  onBackToApp
}) => {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      
      {/* Top Floating Return Action */}
      <div className="w-full max-w-2xl mb-4 flex items-center justify-between">
        <button
          onClick={onBackToApp}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to SkillSetu Portal
        </button>

        <span className="text-[11px] font-bold text-slate-400 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200">
          Public Verification Gateway (No Auth Required)
        </span>
      </div>

      {/* Main Public Verification Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-10 relative overflow-hidden">
        
        {/* Verified Banner */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              Official Verification Status
            </div>
            <h2 className="text-base font-black text-emerald-950">AUTHENTIC & ACTIVE SKILL PASSPORT</h2>
          </div>
        </div>

        {/* Student & College Credential */}
        <div className="space-y-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Student Name</span>
            <div className="text-2xl font-black text-slate-900">{passport.studentName}</div>

            {/* Profile Verification Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                UIDAI Identity Verified
              </span>

              {passport.endorsements && passport.endorsements.filter(e => e.status === 'VERIFIED').length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-2xs">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  Peer-Verified Scholar ({passport.endorsements.filter(e => e.status === 'VERIFIED').length} Endorsements)
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Building className="w-3 h-3 text-slate-500" /> Institution
              </span>
              <div className="font-bold text-slate-800 mt-0.5">{passport.institutionName}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-slate-500" /> Program
              </span>
              <div className="font-bold text-slate-800 mt-0.5">{passport.degree}</div>
            </div>
          </div>
        </div>

        {/* Verified Skills List */}
        <div className="py-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Authenticated Skill Competencies
            </h3>
            <span className="text-[10px] font-bold text-slate-500">
              Government + Academic Consensus
            </span>
          </div>

          <div className="space-y-2">
            {passport.topSkills.map((s, idx) => {
              const verifiedEndorsements = (passport.endorsements || []).filter(
                e => e.status === 'VERIFIED' && (
                  e.skillName.toLowerCase().includes(s.skillName.toLowerCase()) ||
                  s.skillName.toLowerCase().includes(e.skillName.toLowerCase())
                )
              );
              const isPeer = s.peerVerified || verifiedEndorsements.length > 0;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                    isPeer
                      ? 'bg-gradient-to-r from-white via-indigo-50/20 to-white border-indigo-200/80 shadow-2xs'
                      : 'bg-slate-50 border-slate-200/60'
                  }`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-900">{s.skillName}</span>

                    {isPeer && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-300 shadow-2xs"
                        title={verifiedEndorsements.length > 0 ? `Attested by: ${verifiedEndorsements.map(e => e.endorserName).join(', ')}` : 'Peer consensus verified'}
                      >
                        <Users className="w-3 h-3 text-indigo-600" />
                        <span>Peer-Verified</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-slate-600">{s.proficiencyScore}/100</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                      {s.proficiencyLevel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Authenticated Peer Endorsements (Classmate Consensus) */}
        {passport.endorsements && passport.endorsements.filter(e => e.status === 'VERIFIED').length > 0 && (
          <div className="py-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Classmate Peer Endorsements</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Consensus Attested
              </span>
            </div>
            <div className="space-y-2.5">
              {passport.endorsements.filter(e => e.status === 'VERIFIED').map(e => (
                <div key={e.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <img
                        src={e.endorserAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'}
                        alt={e.endorserName}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-200"
                      />
                      <span className="font-bold text-slate-900">{e.endorserName}</span>
                      <span className="text-[10px] text-slate-400">• {e.endorserRole.split('•')[1] || e.endorserRole}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-600 text-white">
                      {e.skillName}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 italic">
                    "{e.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit / Hash Details */}
        <div className="pt-6 space-y-2 text-[11px] text-slate-500 font-mono">
          <div className="flex justify-between">
            <span>Passport ID:</span>
            <strong className="text-slate-800">{passport.passportId}</strong>
          </div>
          <div className="flex justify-between">
            <span>Cryptographic Seal:</span>
            <strong className="text-slate-800">{passport.verificationCode}</strong>
          </div>
          <div className="flex justify-between">
            <span>Issue Date:</span>
            <span>{passport.issueDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Valid Until:</span>
            <span>{passport.validUntil}</span>
          </div>
        </div>

        {/* Security / Privacy Seal */}
        <div className="mt-6 p-3 bg-slate-900 text-white rounded-2xl text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Verified by SkillSetu National Skill Verification Protocol</span>
          </div>
          <Sparkles className="w-4 h-4 text-blue-400" />
        </div>

      </div>

    </div>
  );
};
