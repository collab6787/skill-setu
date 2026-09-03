import React from 'react';
import {
  TrendingUp,
  Flame,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  DollarSign
} from 'lucide-react';

export const CompanyIndustryInsightsView: React.FC = () => {
  const hiringTrends = [
    {
      skill: 'Docker & Kubernetes Containerization',
      marketDemand: 96,
      talentAvailability: 'Low / Scarce',
      scarcityStatus: 'HIGH_SCARCITY',
      salaryGrowth: '+34% YoY',
      avgSalaryRange: '₹12.0 – ₹18.0 LPA',
      recruiterAction: 'Expand campus MoUs with institutions offering active container labs.'
    },
    {
      skill: 'FastAPI & Distributed Microservices',
      marketDemand: 91,
      talentAvailability: 'Moderate',
      scarcityStatus: 'MODERATE',
      salaryGrowth: '+28% YoY',
      avgSalaryRange: '₹9.0 – ₹14.0 LPA',
      recruiterAction: 'Test concurrent request handling in algorithmic interviews.'
    },
    {
      skill: 'Generative AI, PyTorch & Vector Databases',
      marketDemand: 98,
      talentAvailability: 'Very Scarce',
      scarcityStatus: 'HIGH_SCARCITY',
      salaryGrowth: '+46% YoY',
      avgSalaryRange: '₹14.0 – ₹22.0 LPA',
      recruiterAction: 'Prioritize candidates with verifiable open-source GitHub contributions.'
    },
    {
      skill: 'Cloud Security & DevSecOps',
      marketDemand: 88,
      talentAvailability: 'Moderate',
      scarcityStatus: 'MODERATE',
      salaryGrowth: '+22% YoY',
      avgSalaryRange: '₹10.0 – ₹15.0 LPA',
      recruiterAction: 'Look for ISO / OWASP compliance project evidence in passports.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Talent Market Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Industry Talent Scarcity & Salary Benchmarks
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            What skills should your company hire for? Real-time supply-demand index based on 10,000+ verified engineering portfolios across India.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Highest Scarcity Tech</span>
          <span className="text-2xl font-black text-amber-400">Kubernetes & ML Ops</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">3.8 Openings per Candidate</span>
        </div>
      </div>

      {/* Recruiter Strategy Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-amber-900 block">AI Talent Sourcing Advisory:</span>
            <span>42 candidates currently match your Docker + AWS requirement. Sourcing early from Anna Univ and IIT Madras will reduce hiring cycle latency by 18 days.</span>
          </div>
        </div>
      </div>

      {/* Skill Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {hiringTrends.map(item => (
          <div key={item.skill} className="crextio-card p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{item.skill}</h3>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> {item.salaryGrowth}
                </span>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                item.scarcityStatus === 'HIGH_SCARCITY'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {item.talentAvailability}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Market Demand</span>
                <span className="font-black text-slate-900 text-sm">{item.marketDemand}/100</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Salary Benchmark</span>
                <span className="font-black text-emerald-700 text-sm">{item.avgSalaryRange}</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80">
              <span className="font-bold text-slate-800 block mb-0.5">Recommended Recruiter Action:</span>
              <p className="text-slate-500 text-[11px]">{item.recruiterAction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
