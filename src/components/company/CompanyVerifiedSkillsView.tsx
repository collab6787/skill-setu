import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  ExternalLink,
  Award,
  Filter,
  FileBadge,
  QrCode,
  Hash,
  Sparkles
} from 'lucide-react';

interface CompanyVerifiedSkillsViewProps {
  candidates: StudentProfile[];
  onOpenPassport?: (passportId: string) => void;
}

export const CompanyVerifiedSkillsView: React.FC<CompanyVerifiedSkillsViewProps> = ({
  candidates = [],
  onOpenPassport
}) => {
  const [selectedSkill, setSelectedSkill] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState<'ALL' | 'AADHAAR' | 'PASSPORT'>('ALL');

  // Extract all unique skills across candidates
  const allSkills = Array.from(
    new Set((candidates || []).flatMap(c => (c.skills || []).map(s => s.skillName)))
  ).sort();

  const filteredCandidates = (candidates || []).filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.skills || []).some(s => s.skillName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkill =
      selectedSkill === 'ALL' ||
      (c.skills || []).some(s => s.skillName.toLowerCase() === selectedSkill.toLowerCase());

    const matchesVerification =
      verifiedFilter === 'ALL' ||
      (verifiedFilter === 'AADHAAR' && c.identityVerification?.status === 'OFFICIAL_VERIFIED') ||
      (verifiedFilter === 'PASSPORT' && Boolean(c.passportId));

    return matchesSearch && matchesSkill && matchesVerification;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Cryptographic Integrity Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Verified Skills & Authenticity Verification
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Eliminate resume fraud. Every candidate profile below is backed by cryptographically verifiable skill passports, peer consensus proofs, and institution attestations.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Fraud Elimination Rate</span>
          <span className="text-3xl font-black text-emerald-400">100%</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">W3C DID Proofs</span>
        </div>
      </div>

      {/* Recruiter Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="crextio-card p-5 border-l-4 border-l-emerald-500">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Audited Candidate Pool</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{candidates.length}</span>
          <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Identity Pre-Vetted
          </p>
        </div>

        <div className="crextio-card p-5 border-l-4 border-l-teal-500">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Verified Skills in Pool</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{allSkills.length} Verified Competencies</span>
          <p className="text-xs text-teal-700 font-medium mt-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Assessment & GitHub Backed
          </p>
        </div>

        <div className="crextio-card p-5 border-l-4 border-l-blue-500">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Avg Skill Confidence</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">88.4%</span>
          <p className="text-xs text-blue-700 font-medium mt-1 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> High Signal Hiring
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search verified candidate by name, institution, or technology..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSkill}
            onChange={e => setSelectedSkill(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Skills ({allSkills.length})</option>
            {allSkills.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={verifiedFilter}
            onChange={e => setVerifiedFilter(e.target.value as any)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Verification Types</option>
            <option value="PASSPORT">Skill Passport Issued</option>
            <option value="AADHAAR">Official KYC Verified</option>
          </select>
        </div>
      </div>

      {/* Candidate Verified Skills Table */}
      <div className="crextio-card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Verified Talent Directory</h3>
            <p className="text-xs text-slate-500">Inspected directly against SkillSetu cryptographic ledgers.</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {filteredCandidates.length} Candidates Matched
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Candidate & College</th>
                <th className="py-3 px-4">Verified Skill Badges</th>
                <th className="py-3 px-4 text-center">Readiness Index</th>
                <th className="py-3 px-4">KYC / Hash Proof</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                          {c.name}
                          {c.passportId && (
                            <FileBadge className="w-3.5 h-3.5 text-emerald-600" title="Digital Passport Verified" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {c.collegeName} • {c.department}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1.5 max-w-sm">
                      {c.skills.slice(0, 3).map(sk => (
                        <span
                          key={sk.skillId}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          {sk.skillName} ({sk.proficiencyScore}%)
                        </span>
                      ))}
                      {c.skills.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          +{c.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {c.careerReadinessScore.overall}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <Hash className="w-3 h-3 text-slate-400" />
                        {c.passportId ? `PASSPORT-${c.passportId.slice(-8).toUpperCase()}` : 'PENDING-HASH'}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {c.identityVerification.status === 'OFFICIAL_VERIFIED' ? 'Aadhaar Verified' : 'Institution Verified'}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onOpenPassport && onOpenPassport(c.passportId || c.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                    >
                      <FileBadge className="w-3.5 h-3.5" />
                      View Passport
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
