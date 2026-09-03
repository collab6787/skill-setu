import React, { useState } from 'react';
import { SkillBadge, StudentProfile } from '../types';
import {
  evaluateStudentBadges,
  calculateBadgeStats
} from '../services/badgeService';
import {
  Award,
  ShieldCheck,
  Terminal,
  Cloud,
  Cpu,
  Database,
  Zap,
  Layout,
  Server,
  Sparkles,
  Users,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  ChevronRight,
  Star,
  X,
  TrendingUp,
  Flame,
  Info,
  ExternalLink
} from 'lucide-react';

interface BadgeShowcaseProps {
  student: StudentProfile;
  onOpenEvidenceModal: (skillName?: string) => void;
  onOpenJobSimulator: (skillName?: string) => void;
  onOpenPassport: () => void;
  onSimulateSkillBoost?: (skillName: string, delta: number) => void;
}

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({
  student,
  onOpenEvidenceModal,
  onOpenJobSimulator,
  onOpenPassport,
  onSimulateSkillBoost
}) => {
  const [filter, setFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedBadge, setSelectedBadge] = useState<SkillBadge | null>(null);
  const [celebrationBadge, setCelebrationBadge] = useState<SkillBadge | null>(null);

  const badges = evaluateStudentBadges(student);
  const stats = calculateBadgeStats(badges);

  // Filter badges
  const filteredBadges = badges.filter(b => {
    if (filter === 'UNLOCKED' && !b.isUnlocked) return false;
    if (filter === 'LOCKED' && b.isUnlocked) return false;
    if (categoryFilter !== 'ALL' && b.category !== categoryFilter) return false;
    return true;
  });

  // Icon resolver
  const renderBadgeIcon = (iconType: string, className: string = 'w-6 h-6') => {
    switch (iconType) {
      case 'terminal':
        return <Terminal className={className} />;
      case 'cloud':
        return <Cloud className={className} />;
      case 'cpu':
        return <Cpu className={className} />;
      case 'database':
        return <Database className={className} />;
      case 'zap':
        return <Zap className={className} />;
      case 'layout':
        return <Layout className={className} />;
      case 'server':
        return <Server className={className} />;
      case 'sparkles':
        return <Sparkles className={className} />;
      case 'users':
        return <Users className={className} />;
      case 'shield':
      default:
        return <ShieldCheck className={className} />;
    }
  };

  // Color theme helpers based on Rarity
  const getRarityBadgeStyle = (rarity: string) => {
    switch (rarity) {
      case 'Legendary':
        return {
          pill: 'bg-amber-100 text-amber-900 border-amber-300',
          glow: 'from-amber-500/20 via-orange-500/10 to-transparent',
          border: 'border-amber-300/80 hover:border-amber-400',
          textAccent: 'text-amber-700',
          bgAccent: 'bg-amber-500',
          ring: 'ring-amber-400/40'
        };
      case 'Epic':
        return {
          pill: 'bg-purple-100 text-purple-900 border-purple-300',
          glow: 'from-purple-500/20 via-indigo-500/10 to-transparent',
          border: 'border-purple-300/80 hover:border-purple-400',
          textAccent: 'text-purple-700',
          bgAccent: 'bg-purple-600',
          ring: 'ring-purple-400/40'
        };
      case 'Rare':
        return {
          pill: 'bg-blue-100 text-blue-900 border-blue-300',
          glow: 'from-blue-500/20 via-sky-500/10 to-transparent',
          border: 'border-blue-300/80 hover:border-blue-400',
          textAccent: 'text-blue-700',
          bgAccent: 'bg-blue-600',
          ring: 'ring-blue-400/40'
        };
      case 'Common':
      default:
        return {
          pill: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          glow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
          border: 'border-emerald-300/80 hover:border-emerald-400',
          textAccent: 'text-emerald-700',
          bgAccent: 'bg-emerald-600',
          ring: 'ring-emerald-400/40'
        };
    }
  };

  const handleTestBoost = (badge: SkillBadge) => {
    if (onSimulateSkillBoost) {
      const needed = Math.max(10, badge.requiredProficiency - badge.currentProficiency + 5);
      onSimulateSkillBoost(badge.targetSkillName, needed);
      setCelebrationBadge({ ...badge, isUnlocked: true, currentProficiency: badge.requiredProficiency + 5 });
      setTimeout(() => setCelebrationBadge(null), 5000);
    }
    setSelectedBadge(null);
  };

  return (
    <div className="crextio-card p-5 sm:p-6 overflow-hidden relative">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/30 via-teal-100/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header with Title & Level Progress */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Skill & Competency Badges</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
              Level {stats.studentLevel.level} • {stats.studentLevel.title}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Badges unlock automatically as your verified proficiency and evidence reach target mastery thresholds.
          </p>
        </div>

        {/* XP Progress Bar & Summary Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 min-w-[200px]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>{stats.totalXpEarned} XP</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Next Level: {stats.studentLevel.nextLevelXp} XP
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
                style={{ width: `${stats.studentLevel.progressToNextLevel}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
              <span>{stats.unlockedCount} of {stats.totalBadges} Unlocked</span>
              <span>{stats.completionPercentage}% Mastered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Category Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({badges.length})
          </button>
          <button
            onClick={() => setFilter('UNLOCKED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === 'UNLOCKED'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Unlocked ({stats.unlockedCount})
          </button>
          <button
            onClick={() => setFilter('LOCKED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === 'LOCKED'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            In Progress ({stats.lockedCount})
          </button>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-[11px]">
          {['ALL', 'Proficiency', 'Infrastructure', 'Data & AI', 'Verification', 'Full-Stack'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#071f1a] text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Domains' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredBadges.map(badge => {
          const rarity = getRarityBadgeStyle(badge.rarity);
          const isUnlocked = badge.isUnlocked;

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`relative group p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-full ${
                isUnlocked
                  ? `bg-white ${rarity.border} shadow-2xs hover:shadow-md hover:-translate-y-0.5`
                  : 'bg-slate-50/70 border-slate-200/70 hover:bg-white hover:border-slate-300'
              }`}
            >
              {/* Top Row: Rarity Tag & XP Badge */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${rarity.pill}`}>
                    {badge.rarity}
                  </span>
                  <span className={`text-xs font-extrabold flex items-center gap-1 shrink-0 ${
                    isUnlocked ? 'text-amber-600' : 'text-slate-400'
                  }`}>
                    <Star className="w-3.5 h-3.5 fill-current shrink-0" />
                    +{badge.xpReward} XP
                  </span>
                </div>

                {/* Badge Visual Icon & Title */}
                <div className="flex items-start gap-3.5 mb-2.5">
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isUnlocked
                        ? `${rarity.bgAccent} text-white shadow-md ring-4 ${rarity.ring}`
                        : 'bg-slate-200/90 text-slate-400 border border-slate-300/80'
                    }`}>
                      {renderBadgeIcon(badge.iconType, 'w-6 h-6')}
                    </div>
                    {isUnlocked && (
                      <span
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-xs"
                        title="Verified Mastery"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug break-words">
                      {badge.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium leading-normal mt-0.5 break-words">
                      {badge.subtitle}
                    </p>
                  </div>
                </div>

                {/* Criteria Text - clean, readable, symmetric min-height */}
                <div className="min-h-[40px] flex items-center mb-3">
                  <p className="text-xs text-slate-600 leading-relaxed break-words">
                    {badge.criteriaText}
                  </p>
                </div>
              </div>

              {/* Bottom Row: Symmetrical Status / Progress Bar */}
              <div className="pt-3 border-t border-slate-200/70 mt-auto">
                {isUnlocked ? (
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1.5 font-semibold text-emerald-800">
                      <span className="flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Mastery Verified</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300/80 px-1.5 py-0.5 rounded text-[10px]">
                        {badge.currentProficiency}% Score
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-full" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-emerald-700 font-bold mt-1.5">
                      <span className="whitespace-nowrap font-medium text-slate-500">
                        Unlocked {badge.unlockedAt ? `• ${badge.unlockedAt}` : '• Active'}
                      </span>
                      <span className="flex items-center gap-0.5 group-hover:underline font-bold text-emerald-700">
                        Details <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1.5 font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>Progress</span>
                      </span>
                      <span className="font-mono text-slate-700">
                        {badge.currentProficiency} / {badge.requiredProficiency} pts ({badge.progressPercentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${badge.progressPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-emerald-700 font-bold mt-1.5">
                      <span>Needs +{Math.max(0, badge.requiredProficiency - badge.currentProficiency)} pts</span>
                      <span className="flex items-center gap-0.5 group-hover:underline font-bold">
                        Details <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredBadges.length === 0 && (
        <div className="py-12 text-center text-slate-500 text-xs">
          No badges match the selected filters.
        </div>
      )}

      {/* Floating Celebration Toast (Auto-closing: 6s) */}
      {celebrationBadge && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-3xl shadow-2xl border border-amber-400/50 flex flex-col gap-2.5 animate-in slide-in-from-bottom-5 duration-300 max-w-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-lg ring-4 ring-amber-400/30">
              <Award className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Badge Unlocked!
                </span>
              </div>
              <div className="font-bold text-sm text-white truncate">
                {celebrationBadge.title}
              </div>
              <div className="text-xs text-slate-300">
                +{celebrationBadge.xpReward} Skill XP awarded to your profile.
              </div>
            </div>
            <button
              onClick={() => setCelebrationBadge(null)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
              title="Close now"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* 6-second auto dismiss visual bar */}
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400/80 rounded-full animate-[pulse_1.5s_infinite]" style={{ width: '100%' }} />
          </div>
        </div>
      )}

      {/* Detailed Badge Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={e => {
            if (e.target === e.currentTarget) setSelectedBadge(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden">
            {/* Modal Header Ambient Glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${
              getRarityBadgeStyle(selectedBadge.rarity).glow
            } rounded-full blur-3xl pointer-events-none -mr-16 -mt-16`} />

            {/* Close Button */}
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badge Emblem Showcase */}
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg transition-transform ${
                selectedBadge.isUnlocked
                  ? `${getRarityBadgeStyle(selectedBadge.rarity).bgAccent} text-white ring-4 ${getRarityBadgeStyle(selectedBadge.rarity).ring}`
                  : 'bg-slate-200 text-slate-400 border border-slate-300'
              }`}>
                {renderBadgeIcon(selectedBadge.iconType, 'w-8 h-8')}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    getRarityBadgeStyle(selectedBadge.rarity).pill
                  }`}>
                    {selectedBadge.rarity}
                  </span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    +{selectedBadge.xpReward} XP
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedBadge.title}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedBadge.subtitle}</p>
              </div>
            </div>

            {/* Unlock Status Banner */}
            <div className={`p-3.5 rounded-2xl mb-4 text-xs flex items-center justify-between border ${
              selectedBadge.isUnlocked
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                : 'bg-slate-100/90 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-2">
                {selectedBadge.isUnlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <div>
                  <div className="font-bold">
                    {selectedBadge.isUnlocked ? 'Unlocked & Active on Profile' : 'Currently Locked'}
                  </div>
                  <div className="text-[11px] opacity-80">
                    {selectedBadge.isUnlocked
                      ? `Credential validated on ${selectedBadge.unlockedAt || 'recent evaluation'}`
                      : `${selectedBadge.requiredProficiency - selectedBadge.currentProficiency} more points needed to unlock`}
                  </div>
                </div>
              </div>

              <div className="font-mono font-bold text-sm">
                {selectedBadge.currentProficiency} / {selectedBadge.requiredProficiency}
              </div>
            </div>

            {/* Description & Requirements */}
            <div className="space-y-3 text-xs text-slate-600 mb-5">
              <div>
                <h5 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-1">
                  Description & Criteria
                </h5>
                <p className="leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  {selectedBadge.description}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-1">
                  Why Recruiters Value This
                </h5>
                <p className="leading-relaxed bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 text-emerald-950">
                  💡 {selectedBadge.industrySignificance}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedBadge(null);
                    onOpenEvidenceModal(selectedBadge.targetSkillName);
                  }}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Award className="w-4 h-4" />
                  <span>Add Evidence for {selectedBadge.targetSkillName}</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedBadge(null);
                    onOpenJobSimulator(selectedBadge.targetSkillName);
                  }}
                  className="py-2.5 px-3 bg-[#071f1a] hover:bg-[#0a2922] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm border border-emerald-900/40"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Simulate in Job Simulator</span>
                </button>
              </div>

              {/* Interactive Quick Boost for Demonstration / Testing */}
              {onSimulateSkillBoost && !selectedBadge.isUnlocked && (
                <button
                  onClick={() => handleTestBoost(selectedBadge)}
                  className="w-full py-2 px-3 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 rounded-xl text-xs font-bold border border-amber-200 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Simulate Level-Up to Unlock This Badge Instantly</span>
                </button>
              )}

              {selectedBadge.isUnlocked && (
                <button
                  onClick={() => {
                    setSelectedBadge(null);
                    onOpenPassport();
                  }}
                  className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View in Skill Passport Records</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
