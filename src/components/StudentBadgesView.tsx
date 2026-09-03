import React from 'react';
import { StudentProfile } from '../types';
import { BadgeShowcase } from './BadgeShowcase';
import { Zap, Award, Sparkles, TrendingUp } from 'lucide-react';

interface StudentBadgesViewProps {
  student: StudentProfile;
  onOpenEvidenceModal: (skillName?: string) => void;
  onOpenJobSimulator: (skillName?: string) => void;
  onOpenPassport: () => void;
  onSimulateSkillBoost?: (skillName: string, delta: number) => void;
}

export const StudentBadgesView: React.FC<StudentBadgesViewProps> = ({
  student,
  onOpenEvidenceModal,
  onOpenJobSimulator,
  onOpenPassport,
  onSimulateSkillBoost
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Gamified Credentialing & XP
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Badges & Experience Points (XP)
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Earn verifiable skill badges and national leaderboard XP by completing assessments, uploading verified projects, and obtaining peer endorsements.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Total Skill XP</span>
          <span className="text-3xl font-black text-emerald-400">3,450 XP</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">Level 6 • Senior Specialist</span>
        </div>
      </div>

      {/* Main Badge Showcase Engine */}
      <BadgeShowcase
        student={student}
        onOpenEvidenceModal={onOpenEvidenceModal}
        onOpenJobSimulator={onOpenJobSimulator}
        onOpenPassport={onOpenPassport}
        onSimulateSkillBoost={onSimulateSkillBoost}
      />
    </div>
  );
};
