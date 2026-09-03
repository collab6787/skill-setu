import React, { useState } from 'react';
import { StudentProfile, SkillTrend } from '../types';
import {
  TrendingUp,
  Flame,
  ArrowUpRight,
  DollarSign,
  Briefcase,
  Sparkles,
  Zap,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface StudentSkillDemandViewProps {
  student: StudentProfile;
  skillTrends: SkillTrend[];
  onOpenSimulator?: (skillName: string) => void;
  onOpenRoadmap?: () => void;
}

export const StudentSkillDemandView: React.FC<StudentSkillDemandViewProps> = ({
  student,
  skillTrends,
  onOpenSimulator,
  onOpenRoadmap
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const studentSkillNames = (student?.skills || []).map(s => s.skillName.toLowerCase());

  const categories = ['ALL', 'AI & Machine Learning', 'Backend & APIs', 'Cloud & DevOps', 'Security'];

  const filteredTrends = skillTrends.filter(t => {
    if (selectedCategory === 'ALL') return true;
    return t.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Live Industry Skill Demand (Student View)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            What Skills Should I Learn Next?
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Real-time market demand aggregated from 1,200+ verified hiring partners.
            Compare your current skill stack against trending requirements to maximize CTC packages.
          </p>
        </div>

        {/* Expected Package Boost Card */}
        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Expected Package Improvement</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400">+₹3.5 LPA</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">By mastering Docker & Kubernetes</span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skill Demand Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrends.map(trend => {
          const isMastered = studentSkillNames.includes(trend.skillName.toLowerCase());

          return (
            <div
              key={trend.skillId}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isMastered ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200/80 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {trend.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                      trend.trendClassification === 'BOOMING'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    +{trend.growthRate}% YoY
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 flex items-center justify-between">
                  <span>{trend.skillName}</span>
                  {isMastered && (
                    <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> In Your Stack
                    </span>
                  )}
                </h3>

                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  High demand across top tech firms for junior to mid-level engineering positions.
                </p>

                {/* Demand & Salary Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Market Demand</span>
                    <span className="font-bold text-slate-800 text-sm">{trend.demandScore}/100</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                    <span className="text-emerald-700 block text-[10px] font-semibold">Average Package</span>
                    <span className="font-black text-emerald-900 text-sm">₹10 – ₹14 LPA</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                {onOpenSimulator && (
                  <button
                    onClick={() => onOpenSimulator(trend.skillName)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Simulate Salary Boost
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
