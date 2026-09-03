import React from 'react';
import {
  Layers,
  AlertTriangle,
  TrendingDown,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface CollegeSkillGapAnalysisViewProps {
  onOpenCurriculumModal?: () => void;
}

export const CollegeSkillGapAnalysisView: React.FC<CollegeSkillGapAnalysisViewProps> = ({
  onOpenCurriculumModal
}) => {
  const departmentalGaps = [
    {
      department: 'Computer Science (CSE)',
      gapPercentage: 28,
      missingSkill: 'Cloud Deployment & Docker',
      marketDemand: '92/100',
      impact: 'High • Restricts 35% of cloud engineering hiring partners',
      recommendation: 'Introduce Containerization Lab in Semester 6 curriculum.'
    },
    {
      department: 'Information Tech (IT)',
      gapPercentage: 32,
      missingSkill: 'Distributed Systems & Vector DBs',
      marketDemand: '88/100',
      impact: 'High • Restricts AI infrastructure roles',
      recommendation: 'Partner with industry cloud credits for hands-on vector store indexing.'
    },
    {
      department: 'AI & Data Science',
      gapPercentage: 18,
      missingSkill: 'Production ML Serving & Monitoring',
      marketDemand: '94/100',
      impact: 'Medium • High theoretical foundation, lower deployment exposure',
      recommendation: 'Mandate asynchronous API serving project for final year.'
    },
    {
      department: 'Electronics & Communication (ECE)',
      gapPercentage: 42,
      missingSkill: 'Embedded C++ & Edge AI Inferencing',
      marketDemand: '80/100',
      impact: 'High • Restricts IoT and automotive tier-1 campus offers',
      recommendation: 'Setup FPGA and Edge TPU acceleration training cohort.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/40 mb-2">
            <AlertTriangle className="w-3.5 h-3.5" /> Institutional Skill Deficit Radar
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Skill Gap Analysis (Campus vs Industry)
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Real-time delta between university syllabi and verified hiring demand.
            Identifies urgent curriculum adjustments required to maximize student placement rates.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-amber-300 font-bold block">Top Institutional Gap</span>
          <span className="text-3xl font-black text-amber-400">28% Cloud</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">Flagged in CSE Dept</span>
        </div>
      </div>

      {/* Insight Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="font-bold">
            CSE students have a 28% Cloud skill gap • Placement readiness increased 12% this semester • Python and SQL are currently highest demand
          </span>
        </div>
      </div>

      {/* Department Gap Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {departmentalGaps.map(g => (
          <div
            key={g.department}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-slate-900">{g.department}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                  {g.gapPercentage}% Skill Deficit
                </span>
              </div>

              <h4 className="text-base font-black text-slate-800">{g.missingSkill}</h4>
              <p className="text-xs text-slate-500 mt-1">{g.impact}</p>

              <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Recruiter Demand Index:</span>
                  <span className="font-bold text-emerald-800">{g.marketDemand}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium mb-1">Recommended Intervention:</span>
                  <span className="font-semibold text-slate-700 block">{g.recommendation}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> NAAC Criterion 1.2 Aligned
              </span>
              <button
                onClick={onOpenCurriculumModal}
                className="text-xs font-bold text-slate-800 hover:text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Syllabus Adjustment <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
