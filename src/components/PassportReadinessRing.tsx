import React from 'react';
import { StudentProfile, SkillPassport } from '../types';
import {
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  QrCode,
  Sparkles,
  Lock
} from 'lucide-react';

interface PassportReadinessRingProps {
  student: StudentProfile;
  passport?: SkillPassport;
  onOpenPassport: () => void;
  onOpenEvidenceModal: () => void;
  onOpenAadhaarModal: () => void;
}

export const PassportReadinessRing: React.FC<PassportReadinessRingProps> = ({
  student,
  passport,
  onOpenPassport,
  onOpenEvidenceModal,
  onOpenAadhaarModal
}) => {
  // --- 1. Pillar 1: Identity Verification (Weight: 30%) ---
  const isIdentityVerified =
    Boolean(student.identityVerification?.verified) ||
    student.identityVerification?.status === 'DEMO_VERIFIED' ||
    student.identityVerification?.status === 'AADHAAR_OTP_VERIFIED' ||
    student.identityVerification?.status === 'OFFICIAL_VERIFIED';

  const identityScore = isIdentityVerified ? 100 : 0;

  // --- 2. Pillar 2: Evidence Uploads (Projects & Certifications) (Weight: 35%) ---
  const TARGET_EVIDENCE = 5;
  const verifiedProjectsCount =
    student.projects?.filter(p => p.verificationStatus === 'Verified').length ||
    passport?.verifiedProjectsCount ||
    0;
  const verifiedCertsCount =
    student.certifications?.filter(c => c.verificationStatus === 'Verified').length ||
    passport?.verifiedCertificationsCount ||
    0;
  const totalVerifiedEvidence = verifiedProjectsCount + verifiedCertsCount;
  const evidenceScore = Math.min(100, Math.round((totalVerifiedEvidence / TARGET_EVIDENCE) * 100));

  // --- 3. Pillar 3: Completed Endorsements (Peer consensus) (Weight: 35%) ---
  const TARGET_ENDORSEMENTS = 3;
  const verifiedEndorsementsList =
    passport?.endorsements?.filter(e => e.status === 'VERIFIED') || [];
  const verifiedEndorsementsCount = Math.max(
    verifiedEndorsementsList.length,
    student.peerVerifiedCount || 0
  );
  const endorsementsScore = Math.min(
    100,
    Math.round((verifiedEndorsementsCount / TARGET_ENDORSEMENTS) * 100)
  );

  // --- Overall Composite Readiness Score ---
  const overallScore = Math.round(
    identityScore * 0.3 + evidenceScore * 0.35 + endorsementsScore * 0.35
  );

  // SVG Progress Ring Geometry
  const size = 136;
  const strokeWidth = 11;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  // Tier Status
  const getTierInfo = (score: number) => {
    if (score >= 90) {
      return {
        tier: 'Gold Tier',
        label: 'Recruiter Verified',
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotColor: 'bg-emerald-500'
      };
    }
    if (score >= 70) {
      return {
        tier: 'Silver Tier',
        label: 'Verifiable Pass',
        badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
        dotColor: 'bg-blue-500'
      };
    }
    return {
      tier: 'Bronze Tier',
      label: 'Setup Pending',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      dotColor: 'bg-amber-500'
    };
  };

  const tierInfo = getTierInfo(overallScore);

  return (
    <div
      id="passport-readiness-card"
      className="crextio-card p-5 relative overflow-hidden transition-all hover:shadow-md"
    >
      {/* Decorative gradient corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header with Title and Tier Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 min-w-8 min-h-8 aspect-square shrink-0 rounded-xl bg-gradient-to-tr from-[#071f1a] to-emerald-800 flex items-center justify-center text-white shadow-2xs">
            <QrCode className="w-4 h-4 shrink-0 aspect-square text-emerald-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
              Passport Readiness
            </h3>
            <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
              Cryptographic Skill Passport Index
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border shrink-0 ${tierInfo.badgeColor}`}
        >
          <span className={`w-1.5 h-1.5 aspect-square rounded-full shrink-0 ${tierInfo.dotColor} animate-pulse`} />
          {tierInfo.tier}
        </span>
      </div>

      {/* Main Ring & Summary Layout */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-1.5">
        
        {/* Visual Progress Ring */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg
            width={size}
            height={size}
            className="transform -rotate-90"
            role="progressbar"
            aria-valuenow={overallScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Passport Readiness: ${overallScore}%`}
          >
            <defs>
              <linearGradient id="passportReadinessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>

            {/* Background Track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
              className="opacity-70"
            />

            {/* Dynamic Progress Stroke */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="url(#passportReadinessGrad)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
            <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              {overallScore}%
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mt-1">
              Readiness
            </span>
            <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full mt-0.5 border border-emerald-200/60">
              {tierInfo.label}
            </span>
          </div>
        </div>

        {/* Readiness Description & Quick Impact */}
        <div className="flex-1 min-w-0 space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1 text-xs font-bold text-slate-900">
            <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0 aspect-square" />
            <span>Tamper-Proof Credential</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {overallScore >= 90
              ? 'Your passport satisfies all 3 national accreditation tiers. Verified by UIDAI, verified artifacts, and peer consensus.'
              : overallScore >= 70
              ? 'Your passport is active and verifiable. Complete remaining evidence or endorsements to achieve full 100% Gold tier.'
              : 'Complete pending identity and peer checks to activate your public QR verification badge.'}
          </p>

          <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
            <button
              onClick={onOpenPassport}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 hover:text-emerald-900 group"
            >
              <span>Inspect Skill Passport</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Pillar Progress Trackers */}
      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
        
        {/* Pillar 1: Identity Verification */}
        <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`w-6 h-6 min-w-6 min-h-6 aspect-square shrink-0 rounded-lg flex items-center justify-center ${
                  isIdentityVerified
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 aspect-square" />
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-900">Identity Verification</span>
                <span className="text-[10px] text-slate-500 ml-1.5 hidden sm:inline">
                  (UIDAI Token)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isIdentityVerified
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {isIdentityVerified ? 'Verified (100%)' : 'Pending (0%)'}
              </span>
              {!isIdentityVerified && (
                <button
                  onClick={onOpenAadhaarModal}
                  className="text-[10px] font-bold text-emerald-700 hover:underline"
                >
                  Verify
                </button>
              )}
            </div>
          </div>

          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isIdentityVerified ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
              style={{ width: `${identityScore}%` }}
            />
          </div>
        </div>

        {/* Pillar 2: Evidence Uploads */}
        <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 min-w-6 min-h-6 aspect-square shrink-0 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Award className="w-3.5 h-3.5 shrink-0 aspect-square" />
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-900">Evidence Uploads</span>
                <span className="text-[10px] text-slate-500 ml-1.5 hidden sm:inline">
                  ({totalVerifiedEvidence}/{TARGET_EVIDENCE} verified)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {totalVerifiedEvidence >= TARGET_EVIDENCE
                  ? 'Complete (100%)'
                  : `${totalVerifiedEvidence}/${TARGET_EVIDENCE} (${evidenceScore}%)`}
              </span>
              <button
                onClick={onOpenEvidenceModal}
                className="text-[10px] font-bold text-emerald-700 hover:underline"
                title="Add new project or certification evidence"
              >
                + Add
              </button>
            </div>
          </div>

          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${evidenceScore}%` }}
            />
          </div>
        </div>

        {/* Pillar 3: Completed Endorsements */}
        <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 min-w-6 min-h-6 aspect-square shrink-0 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 shrink-0 aspect-square" />
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-900">Completed Endorsements</span>
                <span className="text-[10px] text-slate-500 ml-1.5 hidden sm:inline">
                  ({verifiedEndorsementsCount}/{TARGET_ENDORSEMENTS} consensus)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                {verifiedEndorsementsCount >= TARGET_ENDORSEMENTS
                  ? 'Consensus Met (100%)'
                  : `${verifiedEndorsementsCount}/${TARGET_ENDORSEMENTS} (${endorsementsScore}%)`}
              </span>
              <button
                onClick={onOpenPassport}
                className="text-[10px] font-bold text-teal-700 hover:underline"
                title="View peer endorsements or request new ones"
              >
                View
              </button>
            </div>
          </div>

          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-500"
              style={{ width: `${endorsementsScore}%` }}
            />
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="mt-3.5 flex items-center justify-between gap-2">
        <button
          onClick={onOpenPassport}
          className="flex-1 py-2 px-3 bg-[#071f1a] hover:bg-[#0a2922] active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all focus:outline-hidden border border-emerald-900/40"
        >
          <QrCode className="w-3.5 h-3.5 text-emerald-400 shrink-0 aspect-square" />
          <span>View Passport & QR</span>
        </button>

        <button
          onClick={onOpenEvidenceModal}
          className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 active:scale-98 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border border-emerald-200/80 transition-all focus:outline-hidden cursor-pointer"
        >
          <Award className="w-3.5 h-3.5 shrink-0 aspect-square text-emerald-600" />
          <span>Add Proof</span>
        </button>
      </div>
    </div>
  );
};
