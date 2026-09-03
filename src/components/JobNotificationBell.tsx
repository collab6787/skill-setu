import React, { useState, useEffect, useRef, useMemo } from 'react';
import { JobOpening, StudentProfile, NotificationItem } from '../types';
import {
  Bell,
  Sparkles,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  X,
  ShieldCheck,
  MapPin,
  Building2,
  BookOpen,
  ArrowRight,
  Check
} from 'lucide-react';

export interface TailoredJobMatch {
  id: string;
  job: JobOpening;
  matchScore: number;
  matchTier: 'HIGH' | 'STRONG' | 'MODERATE';
  matchedSkills: { name: string; score: number; isRecent: boolean }[];
  missingSkills: string[];
  learningPathImpact: string;
  recentLearningBoost: number;
  timestamp: string;
  isNew: boolean;
  isRead: boolean;
}

interface JobNotificationBellProps {
  student?: StudentProfile;
  jobs?: JobOpening[];
  notifications?: NotificationItem[];
  onSelectJob: (jobId: string) => void;
  onNavigateToJobs: () => void;
  onNavigateToSkillSimulator?: (skillName: string) => void;
}

export const JobNotificationBell: React.FC<JobNotificationBellProps> = ({
  student,
  jobs = [],
  notifications = [],
  onSelectJob,
  onNavigateToJobs,
  onNavigateToSkillSimulator
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'alerts'>('all');
  const [readJobIds, setReadJobIds] = useState<Record<string, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Compute Tailored Job Matches based on current student skills & recent learning path progress
  const tailoredMatches: TailoredJobMatch[] = useMemo(() => {
    if (!student || !jobs.length) return [];

    const studentSkills = student.skills || [];
    const studentProjects = student.projects || [];
    const studentCerts = student.certifications || [];

    // Extract skills demonstrated in recent projects or certifications
    const recentDemonstratedSkills = new Set<string>();
    studentProjects.forEach(p => {
      p.skillsDemonstrated?.forEach(s => recentDemonstratedSkills.add(s.toLowerCase()));
    });
    studentCerts.forEach(c => {
      c.skillsDemonstrated?.forEach(s => recentDemonstratedSkills.add(s.toLowerCase()));
    });

    return jobs.map((job, index) => {
      let matchedSkillScoreSum = 0;
      let totalReq = job.requiredSkills.length || 1;
      const matchedSkillsList: { name: string; score: number; isRecent: boolean }[] = [];
      const missingSkillsList: string[] = [];
      let recentBoostPoints = 0;

      job.requiredSkills.forEach(req => {
        const found = studentSkills.find(
          s => s.skillName.toLowerCase() === req.skillName.toLowerCase() ||
               req.skillName.toLowerCase().includes(s.skillName.toLowerCase()) ||
               s.skillName.toLowerCase().includes(req.skillName.toLowerCase())
        );

        if (found && found.proficiencyScore > 0) {
          const isRecent = recentDemonstratedSkills.has(found.skillName.toLowerCase()) ||
                           found.evidenceCount > 0;
          matchedSkillsList.push({
            name: found.skillName,
            score: found.proficiencyScore,
            isRecent
          });

          // Proficiency ratio against job minimum
          const ratio = Math.min(1.2, found.proficiencyScore / (req.minProficiency || 50));
          matchedSkillScoreSum += ratio;

          if (isRecent) {
            recentBoostPoints += 4; // bonus points for recent verified project/cert evidence
          }
        } else {
          missingSkillsList.push(req.skillName);
        }
      });

      // Target role affinity
      const isTargetRole = student.targetRole && (
        job.title.toLowerCase().includes(student.targetRole.toLowerCase().split('/')[0]) ||
        job.roleCategory.toLowerCase().includes('ai')
      );

      const baseMatch = Math.round((matchedSkillScoreSum / totalReq) * 80);
      const targetRoleBonus = isTargetRole ? 8 : 0;
      const evidenceBonus = Math.min(10, recentBoostPoints);
      const calculatedScore = Math.min(96, Math.max(35, baseMatch + targetRoleBonus + evidenceBonus));

      // Tailored learning path impact narrative
      let impactText = '';
      if (job.id.includes('technova')) {
        impactText = 'Recent ML anomaly detector project & FastAPI learning module boosted your match score by +18%.';
      } else if (job.id.includes('razorpay')) {
        impactText = 'NPTEL SQL credential & Campus Pulse React project satisfy 3 out of 4 core full-stack criteria.';
      } else if (job.id.includes('google')) {
        impactText = 'Current Docker & containerization sprint will close the remaining prerequisite for this MLOps role.';
      } else if (job.id.includes('zomato')) {
        impactText = 'Verified crop classifier project & Advanced SQL credential directly fulfill 4/4 requirements.';
      } else {
        const recentSkillsMention = matchedSkillsList.filter(s => s.isRecent).map(s => s.name).slice(0, 2).join(' & ');
        if (recentSkillsMention) {
          impactText = `Recent hands-on progress in ${recentSkillsMention} boosted your fit by +${Math.max(12, evidenceBonus * 2)}%.`;
        } else {
          impactText = `Matches ${matchedSkillsList.length}/${totalReq} verified competencies from your Skill Passport.`;
        }
      }

      const tier: 'HIGH' | 'STRONG' | 'MODERATE' =
        calculatedScore >= 80 ? 'HIGH' : calculatedScore >= 65 ? 'STRONG' : 'MODERATE';

      const timestamps = ['12m ago', '45m ago', '2h ago', '5h ago', '1d ago'];

      return {
        id: job.id,
        job,
        matchScore: calculatedScore,
        matchTier: tier,
        matchedSkills: matchedSkillsList,
        missingSkills: missingSkillsList,
        learningPathImpact: impactText,
        recentLearningBoost: Math.max(10, evidenceBonus * 2),
        timestamp: timestamps[index % timestamps.length],
        isNew: index <= 1,
        isRead: !!readJobIds[job.id]
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [student, jobs, readJobIds]);

  const unreadJobMatchesCount = tailoredMatches.filter(m => !m.isRead).length;
  const highMatchesCount = tailoredMatches.filter(m => m.matchScore >= 80).length;

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated: Record<string, boolean> = {};
    tailoredMatches.forEach(m => {
      updated[m.id] = true;
    });
    setReadJobIds(updated);
  };

  const handleSelectJobMatch = (jobId: string) => {
    setReadJobIds(prev => ({ ...prev, [jobId]: true }));
    setIsOpen(false);
    onSelectJob(jobId);
  };

  const filteredItems = useMemo(() => {
    if (activeFilter === 'high') {
      return tailoredMatches.filter(m => m.matchScore >= 80);
    }
    return tailoredMatches;
  }, [activeFilter, tailoredMatches]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        id="nav-job-notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Job matches and notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`h-9 w-9 min-h-9 min-w-9 aspect-square shrink-0 rounded-full border flex items-center justify-center transition-all relative focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer ${
          isOpen
            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-xs'
        }`}
        title="Tailored Job Matches & Skill Alerts"
      >
        <Bell className="w-4 h-4 shrink-0 aspect-square" />
        
        {/* Unread Counter Badge with subtle animation */}
        {unreadJobMatchesCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 aspect-square shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 aspect-square bg-rose-600 text-white text-[9px] font-black items-center justify-center shadow-xs">
              {unreadJobMatchesCount}
            </span>
          </span>
        )}
      </button>

      {/* Tailored Dropdown Popover */}
      {isOpen && (
        <div
          id="job-notification-dropdown"
          className="absolute right-0 mt-2 w-[22rem] sm:w-[26rem] max-w-[calc(100vw-1.5rem)] bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 text-slate-800"
          role="dialog"
          aria-label="Tailored Job Matches"
        >
          {/* Header */}
          <div className="p-4 bg-[#071f1a] text-white flex items-start justify-between gap-2 border-b border-emerald-900/60">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-extrabold text-sm tracking-tight text-white">
                  Tailored Job Matches
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  AI Fit
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Matched to your verified Skill Passport & recent learning milestones
              </p>
            </div>

            <div className="flex items-center gap-1">
              {unreadJobMatchesCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-semibold text-emerald-300 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Mark all as read"
                >
                  <Check className="w-3 h-3" />
                  <span>Mark read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-3.5 py-2.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#071f1a] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Matches ({tailoredMatches.length})
              </button>
              <button
                onClick={() => setActiveFilter('high')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  activeFilter === 'high'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                High Fit 80%+ ({highMatchesCount})
              </button>
              <button
                onClick={() => setActiveFilter('alerts')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'alerts'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Alerts ({notifications.length})
              </button>
            </div>
          </div>

          {/* Body List */}
          <div className="max-h-96 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100/60">
            {activeFilter === 'alerts' ? (
              /* Alerts & System Notifications View */
              notifications.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No new platform alerts.
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setIsOpen(false);
                      if (n.actionUrl?.includes('job')) onNavigateToJobs();
                    }}
                    className={`pt-2.5 first:pt-0 p-2.5 rounded-2xl cursor-pointer text-xs transition-all hover:bg-slate-50 ${
                      n.read ? 'bg-white text-slate-600' : 'bg-emerald-50/60 border border-emerald-100/80 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{n.message}</p>
                  </div>
                ))
              )
            ) : filteredItems.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <Briefcase className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-slate-700">No matching jobs in this filter</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Adjust filter or submit new skill evidence to unlock more.</p>
              </div>
            ) : (
              filteredItems.map(item => {
                const isHigh = item.matchScore >= 80;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectJobMatch(item.id)}
                    className={`pt-2.5 first:pt-0 p-3 rounded-2xl cursor-pointer transition-all border ${
                      !item.isRead
                        ? 'bg-gradient-to-b from-emerald-50/30 to-white border-emerald-200/90 shadow-2xs hover:border-emerald-400 hover:shadow-xs'
                        : 'bg-white border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Header: Company, Role Title & Match Score Badge */}
                    <div className="flex items-start justify-between gap-2.5 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.job.companyLogo ? (
                          <img
                            src={item.job.companyLogo}
                            alt={item.job.companyName}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs ring-1 ring-slate-200 shrink-0">
                            <Building2 className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 truncate flex items-center gap-1.5">
                            <span className="truncate">{item.job.title}</span>
                            {item.isNew && !item.isRead && (
                              <span className="px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-800 text-[9px] font-black uppercase tracking-wider shrink-0">
                                New
                              </span>
                            )}
                          </h4>
                          <p className="text-[11px] font-semibold text-emerald-800 truncate">
                            {item.job.companyName}
                          </p>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-black shrink-0 flex items-center gap-1 shadow-2xs ${
                          isHigh
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}
                      >
                        <TrendingUp className="w-3 h-3" />
                        {item.matchScore}% Match
                      </span>
                    </div>

                    {/* Skill Alignment Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.matchedSkills.slice(0, 3).map(s => (
                        <span
                          key={s.name}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          {s.name} ({s.score}%)
                        </span>
                      ))}
                      {item.missingSkills.length > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/80 text-amber-800 text-[10px] font-medium">
                          +{item.missingSkills[0]} gap
                        </span>
                      )}
                    </div>

                    {/* Tailored Learning Path Progress Callout Box */}
                    <div className="p-2 bg-gradient-to-r from-emerald-50/80 to-teal-50/60 rounded-xl border border-emerald-100 text-[11px] text-slate-700 flex items-start gap-2 mb-2.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-bold text-emerald-950">Learning Path Impact: </span>
                        {item.learningPathImpact}
                      </div>
                    </div>

                    {/* Bottom Metadata & Action Trigger */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-bold text-slate-800">{item.job.packageRange}</span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-0.5 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {item.job.location.split(',')[0]}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 shrink-0">
                        <span>View Opening</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified with National Skill Passport</span>
            </div>
            
            <button
              onClick={() => {
                setIsOpen(false);
                onNavigateToJobs();
              }}
              className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Explore All Openings</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
