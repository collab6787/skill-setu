import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import {
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Award,
  Sparkles,
  MapPin,
  Bookmark,
  Send,
  UserCheck
} from 'lucide-react';

interface CompanyFindCandidatesViewProps {
  candidates: StudentProfile[];
  onOpenPassport?: (studentId: string) => void;
}

export const CompanyFindCandidatesView: React.FC<CompanyFindCandidatesViewProps> = ({
  candidates = [],
  onOpenPassport
}) => {
  const [searchSkill, setSearchSkill] = useState('');
  const [minReadiness, setMinReadiness] = useState<number>(75);
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());

  const toggleShortlist = (id: string) => {
    setShortlisted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredCandidates = (candidates || []).filter(c => {
    const matchesSkill =
      !searchSkill ||
      (c.skills || []).some(s => s.skillName.toLowerCase().includes(searchSkill.toLowerCase())) ||
      (c.name || '').toLowerCase().includes(searchSkill.toLowerCase()) ||
      (c.targetRole || '').toLowerCase().includes(searchSkill.toLowerCase());

    const matchesReadiness = (c.careerReadinessScore?.overall || 0) >= minReadiness;

    return matchesSkill && matchesReadiness;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <Search className="w-3.5 h-3.5" /> Talent Discovery Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Search Pre-Vetted Candidates
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Filter university engineers by cryptographically verified skills, Aadhaar identity tokens, and objective career readiness scores.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Available Candidates</span>
          <span className="text-3xl font-black text-emerald-400">{filteredCandidates.length}</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">100% Skill Passport Verified</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by required skill (e.g. Python, Docker, FastAPI) or target role..."
            value={searchSkill}
            onChange={e => setSearchSkill(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>Min Readiness:</span>
            <select
              value={minReadiness}
              onChange={e => setMinReadiness(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-emerald-800"
            >
              <option value={60}>60% +</option>
              <option value={75}>75% + (Day-1 Ready)</option>
              <option value={85}>85% + (Top 10%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCandidates.map(c => {
          const isShortlisted = shortlisted.has(c.id);

          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{c.name}</h3>
                      <p className="text-xs text-slate-500">{c.targetRole}</p>
                      <p className="text-[11px] text-slate-400">{c.collegeName}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleShortlist(c.id)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isShortlisted
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-700'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isShortlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Readiness and Identity */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs mb-3">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Career Readiness</span>
                    <span className="text-lg font-black text-emerald-700">{c.careerReadinessScore.overall}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">Academic CGPA</span>
                    <span className="text-sm font-bold text-slate-800">{c.cgpa} / 10.0</span>
                  </div>
                </div>

                {/* Verified Skills */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Verified Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.skills.map(s => (
                      <span
                        key={s.skillId}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/50 flex items-center gap-0.5"
                      >
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        {s.skillName} ({s.proficiencyScore}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onOpenPassport && onOpenPassport(c.id)}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Audit Passport
                </button>
                <button
                  onClick={() => toggleShortlist(c.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isShortlisted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isShortlisted ? 'Shortlisted ✓' : 'Shortlist'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
