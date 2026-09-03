import React from 'react';
import {
  TrendingUp,
  Sparkles,
  Flame,
  CheckCircle2,
  ArrowUpRight,
  BookOpen,
  DollarSign
} from 'lucide-react';

export const CollegeIndustryDemandView: React.FC = () => {
  const topDemandedSkills = [
    { name: 'Python', demandIndex: 98, hiringCount: '1,420 companies', growth: '+42% YoY', curriculumStatus: 'Partially Integrated' },
    { name: 'SQL & Database Optimization', demandIndex: 95, hiringCount: '1,280 companies', growth: '+38% YoY', curriculumStatus: 'Integrated' },
    { name: 'Docker & Kubernetes', demandIndex: 92, hiringCount: '980 companies', growth: '+56% YoY', curriculumStatus: 'Deficit Flagged (28%)' },
    { name: 'FastAPI / Node Microservices', demandIndex: 89, hiringCount: '850 companies', growth: '+48% YoY', curriculumStatus: 'Integrated' },
    { name: 'Machine Learning & PyTorch', demandIndex: 87, hiringCount: '780 companies', growth: '+62% YoY', curriculumStatus: 'Elective Only' },
    { name: 'Cloud Native AWS / GCP', demandIndex: 85, hiringCount: '740 companies', growth: '+45% YoY', curriculumStatus: 'Deficit Flagged' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Recruiter Market Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Industry Skill Demand (Curriculum Guidance)
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Direct telemetry from corporate hiring partners: Python and SQL are currently the highest-demand foundational skills.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Highest Demand Foundation</span>
          <span className="text-3xl font-black text-emerald-400">Python + SQL</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">Found in 95% of campus JDs</span>
        </div>
      </div>

      {/* Demand Cards Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">Highest-Demand Recruiter Competencies</h3>
          <span className="text-xs text-slate-500">Live 2026 Campus Hiring Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Skill Domain</th>
                <th className="py-3 px-4">Hiring Demand Index</th>
                <th className="py-3 px-4">Active Recruiters</th>
                <th className="py-3 px-4">YoY Growth</th>
                <th className="py-3 px-4 text-right">Campus Curriculum Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topDemandedSkills.map(s => (
                <tr key={s.name} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">{s.name}</td>
                  <td className="py-3.5 px-4 font-black text-emerald-700">{s.demandIndex}/100</td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">{s.hiringCount}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {s.growth}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        s.curriculumStatus.includes('Deficit')
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : s.curriculumStatus === 'Integrated'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {s.curriculumStatus}
                    </span>
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
