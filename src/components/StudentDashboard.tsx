import React from 'react';
import {
  StudentProfile,
  SkillGapItem,
  AIRecommendation,
  JobOpening,
  SkillPassport
} from '../types';
import {
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Award,
  BookOpen,
  Briefcase,
  AlertTriangle,
  QrCode,
  CheckCircle2,
  Lock,
  Users,
  Star,
  Target
} from 'lucide-react';
import { PassportReadinessRing } from './PassportReadinessRing';
import { BadgeShowcase } from './BadgeShowcase';
import { evaluateStudentBadges, calculateBadgeStats } from '../services/badgeService';

interface StudentDashboardProps {
  student: StudentProfile;
  gaps: SkillGapItem[];
  recommendation: AIRecommendation;
  jobs: JobOpening[];
  passport?: SkillPassport;
  onOpenJobSimulator: (skillName?: string) => void;
  onOpenPassport: () => void;
  onOpenEvidenceModal: (skillName?: string) => void;
  onOpenAadhaarModal: () => void;
  onOpenChat: () => void;
  onViewSkillIntelligence: () => void;
  onViewJobMatches: () => void;
  onNavigateToSkillGaps?: () => void;
  onSimulateSkillBoost?: (skillName: string, delta: number) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  gaps,
  recommendation,
  jobs,
  passport,
  onOpenJobSimulator,
  onOpenPassport,
  onOpenEvidenceModal,
  onOpenAadhaarModal,
  onOpenChat,
  onViewSkillIntelligence,
  onViewJobMatches,
  onNavigateToSkillGaps,
  onSimulateSkillBoost
}) => {
  const readiness = student.careerReadinessScore;
  const badges = evaluateStudentBadges(student);
  const badgeStats = calculateBadgeStats(badges);
  const unlockedBadges = badges.filter(b => b.isUnlocked);

  // Peer verification consensus lookup
  const verifiedEndorsements = passport?.endorsements?.filter(e => e.status === 'VERIFIED') || [];
  const isSkillPeerVerified = (skillName: string, directFlag?: boolean) => {
    if (directFlag) return true;
    return verifiedEndorsements.some(e =>
      e.skillName.toLowerCase().includes(skillName.toLowerCase()) ||
      skillName.toLowerCase().includes(e.skillName.toLowerCase())
    );
  };
  const getSkillEndorsers = (skillName: string, directList: string[] = []) => {
    const fromPassport = verifiedEndorsements
      .filter(e =>
        e.skillName.toLowerCase().includes(skillName.toLowerCase()) ||
        skillName.toLowerCase().includes(e.skillName.toLowerCase())
      )
      .map(e => e.endorserName);
    return fromPassport.length > 0 ? fromPassport : directList;
  };
  const peerVerifiedCount = student.skills.filter(s => isSkillPeerVerified(s.skillName, s.peerVerified)).length;

  // Overall Passport Readiness Calculation (Identity: 30%, Evidence: 35%, Endorsements: 35%)
  const isIdentityVerified =
    Boolean(student.identityVerification?.verified) ||
    student.identityVerification?.status === 'DEMO_VERIFIED' ||
    student.identityVerification?.status === 'AADHAAR_OTP_VERIFIED' ||
    student.identityVerification?.status === 'OFFICIAL_VERIFIED';
  const identityScore = isIdentityVerified ? 100 : 0;

  const totalVerifiedEvidence =
    (student.projects?.filter(p => p.verificationStatus === 'Verified').length || 0) +
    (student.certifications?.filter(c => c.verificationStatus === 'Verified').length || 0);
  const evidenceScore = Math.min(100, Math.round((totalVerifiedEvidence / 5) * 100));

  const totalVerifiedEndorsements = Math.max(
    verifiedEndorsements.length,
    student.peerVerifiedCount || 0
  );
  const endorsementsScore = Math.min(100, Math.round((totalVerifiedEndorsements / 3) * 100));

  const passportReadinessScore = Math.round(
    identityScore * 0.3 + evidenceScore * 0.35 + endorsementsScore * 0.35
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Welcome Header & KPI Pill Counters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-[22px] border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {student.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              {student.targetRole}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {student.collegeName} • Class of {student.graduationYear} (CGPA: {student.cgpa})
          </p>
        </div>

        {/* Metric Pill Counters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Passport Readiness Interactive Pill with Mini Radial Gauge */}
          <button
            type="button"
            onClick={onOpenPassport}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100/90 hover:to-teal-100/90 rounded-2xl flex items-center gap-2.5 border border-emerald-200/80 shadow-2xs transition-all text-left group cursor-pointer focus:outline-hidden"
            title="Passport Readiness: Click to view full Skill Passport"
          >
            <div className="relative w-8 h-8 min-w-8 min-h-8 aspect-square shrink-0 flex items-center justify-center">
              <svg width="32" height="32" className="transform -rotate-90">
                <circle cx="16" cy="16" r="12" fill="transparent" stroke="#e2e8f0" strokeWidth="3" />
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray={2 * Math.PI * 12}
                  strokeDashoffset={2 * Math.PI * 12 - (passportReadinessScore / 100) * (2 * Math.PI * 12)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-emerald-950">
                {passportReadinessScore}%
              </span>
            </div>
            <div>
              <div className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider">Passport Ready</div>
              <div className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                <span>{passportReadinessScore >= 90 ? 'Gold Tier' : 'Verifiable'}</span>
                <ArrowUpRight className="w-3 h-3 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            </div>
          </button>

          <div className="px-4 py-2 bg-[#071f1a] text-white rounded-2xl flex items-center gap-2.5 shadow-sm border border-emerald-900/40">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              {readiness.overall}
            </div>
            <div>
              <div className="text-[10px] text-emerald-300/70 uppercase font-bold tracking-wider">Career Readiness</div>
              <div className="text-xs font-semibold text-emerald-100">78/100 Top Tier</div>
            </div>
          </div>

          <div className="px-3.5 py-2 bg-slate-100/90 rounded-2xl flex items-center gap-2 border border-slate-200/70">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Verified Skills</div>
              <div className="text-xs font-bold text-slate-800">5 of 7 Active</div>
            </div>
          </div>

          <div className="px-3.5 py-2 bg-slate-100/90 rounded-2xl flex items-center gap-2 border border-slate-200/70">
            <Briefcase className="w-4 h-4 text-emerald-700" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Matching Jobs</div>
              <div className="text-xs font-bold text-slate-800">{jobs.length} Openings</div>
            </div>
          </div>

          <div className="px-3.5 py-2 bg-emerald-50/90 rounded-2xl flex items-center gap-2 border border-emerald-200/80 shadow-2xs">
            <Award className="w-4 h-4 text-emerald-600" />
            <div>
              <div className="text-[10px] text-emerald-800 uppercase font-bold">Skill Badges</div>
              <div className="text-xs font-bold text-emerald-950">{badgeStats.unlockedCount} of {badgeStats.totalBadges} Unlocked</div>
            </div>
          </div>

          {onNavigateToSkillGaps && (
            <button
              type="button"
              onClick={onNavigateToSkillGaps}
              className="px-3.5 py-2 bg-amber-50/90 hover:bg-amber-100/90 rounded-2xl flex items-center gap-2 border border-amber-200/80 transition-all cursor-pointer text-left shadow-2xs group"
            >
              <Target className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <div className="text-[10px] text-amber-800 uppercase font-bold">Skill Gaps & Recs</div>
                <div className="text-xs font-bold text-amber-950 flex items-center gap-1">
                  <span>{gaps.length} Deficits</span>
                  <ArrowUpRight className="w-3 h-3 text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Student Profile Badge & Aadhaar Verification Card (Col 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Profile Card (Alex Chen style from reference) */}
          <div className="crextio-card p-5 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-100/80 shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white ring-2 ring-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-lg text-slate-900">{student.name}</h3>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    {student.degree.split('-')[0]}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{student.department}</p>
                
                {/* Verification Status Badges */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200" title="Aadhaar Identity Authenticated">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {student.identityVerification.status === 'DEMO_VERIFIED' ? 'Aadhaar Verified' : 'Official Verified'}
                  </span>

                  {peerVerifiedCount > 0 && (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100/70 text-emerald-900 border border-emerald-300 shadow-2xs"
                      title={`${peerVerifiedCount} skills verified by classmates and hackathon teammates`}
                    >
                      <Users className="w-3.5 h-3.5 text-emerald-700" />
                      Peer-Verified ({peerVerifiedCount} Skills)
                    </span>
                  )}
                </div>

                {/* Top Honors / Badges Row */}
                {unlockedBadges.length > 0 && (
                  <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Honors:</span>
                    {unlockedBadges.slice(0, 2).map(b => (
                      <span
                        key={b.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200"
                        title={b.criteriaText}
                      >
                        <Star className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                        {b.title}
                      </span>
                    ))}
                    {unlockedBadges.length > 2 && (
                      <span className="text-[10px] font-bold text-slate-500">
                        +{unlockedBadges.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Aadhaar Details Box */}
            <div className="mt-4 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/60 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-500">
                <span>UIDAI Masked ID:</span>
                <span className="font-mono font-bold text-slate-800">{student.identityVerification.maskedNumber}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Auth Protocol:</span>
                <span className="text-[10px] text-slate-600 font-medium truncate max-w-[160px]">
                  {student.identityVerification.verificationSource.split('(')[0]}
                </span>
              </div>
              <button
                onClick={onOpenAadhaarModal}
                className="w-full mt-2 py-1.5 px-3 text-center text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50/70 hover:bg-emerald-100/90 active:scale-[0.98] rounded-xl transition-all border border-emerald-200/80 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                Re-Verify / Sandbox Identity
              </button>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={onOpenEvidenceModal}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Add Evidence</span>
              </button>

              <button
                onClick={onOpenPassport}
                className="py-2 px-3 bg-[#071f1a] hover:bg-[#0a2922] active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all border border-emerald-900/40 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>Skill Passport</span>
              </button>
            </div>
          </div>

          {/* Visual Progress Ring: Passport Readiness (Identity, Evidence, Endorsements) */}
          <PassportReadinessRing
            student={student}
            passport={passport}
            onOpenPassport={onOpenPassport}
            onOpenEvidenceModal={onOpenEvidenceModal}
            onOpenAadhaarModal={onOpenAadhaarModal}
          />

          {/* Career Readiness Score Breakdown */}
          <div className="crextio-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Career Readiness Diagnostic
              </h4>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                {readiness.overall}/100
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Skill Strength</span>
                  <span className="font-bold text-slate-900">{readiness.skillStrength}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${readiness.skillStrength}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Evidence & Verification</span>
                  <span className="font-bold text-slate-900">{readiness.evidenceStrength}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${readiness.evidenceStrength}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Industry Alignment</span>
                  <span className="font-bold text-slate-900">{readiness.industryAlignment}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${readiness.industryAlignment}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Role Match Readiness</span>
                  <span className="font-bold text-slate-900">{readiness.jobReadiness}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full" style={{ width: `${readiness.jobReadiness}%` }} />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-4 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              💡 {readiness.breakdownExplanation}
            </p>
          </div>
        </div>

        {/* Right Column: AI Next Best Skill, Gaps, Strongest Skills, Job Simulator Preview (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Skill Gap Diagnostics & AI Recommendation Link Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#071f1a] via-[#092b24] to-[#071f1a] border border-emerald-900/80 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30 shadow-inner">
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-700/60">
                    Dedicated Diagnostics
                  </span>
                  <span className="text-xs text-emerald-200/80">
                    {student.targetRole}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white mt-1">
                  Target Role Skill Gaps & AI Recommendations
                </h3>
                <p className="text-xs text-emerald-100/80 font-normal mt-0.5 max-w-xl">
                  {gaps.length} critical gaps identified. Detailed deficit analysis, benchmark comparisons, and explainable AI recommendations have been organized into a dedicated page.
                </p>
              </div>
            </div>

            {onNavigateToSkillGaps && (
              <button
                type="button"
                onClick={onNavigateToSkillGaps}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer self-start sm:self-auto"
              >
                <span>View Skill Gaps & Recs</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Badges & Engagement Milestones Showcase */}
          <BadgeShowcase
            student={student}
            onOpenEvidenceModal={onOpenEvidenceModal}
            onOpenJobSimulator={onOpenJobSimulator}
            onOpenPassport={onOpenPassport}
            onSimulateSkillBoost={onSimulateSkillBoost}
          />

          {/* Two-Column Sub-Grid: Strongest Skills vs Critical Skill Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strongest Skills */}
            <div className="crextio-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Your Strongest Skills
                </h4>
                <button
                  onClick={onViewSkillIntelligence}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
                >
                  View Trends <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3.5">
                {student.skills.slice(0, 4).map(skill => {
                  const isPeer = isSkillPeerVerified(skill.skillName, skill.peerVerified);
                  const endorsers = getSkillEndorsers(skill.skillName, skill.peerEndorsers);

                  return (
                    <div
                      key={skill.skillId}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isPeer
                          ? 'bg-gradient-to-br from-emerald-50/40 via-white to-slate-50/80 border-emerald-200/90 shadow-2xs'
                          : 'bg-slate-50/90 border-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-xs text-slate-900">{skill.skillName}</span>
                          {isPeer && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs"
                              title={`Peer-verified by: ${endorsers.join(', ')}`}
                            >
                              <Users className="w-3 h-3 text-emerald-600" />
                              <span>Peer-Verified</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                            {skill.proficiencyLevel} ({skill.proficiencyScore})
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden my-2">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-emerald-600"
                          style={{ width: `${skill.proficiencyScore}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{skill.confidenceScore}% confidence</span>
                        <span className="text-emerald-700 font-semibold">{skill.evidenceCount} verified items</span>
                      </div>

                      {/* Peer Verification Endorsement Detail */}
                      {isPeer ? (
                        <div className="mt-2 pt-2 border-t border-emerald-100/80 flex items-center justify-between text-[10px]">
                          <span className="text-emerald-800 font-semibold flex items-center gap-1 truncate max-w-[200px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{endorsers.length > 0 ? `Attested by ${endorsers.join(', ')}` : 'Classmate Consensus'}</span>
                          </span>
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/70 rounded text-[9px] font-mono font-bold shrink-0">
                            Consensus Valid
                          </span>
                        </div>
                      ) : (
                        <div className="mt-2 pt-1.5 border-t border-slate-200/50 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">Institutional proof only</span>
                          <button
                            onClick={onOpenPassport}
                            className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline flex items-center gap-0.5"
                          >
                            + Request Endorsement
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Role Diagnostics & Gaps Portal Summary Card */}
            <div className="crextio-card p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-600" />
                    Target Role Gap Diagnostics
                  </h4>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                    {gaps.length} Deficits
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Evaluated against real-time industry benchmarks for <strong className="text-slate-900">{student.targetRole}</strong>. 
                  All gap calculations, required levels, and AI recommendations are available on your dedicated Skill Gaps page.
                </p>

                <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/70 space-y-2 mb-4 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Target Role:</span>
                    <span className="font-bold text-slate-900">{student.targetRole}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Identified Gaps:</span>
                    <span className="font-bold text-rose-600">{gaps.length} Missing Competencies</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Top Recommended:</span>
                    <span className="font-bold text-emerald-700">{recommendation.recommendedSkill}</span>
                  </div>
                </div>
              </div>

              {onNavigateToSkillGaps && (
                <button
                  type="button"
                  onClick={onNavigateToSkillGaps}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Open Full Gap Diagnostics & Roadmap</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Matching Job Openings Preview */}
          <div className="crextio-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Recommended Industry Openings</h4>
                <p className="text-xs text-slate-500">Ranked by real-time skill matching algorithms</p>
              </div>
              <button
                onClick={onViewJobMatches}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                Browse All ({jobs.length}) <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {jobs.slice(0, 2).map(job => (
                <div key={job.id} className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">{job.title}</span>
                      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {job.id.includes('technova') ? '64% Match' : '72% Match'}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-800 mb-1">{job.companyName}</p>
                    <p className="text-[11px] text-slate-500 mb-3">{job.packageRange} • {job.workMode}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <span className="text-[10px] text-slate-400">{job.experienceRequired}</span>
                    <button
                      onClick={onViewJobMatches}
                      className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                    >
                      View & Apply <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
