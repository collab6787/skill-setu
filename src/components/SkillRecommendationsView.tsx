import React, { useState } from 'react';
import {
  Sparkles,
  Target,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Briefcase,
  Radio,
  Award,
  Layers,
  Zap,
  Filter,
  BookOpen,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import {
  StudentProfile,
  SkillGapItem,
  AIRecommendation
} from '../types';

export interface SkillRecommendationsViewProps {
  student: StudentProfile;
  gaps: SkillGapItem[];
  recommendation: AIRecommendation;
  onNavigateToDashboard?: () => void;
  onOpenJobSimulator?: (skillName: string) => void;
  onOpenEvidenceModal?: (skillName: string) => void;
  onOpenChat?: () => void;
}

export const SkillRecommendationsView: React.FC<SkillRecommendationsViewProps> = ({
  student,
  gaps,
  recommendation,
  onNavigateToDashboard,
  onOpenJobSimulator,
  onOpenEvidenceModal,
  onOpenChat
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Categories extracted from gaps
  const categories = ['ALL', ...Array.from(new Set(gaps.map(g => g.category)))];

  const filteredGaps = gaps.filter(gap => {
    const matchesPriority = priorityFilter === 'ALL' || gap.priority === priorityFilter;
    const matchesCategory = selectedCategory === 'ALL' || gap.category === selectedCategory;
    return matchesPriority && matchesCategory;
  });

  const highPriorityCount = gaps.filter(g => g.priority === 'HIGH').length;
  const mediumPriorityCount = gaps.filter(g => g.priority === 'MEDIUM').length;

  return (
    <div id="skill-recommendations-page" className="space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* 1. TOP BREADCRUMB & PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {onNavigateToDashboard && (
              <button
                type="button"
                onClick={onNavigateToDashboard}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Student Dashboard</span>
              </button>
            )}
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <Target className="w-3 h-3 text-emerald-600" />
              <span>Skill Gap Diagnostics & AI Recommendation</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Target Role Skill Gaps & Personalized AI Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Diagnostic comparison for <span className="font-bold text-slate-800">{student.name}</span> aiming for{' '}
            <span className="font-bold text-emerald-800">{student.targetRole}</span>.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onOpenJobSimulator && (
            <button
              type="button"
              onClick={() => onOpenJobSimulator(recommendation.recommendedSkill)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>Launch Simulator</span>
            </button>
          )}

          {onOpenChat && (
            <button
              type="button"
              onClick={onOpenChat}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 active:scale-98 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Ask AI Mentor</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. DIAGNOSTIC MACRO SUMMARY TILES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Role</span>
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-1 truncate">
            {student.targetRole}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Benchmark: Top 15% Industry
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Identified Gaps</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {gaps.length} <span className="text-xs font-semibold text-slate-500 font-sans">competencies</span>
          </div>
          <div className="text-[11px] text-rose-700 font-semibold mt-1">
            {highPriorityCount} High Priority • {mediumPriorityCount} Medium
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Next Best Skill</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm sm:text-base font-black text-emerald-800 mt-1 truncate">
            {recommendation.recommendedSkill}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            Est. {recommendation.estimatedTimeToLearn}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Projected Boost</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-sm sm:text-base font-black text-emerald-600 mt-1">
            {recommendation.projectedOpportunityImpact}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            Potential salary increase
          </div>
        </div>
      </div>

      {/* 3. SECTION: AI "NEXT BEST SKILL" RECOMMENDATION SPOTLIGHT */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071f1a] via-[#092b24] to-[#071f1a] text-white p-6 sm:p-8 lg:p-10 border border-emerald-900/80 shadow-xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-emerald-400" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Explainable AI • Top Recommendation</span>
            </span>
            <span className="text-xs text-emerald-200/70">
              Personalized algorithmic ranking for {student.targetRole}
            </span>
          </div>

          <div>
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
              Recommended Skill: <span className="text-white text-base font-black underline decoration-emerald-500 decoration-2">{recommendation.recommendedSkill}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {recommendation.headline}
            </h2>
          </div>

          {/* Justification Reasons */}
          <div className="space-y-2.5 bg-emerald-950/60 p-4 sm:p-5 rounded-2xl border border-emerald-800/60">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
              Why the Algorithm Recommends This:
            </div>
            {recommendation.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>

          {/* Unlocks and Projected Career Impact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-emerald-900/30 rounded-2xl border border-emerald-800/50">
              <div className="text-[10px] text-emerald-300/70 font-bold uppercase tracking-wider">Estimated Learning Time</div>
              <div className="text-base font-black text-white mt-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>{recommendation.estimatedTimeToLearn}</span>
              </div>
              <div className="text-[11px] text-emerald-200/60 mt-1">Self-paced with sample project</div>
            </div>

            <div className="p-4 bg-emerald-900/30 rounded-2xl border border-emerald-800/50">
              <div className="text-[10px] text-emerald-300/70 font-bold uppercase tracking-wider">Opportunity Increase</div>
              <div className="text-base font-black text-emerald-300 mt-1 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>{recommendation.projectedOpportunityImpact}</span>
              </div>
              <div className="text-[11px] text-emerald-200/60 mt-1">Based on current industry hires</div>
            </div>

            <div className="p-4 bg-emerald-900/30 rounded-2xl border border-emerald-800/50">
              <div className="text-[10px] text-emerald-300/70 font-bold uppercase tracking-wider">High-Value Roles Unlocked</div>
              <div className="text-xs font-bold text-white mt-1.5 flex flex-wrap gap-1">
                {recommendation.unlockedRoles.map((role, rIdx) => (
                  <span key={rIdx} className="px-2 py-0.5 bg-emerald-950/80 rounded-md border border-emerald-700/60 text-[10px] text-emerald-200">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* High-Impact Suggested Project */}
          {recommendation.unlockedProjects && recommendation.unlockedProjects.length > 0 && (
            <div className="p-4 bg-emerald-900/40 rounded-2xl border border-emerald-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Recommended Capstone to Prove Mastery</span>
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-white mt-0.5">
                  {recommendation.unlockedProjects[0]}
                </div>
                <div className="text-[11px] text-emerald-200/70 mt-0.5">
                  Build and upload this repository to automatically verify {recommendation.recommendedSkill} on your Skill Passport.
                </div>
              </div>

              {onOpenEvidenceModal && (
                <button
                  type="button"
                  onClick={() => onOpenEvidenceModal(recommendation.recommendedSkill)}
                  className="px-3.5 py-2 bg-white hover:bg-emerald-50 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
                >
                  <Award className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Upload Repo Proof</span>
                </button>
              )}
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {onOpenJobSimulator && (
              <button
                type="button"
                onClick={() => onOpenJobSimulator(recommendation.recommendedSkill)}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <Radio className="w-4 h-4 text-slate-950" />
                <span>Simulate {recommendation.recommendedSkill} in Job Simulator</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}

            {onOpenEvidenceModal && (
              <button
                type="button"
                onClick={() => onOpenEvidenceModal(recommendation.recommendedSkill)}
                className="px-4 py-3 bg-emerald-900/60 hover:bg-emerald-800/80 text-white rounded-xl text-xs font-bold border border-emerald-700/60 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Award className="w-4 h-4 text-emerald-300" />
                <span>Add Evidence for {recommendation.recommendedSkill}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. SECTION: CRITICAL SKILL GAPS BREAKDOWN & DEFICIT ANALYSIS */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Target Role Benchmarks vs Current Proficiency</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Detailed Skill Gap Diagnostics ({filteredGaps.length} Listed)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Each deficit is computed against real-time hiring benchmarks for {student.targetRole}.
            </p>
          </div>

          {/* Filters: Priority & Category */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Selector */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setPriorityFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  priorityFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All Priorities ({gaps.length})
              </button>
              <button
                type="button"
                onClick={() => setPriorityFilter('HIGH')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  priorityFilter === 'HIGH' ? 'bg-rose-500 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                High Priority ({highPriorityCount})
              </button>
              <button
                type="button"
                onClick={() => setPriorityFilter('MEDIUM')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  priorityFilter === 'MEDIUM' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Medium ({mediumPriorityCount})
              </button>
            </div>

            {/* Category Dropdown */}
            {categories.length > 2 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter skill gaps by category"
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'ALL' ? 'All Tracks' : cat}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Detailed Gap Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGaps.map((gap) => {
            const isTopRecommended = gap.skillName === recommendation.recommendedSkill;

            return (
              <div
                key={gap.skillId}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                  isTopRecommended
                    ? 'bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 border-emerald-300 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200/90 shadow-2xs hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Top line: Category, Priority Badge, Top Recommendation chip */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {gap.category}
                      </span>
                      {isTopRecommended && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Top Recommended</span>
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                        gap.priority === 'HIGH'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {gap.priority} Priority
                    </span>
                  </div>

                  {/* Skill Name & Deficit */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">
                        {gap.skillName}
                      </h3>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Market Demand Index: <strong>{gap.marketDemand}/100</strong></span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">+{gap.growthRate}% Growth</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-rose-600">
                        -{gap.gapScore} pts
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Deficit
                      </div>
                    </div>
                  </div>

                  {/* Visual Proficiency Comparison Bar */}
                  <div className="space-y-1.5 my-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Current: <strong className="text-slate-900">{gap.currentProficiency}/100</strong> ({gap.currentLevel})</span>
                      <span>Target: <strong className="text-emerald-800">{gap.requiredProficiency}/100</strong> ({gap.requiredLevel})</span>
                    </div>

                    {/* Comparative double bar */}
                    <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      {/* Required benchmark indicator */}
                      <div
                        className="absolute top-0 bottom-0 bg-emerald-200/80 rounded-full"
                        style={{ width: `${gap.requiredProficiency}%` }}
                      />
                      {/* Current student score */}
                      <div
                        className="absolute top-0 bottom-0 bg-emerald-600 rounded-full"
                        style={{ width: `${gap.currentProficiency}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                      <span>0 pts</span>
                      <span className="text-emerald-700 font-semibold">Deficit: {gap.gapScore} points needed</span>
                      <span>100 pts</span>
                    </div>
                  </div>

                  {/* Recommendation Reason */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {gap.recommendationReason}
                  </p>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {onOpenJobSimulator && (
                    <button
                      type="button"
                      onClick={() => onOpenJobSimulator(gap.skillName)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Simulate Impact</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}

                  {onOpenEvidenceModal && (
                    <button
                      type="button"
                      onClick={() => onOpenEvidenceModal(gap.skillName)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-slate-600" />
                      <span>Submit Proof</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. STRATEGIC BRIDGING ROADMAP & OUTCOME PROJECTION */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <Layers className="w-3 h-3 text-emerald-600" />
              <span>Employability Transformation</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Projected Profile Transformation Upon Closing Gaps
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Closing your top 2 gaps unlocks significant recruitment opportunities across verified hiring partners.
            </p>
          </div>

          {onOpenJobSimulator && (
            <button
              type="button"
              onClick={() => onOpenJobSimulator(recommendation.recommendedSkill)}
              className="px-4 py-2 bg-[#071f1a] hover:bg-[#0a2922] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start md:self-auto"
            >
              <span>Launch Interactive Job Simulator</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          )}
        </div>

        {/* Before vs After Impact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Role Match</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-bold text-slate-500 line-through">64%</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-2xl font-black text-emerald-600">88% Match</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">+24% immediate gain</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Career Readiness Score</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-bold text-slate-500 line-through">{student.careerReadinessScore.overall}/100</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-2xl font-black text-emerald-600">92/100</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">Elevates to Gold Tier</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Eligible Verified Jobs</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-lg font-bold text-slate-500 line-through">4 Roles</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-2xl font-black text-emerald-600">11 Roles</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">+7 new company openings</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Projected Salary Band</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xs font-bold text-slate-500">₹4.5–6.5 LPA</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-sm font-black text-emerald-600">₹7.0–10.0 LPA</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">+₹2.5 to ₹3.5 LPA boost</div>
          </div>
        </div>
      </section>

    </div>
  );
};

export const StudentSkillGapsView = SkillRecommendationsView;
