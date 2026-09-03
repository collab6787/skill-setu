import React from 'react';
import {
  TrendingUp,
  Clock,
  Award,
  Users,
  CheckCircle2,
  DollarSign,
  BarChart3,
  PieChart,
  ShieldCheck,
  Download
} from 'lucide-react';

export const CompanyHiringAnalyticsView: React.FC = () => {
  const collegeSources = [
    { college: 'Anna University - CEG Campus', hires: 38, avgMatch: 92, avgPackage: '₹11.2 LPA', retentionRate: '96%' },
    { college: 'IIT Madras', hires: 24, avgMatch: 95, avgPackage: '₹16.5 LPA', retentionRate: '94%' },
    { college: 'PSG Tech Coimbatore', hires: 31, avgMatch: 88, avgPackage: '₹9.8 LPA', retentionRate: '98%' },
    { college: 'NIT Trichy', hires: 19, avgMatch: 90, avgPackage: '₹12.0 LPA', retentionRate: '95%' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Corporate Hiring Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Talent Acquisition & Hiring Velocity Analytics
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Data-backed recruitment metrics. See real-time time-to-hire, funnel conversion velocity, and institutional source yield.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Time-to-Hire Reduction</span>
          <span className="text-3xl font-black text-emerald-400">67% Faster</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">14 Days vs 42 Day Baseline</span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="crextio-card p-5">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Offer Acceptance Rate</span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">89.4%</span>
          <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> +14% vs conventional hiring
          </p>
        </div>

        <div className="crextio-card p-5">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Average Time-to-Fill</span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">14 Days</span>
          <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Zero preliminary screening tests
          </p>
        </div>

        <div className="crextio-card p-5">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Candidate Quality Score</span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">91.8/100</span>
          <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Cryptographically verified skills
          </p>
        </div>

        <div className="crextio-card p-5">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Sourcing Cost Saved</span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">₹4.2 Lakh</span>
          <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" /> Saved on external agency fees
          </p>
        </div>
      </div>

      {/* Funnel Conversion & Sourcing Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Funnel stages */}
        <div className="lg:col-span-5 crextio-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">Applicant Sourcing Funnel</h3>
            <span className="text-xs text-slate-500 font-bold">This Quarter</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>AI Pre-Vetted Profiles Matched</span>
                <span>240 Candidates</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-700 rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Profile Inspected / Shortlisted</span>
                <span>112 Candidates (47%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full w-[47%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Evaluated in Technical Rounds</span>
                <span>48 Candidates (20%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full w-[20%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Offers Extended</span>
                <span>22 Candidates (9.1%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[9.1%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Joined & Onboarded</span>
                <span>20 Engineers (8.3%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[8.3%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Institutional yield */}
        <div className="lg:col-span-7 crextio-card p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Partner College Yield & Performance</h3>
              <p className="text-xs text-slate-500">Historical performance of hired engineers from partner institutions.</p>
            </div>
            <button className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">College Institution</th>
                  <th className="py-2.5 px-3 text-center">Hires</th>
                  <th className="py-2.5 px-3 text-center">Avg Skill Match</th>
                  <th className="py-2.5 px-3">Avg CTC</th>
                  <th className="py-2.5 px-3 text-right">Retention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {collegeSources.map(c => (
                  <tr key={c.college} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-900">{c.college}</td>
                    <td className="py-3 px-3 text-center font-extrabold text-emerald-800">{c.hires}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-[11px]">
                        {c.avgMatch}%
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{c.avgPackage}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-700">{c.retentionRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
