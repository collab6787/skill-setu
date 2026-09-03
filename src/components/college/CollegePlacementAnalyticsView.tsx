import React from 'react';
import {
  TrendingUp,
  Award,
  DollarSign,
  Briefcase,
  Users,
  CheckCircle2,
  PieChart
} from 'lucide-react';

export const CollegePlacementAnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Placement Records & Salary CTC
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Placement Analytics & Compensation
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Consolidated campus placement statistics, package distribution tiers, and verified offer letters for Batch 2026.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Placement Conversion Rate</span>
          <span className="text-3xl font-black text-emerald-400">82.1%</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">1,428 Students Placed</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Average CTC Package</span>
          <div className="text-3xl font-black text-slate-900 mt-1">₹8.4 LPA</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">+14% vs Last Year</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Highest CTC Package</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">₹38.5 LPA</div>
          <span className="text-xs text-slate-500 mt-1 block">Offered by TechNova AI Labs</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Median CTC</span>
          <div className="text-3xl font-black text-slate-900 mt-1">₹7.8 LPA</div>
          <span className="text-xs text-slate-500 mt-1 block">Tier-1 Core Engineering</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Recruiter Offers</span>
          <div className="text-3xl font-black text-slate-900 mt-1">1,890</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">Multiple Dream Offers: 34%</span>
        </div>
      </div>

      {/* Package Tier Distribution Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">CTC Package Distribution Tiers</h3>
        <div className="space-y-3">
          {[
            { tier: 'Super Dream (> ₹15 LPA)', count: 210, percentage: 15, color: 'bg-emerald-600' },
            { tier: 'Dream (₹10 – ₹15 LPA)', count: 520, percentage: 36, color: 'bg-teal-600' },
            { tier: 'Standard (₹6 – ₹10 LPA)', count: 560, percentage: 39, color: 'bg-blue-600' },
            { tier: 'Base (₹4 – ₹6 LPA)', count: 138, percentage: 10, color: 'bg-slate-400' }
          ].map(t => (
            <div key={t.tier} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{t.tier}</span>
                <span className="text-slate-500">{t.count} Students ({t.percentage}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
