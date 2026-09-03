import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Briefcase,
  TrendingUp,
  Target,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface CompanyAIMatchingViewProps {
  jobs?: any[];
  candidates?: StudentProfile[];
  onOpenPassport?: (studentId: string) => void;
}

export const CompanyAIMatchingView: React.FC<CompanyAIMatchingViewProps> = ({
  jobs = [],
  candidates = [],
  onOpenPassport
}) => {
  const [selectedRole, setSelectedRole] = useState('Machine Learning Engineer');

  const roles = [
    { title: 'Machine Learning Engineer', matchCount: 47, verifiedCount: 12, topMatch: 94 },
    { title: 'Full Stack Python & Cloud Developer', matchCount: 38, verifiedCount: 18, topMatch: 91 },
    { title: 'Distributed Systems & Microservices', matchCount: 29, verifiedCount: 9, topMatch: 88 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Algorithmic Candidate Matching
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            AI Recruiter Matching Engine
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Multi-factor matching: 50% Verified Skill Passport, 30% Diagnostic Assessment Scores, 20% Project Architecture Evidence.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Top Candidate Match</span>
          <span className="text-3xl font-black text-emerald-400">94%</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">Arun Kumar (CEG Anna Univ)</span>
        </div>
      </div>

      {/* Recruiter Insight Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold">
            47 candidates match your ML Engineer requirements • 12 candidates have verified Python + ML skills • Top candidate match: 94%
          </span>
        </div>
      </div>

      {/* Role Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {roles.map(r => (
          <button
            key={r.title}
            onClick={() => setSelectedRole(r.title)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedRole === r.title
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {r.title} ({r.matchCount} Matches)
          </button>
        ))}
      </div>

      {/* Top Matched Candidates */}
      <div className="space-y-4">
        {(candidates || []).map((cand, idx) => {
          const matchPercent = idx === 0 ? 94 : idx === 1 ? 88 : 82;

          return (
            <div
              key={cand.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={cand.avatar}
                  alt={cand.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-slate-900">{cand.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                      {matchPercent}% AI Fit
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {cand.degree} • {cand.collegeName}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Passport ID: <span className="font-mono font-bold text-slate-700">{cand.passportId}</span> • CGPA: {cand.cgpa}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                    {(cand.skills || []).map(s => (
                      <span
                        key={s.skillId}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700"
                      >
                        ✓ {s.skillName} ({s.proficiencyScore}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto shrink-0 flex gap-2">
                <button
                  onClick={() => onOpenPassport && onOpenPassport(cand.id)}
                  className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Audit Skill Passport
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
