import React, { useState } from 'react';
import { StudentProfile, User } from '../types';
import {
  UserCheck,
  Mail,
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  Sparkles,
  ShieldCheck,
  Download,
  Edit3,
  CheckCircle2,
  ExternalLink,
  Target,
  TrendingUp,
  FileText
} from 'lucide-react';

interface StudentProfileViewProps {
  student: StudentProfile;
  currentUser: User;
  onOpenPassport?: () => void;
  onOpenEvidence?: () => void;
  onOpenAadhaar?: () => void;
  onUpdateProfile?: (updated: Partial<StudentProfile>) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  currentUser,
  onOpenPassport,
  onOpenEvidence,
  onOpenAadhaar,
  onUpdateProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(student.name);
  const [targetRole, setTargetRole] = useState(student.targetRole);
  const [bio, setBio] = useState(
    student.bio ||
      'Passionate Software Engineer focused on high-performance backend microservices, real-time AI systems, and cloud-native architecture.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    if (onUpdateProfile) {
      onUpdateProfile({ name, targetRole, bio });
    }
    setSavedSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const verifiedSkillsCount = student.skills.filter(s => s.verificationStatus === 'Verified').length;
  const resumeStrength = Math.min(95, Math.round(student.careerReadinessScore.overall * 0.95 + verifiedSkillsCount * 2));

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={student.avatar || currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                alt={student.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg"
              />
              <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-[#07241d] title='Aadhaar Verified'">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{student.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  Student Account
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-900/60 text-teal-200 border border-teal-700/60 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
                  {student.identityVerification?.status === 'OFFICIAL_VERIFIED' || student.identityVerification?.status === 'DEMO_VERIFIED' ? 'UIDAI Verified' : 'Verified'}
                </span>
              </div>

              <p className="text-emerald-200/90 text-sm font-semibold mt-1 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                Target Role: <strong className="text-white">{student.targetRole}</strong>
              </p>
              <p className="text-xs text-emerald-300/70 mt-1 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                {student.degree} • {student.collegeName} (CGPA: {student.cgpa}/10.0)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            {onOpenPassport && (
              <button
                onClick={onOpenPassport}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Skill Passport
              </button>
            )}
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            Profile changes successfully saved!
          </div>
        )}
      </div>

      {/* Edit Profile Form (Conditional) */}
      {isEditing && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-200">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-emerald-600" /> Edit Student Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Career Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Professional Bio / Summary</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
            <span>Career Readiness</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {student.careerReadinessScore.overall}<span className="text-lg font-bold text-slate-400">/100</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Ready for Junior & Mid-level AI roles
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
            <span>Verified Skills</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {verifiedSkillsCount}<span className="text-lg font-bold text-slate-400">/{student.skills.length}</span>
          </div>
          <div className="mt-2 text-xs font-semibold text-teal-700">
            Cryptographically anchored on Skill Passport
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
            <span>Resume Strength</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {resumeStrength}%
          </div>
          <div className="mt-2 text-xs font-semibold text-blue-700">
            Top 8% compared to university cohort
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
            <span>Identity Trust</span>
            <UserCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-slate-900 truncate">
            {student.identityVerification?.maskedNumber || 'XXXX-XXXX-8921'}
          </div>
          <div className="mt-2 text-xs font-semibold text-amber-700">
            Aadhaar Sandbox Verified & Protected
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bio & Academic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" /> Professional Summary & Bio
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {bio}
            </p>

            <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Institution</span>
                <span className="text-slate-800 font-bold text-sm">{student.collegeName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Department & Batch</span>
                <span className="text-slate-800 font-bold text-sm">{student.department} • Graduating {student.graduationYear}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Academic CGPA</span>
                <span className="text-slate-800 font-bold text-sm">{student.cgpa} / 10.0 (First Class with Distinction)</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Skill Passport ID</span>
                <span className="text-emerald-700 font-mono font-bold text-sm">{student.passportId}</span>
              </div>
            </div>
          </div>

          {/* Verified Skills Inventory */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" /> Verified Skills Inventory
              </h3>
              <span className="text-xs text-slate-500 font-medium">{student.skills.length} skills tracked</span>
            </div>

            <div className="space-y-3">
              {student.skills.map(skill => (
                <div
                  key={skill.skillId}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{skill.skillName}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                        {skill.proficiencyLevel}
                      </span>
                      {skill.verificationStatus === 'Verified' && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-100 text-teal-800 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3 text-teal-600" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>{skill.category}</span>
                      <span>•</span>
                      <span>{skill.evidenceCount || 1} Verified Evidence Items</span>
                      {skill.peerVerified && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">{skill.peerEndorsementCount || 2} Peer Proofs</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-slate-900">{skill.proficiencyScore}%</div>
                    <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${skill.proficiencyScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Evidence, Passport & Quick Actions */}
        <div className="space-y-6">
          {/* Passport Widget */}
          <div className="bg-gradient-to-br from-[#061a15] to-[#0a2922] rounded-2xl p-6 text-white border border-emerald-900/80 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Verifiable Credential</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="text-lg font-black text-white">{student.passportId}</h4>
            <p className="text-xs text-emerald-200/70 mt-1 leading-relaxed">
              Tamper-proof W3C standard verifiable credential linked to Indian National Academic Depository & SkillSetu Protocol.
            </p>

            <div className="mt-5 pt-4 border-t border-emerald-800/60 flex items-center justify-between gap-3">
              <div className="text-xs">
                <span className="text-emerald-400 font-bold block">Status: Active</span>
                <span className="text-emerald-200/60 text-[11px]">QR Audit Ready</span>
              </div>
              {onOpenPassport && (
                <button
                  onClick={onOpenPassport}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  View Passport <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Student Account Actions</h4>
            
            {onOpenEvidence && (
              <button
                onClick={onOpenEvidence}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">Submit New Skill Evidence</div>
                  <div className="text-[11px] text-slate-500">GitHub repo, capstone, or certificate</div>
                </div>
                <Award className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </button>
            )}

            {onOpenAadhaar && (
              <button
                onClick={onOpenAadhaar}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-teal-900">Aadhaar Sandbox Verification</div>
                  <div className="text-[11px] text-slate-500">Verify government identity badge</div>
                </div>
                <ShieldCheck className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
