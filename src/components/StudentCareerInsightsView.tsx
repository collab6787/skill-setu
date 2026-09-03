import React from 'react';
import { StudentProfile, SkillTrend } from '../types';
import { SalaryPotentialCalculator } from './SalaryPotentialCalculator';
import {
  TrendingUp,
  Sparkles,
  Target,
  DollarSign,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Award
} from 'lucide-react';

interface StudentCareerInsightsViewProps {
  student: StudentProfile;
  skillTrends: SkillTrend[];
  onOpenSimulator?: (skillName: string) => void;
  onOpenRoadmap?: () => void;
}

export const StudentCareerInsightsView: React.FC<StudentCareerInsightsViewProps> = ({
  student,
  skillTrends,
  onOpenSimulator,
  onOpenRoadmap
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-300" /> Career Readiness & CTC Projections
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Career Insights & Placement Readiness
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Predictive salary analytics, career trajectory modeling, and placement probability benchmarks based on verified SkillSetu data.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Placement Probability</span>
          <span className="text-3xl font-black text-emerald-400">92%</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">Campus Day-1 Eligibility</span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Readiness Index</span>
          <div className="text-3xl font-black text-slate-900 mt-1">78/100</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">Top 10% in Department</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Base CTC Projection</span>
          <div className="text-3xl font-black text-slate-900 mt-1">₹8.5 LPA</div>
          <span className="text-xs text-slate-500 mt-1 block">With current verified skills</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target CTC Potential</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">₹12 – ₹14 LPA</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">+₹3.5 LPA with Docker & Cloud</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Alumni Benchmark</span>
          <div className="text-3xl font-black text-slate-900 mt-1">3.4x</div>
          <span className="text-xs text-slate-500 mt-1 block">Higher interview callbacks</span>
        </div>
      </div>

      {/* Salary Potential Calculator Component */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" /> Interactive Salary & Package Calculator
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Simulate how acquiring specific in-demand skills shifts your market value across Indian tech hubs.
          </p>
        </div>

        <SalaryPotentialCalculator
          skillTrends={skillTrends}
          onSelectForJobSimulator={onOpenSimulator}
          initialSelectedSkillNames={['Python', 'FastAPI', 'Docker']}
        />
      </div>
    </div>
  );
};
