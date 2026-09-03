import React, { useState } from 'react';
import { SkillPassport, StudentProfile, PeerEndorsement } from '../types';
import {
  ShieldCheck,
  QrCode,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  Award,
  Calendar,
  Lock,
  Sparkles,
  Check,
  Users,
  MessageSquare,
  Clock,
  ThumbsUp,
  PlusCircle,
  BellRing,
  Filter,
  ArrowUpRight,
  Star
} from 'lucide-react';
import { PeerVerificationModal } from './PeerVerificationModal';
import { evaluateStudentBadges } from '../services/badgeService';

interface ClassmateItem {
  id: string;
  name: string;
  role: string;
  degree: string;
  avatar: string;
  college: string;
}

interface SkillPassportViewProps {
  student: StudentProfile;
  passport: SkillPassport;
  classmates?: ClassmateItem[];
  onOpenPublicVerify: () => void;
  onUpdatePassport?: React.Dispatch<React.SetStateAction<SkillPassport>>;
  onNavigateToDashboard?: () => void;
}

export const SkillPassportView: React.FC<SkillPassportViewProps> = ({
  student,
  passport,
  classmates = [],
  onOpenPublicVerify,
  onUpdatePassport,
  onNavigateToDashboard
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showPeerModal, setShowPeerModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Fallback default classmates if none passed
  const peerList: ClassmateItem[] = classmates.length > 0 ? classmates : [
    {
      id: 'std-rohit-02',
      name: 'Rohit Kumar',
      role: 'Classmate • Final Year B.Tech CSE',
      degree: 'B.Tech in CSE',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
      college: student.collegeName
    },
    {
      id: 'std-priya-03',
      name: 'Priya Sharma',
      role: 'Classmate • Final Year B.Tech CSE',
      degree: 'B.Tech in CSE',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
      college: student.collegeName
    },
    {
      id: 'std-ananya-04',
      name: 'Ananya Iyer',
      role: 'Classmate • Final Year B.Tech AI & DS',
      degree: 'B.Tech in AI & Data Science',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      college: student.collegeName
    },
    {
      id: 'std-vikram-05',
      name: 'Vikram Patel',
      role: 'Classmate • Final Year B.Tech ECE',
      degree: 'B.Tech in ECE',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
      college: student.collegeName
    }
  ];

  const endorsements = passport.endorsements || [];
  const verifiedCount = endorsements.filter(e => e.status === 'VERIFIED').length;
  const pendingCount = endorsements.filter(e => e.status === 'PENDING').length;
  const unlockedBadges = evaluateStudentBadges(student).filter(b => b.isUnlocked);

  const getPeerEndorsementDetails = (skillName: string, directFlag?: boolean) => {
    const verifiedList = endorsements.filter(
      e => e.status === 'VERIFIED' && (
        e.skillName.toLowerCase().includes(skillName.toLowerCase()) ||
        skillName.toLowerCase().includes(e.skillName.toLowerCase())
      )
    );
    const isVerified = directFlag || verifiedList.length > 0;
    const endorserNames = verifiedList.map(e => e.endorserName);
    const avgConfidence = verifiedList.length > 0
      ? Math.round(verifiedList.reduce((acc, curr) => acc + (curr.endorsementConfidence || 90), 0) / verifiedList.length)
      : 92;
    return {
      isVerified,
      endorsers: endorserNames,
      count: verifiedList.length,
      confidence: avgConfidence
    };
  };

  const filteredEndorsements = endorsements.filter(e => {
    if (activeFilter === 'verified') return e.status === 'VERIFIED';
    if (activeFilter === 'pending') return e.status === 'PENDING';
    return true;
  });

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleNewEndorsement = (newEndorsement: PeerEndorsement) => {
    if (onUpdatePassport) {
      onUpdatePassport(prev => ({
        ...prev,
        endorsements: [newEndorsement, ...(prev.endorsements || [])]
      }));
    }
    setAlertMessage(`Peer verification request sent for ${newEndorsement.skillName}!`);
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleSimulateApproval = (endorsementId: string) => {
    if (onUpdatePassport) {
      onUpdatePassport(prev => ({
        ...prev,
        endorsements: (prev.endorsements || []).map(e => {
          if (e.id === endorsementId) {
            return {
              ...e,
              status: 'VERIFIED',
              endorsementConfidence: 94,
              verificationHash: `SHA256:PEER-${e.endorserName.toUpperCase().replace(/\s+/g, '')}-VERIFIED-${Date.now().toString(36).toUpperCase()}`,
              comment: e.comment.startsWith('Request sent')
                ? `Verified: Hands-on competency in ${e.skillName} confirmed based on collaborative deliverables. Consistently adhered to best engineering practices.`
                : e.comment
            };
          }
          return e;
        })
      }));
    }
    setAlertMessage('Classmate endorsement has been verified and cryptographically stamped on your passport.');
    setTimeout(() => setAlertMessage(null), 4000);
  };

  const handleSendReminder = (endorserName: string) => {
    setAlertMessage(`Reminder dispatched to ${endorserName}'s SkillSetu student inbox.`);
    setTimeout(() => setAlertMessage(null), 3500);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Alert Banner */}
      {alertMessage && (
        <div className="p-3 bg-[#071f1a] text-white rounded-2xl flex items-center justify-between text-xs font-semibold shadow-md border border-emerald-500/30 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{alertMessage}</span>
          </div>
          <button onClick={() => setAlertMessage(null)} className="text-emerald-300 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Top Banner with Actions */}
      <div className="crextio-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              Digital Skill Passport
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Cryptographically Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Standardized, evidence-backed digital credential verifiable across academia and industry through secure QR lookups and peer consensus.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Peer Verification Request Button */}
          <button
            id="btn-request-peer-verification"
            onClick={() => setShowPeerModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            title="Request classmate to endorse your skills"
          >
            <Users className="w-4 h-4 text-white" />
            <span>Peer Verification</span>
          </button>

          <button
            onClick={onOpenPublicVerify}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#071f1a] hover:bg-[#0a2922] active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-hidden border border-emerald-900/40 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Public QR Verify</span>
          </button>
        </div>
      </div>

      {/* Main Passport Certificate Layout */}
      <div className="max-w-4xl mx-auto crextio-card p-6 sm:p-10 border-slate-300 relative overflow-hidden bg-white shadow-xl rounded-3xl">
        
        {/* Subtle Watermark Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
          <ShieldCheck className="w-[500px] h-[500px] text-slate-900" />
        </div>

        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#071f1a] via-emerald-900 to-emerald-700 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
                SkillSetu National Skill Verification Protocol
              </div>
              <h2 className="text-xl font-black text-slate-900">VERIFIED DIGITAL SKILL PASSPORT</h2>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              STATUS: {passport.status}
            </span>
            <span className="text-[10px] font-mono text-slate-400 mt-1">ID: {passport.passportId}</span>
          </div>
        </div>

        {/* Student Credential Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-8">
          
          {/* Left Student Info (Col 8) */}
          <div className="md:col-span-8 space-y-6">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bearer Name & Institution</div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{student.name}</div>
              <div className="text-sm font-semibold text-slate-700">{student.degree}</div>
              <div className="text-xs text-slate-500 mt-0.5">{student.collegeName}</div>

              {/* Visual Verification Badges on Profile */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  UIDAI Identity Verified
                </span>

                {verifiedCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    Peer-Verified Scholar ({verifiedCount} Endorsements)
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50/90 rounded-2xl border border-slate-200/60 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Target Role</span>
                <div className="font-extrabold text-slate-900 mt-0.5">{student.targetRole}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Career Readiness</span>
                <div className="font-extrabold text-emerald-700 mt-0.5">{student.careerReadinessScore.overall}/100</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Academic CGPA</span>
                <div className="font-extrabold text-slate-900 mt-0.5">{student.cgpa} / 10.0</div>
              </div>
            </div>

            {/* Top Verified Skills Matrix */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Verified Skill Competencies
                </div>
                {verifiedCount > 0 && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                    {verifiedCount} Skills Peer-Attested
                  </span>
                )}
              </div>
              <div className="space-y-2.5">
                {student.skills.slice(0, 5).map(skill => {
                  const peer = getPeerEndorsementDetails(skill.skillName, skill.peerVerified);
                  const endorsers = peer.endorsers.length > 0 ? peer.endorsers : (skill.peerEndorsers || []);

                  return (
                    <div
                      key={skill.skillId}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                        peer.isVerified
                          ? 'bg-gradient-to-r from-white via-emerald-50/20 to-white border-emerald-200/90 shadow-2xs'
                          : 'bg-white border-slate-200/80 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 sm:mt-0" />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900">{skill.skillName}</span>
                            {peer.isVerified && (
                              <span
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs"
                                title={`Classmate Consensus: Attested by ${endorsers.join(', ')}`}
                              >
                                <Users className="w-3 h-3 text-emerald-600" />
                                <span>Peer-Verified</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {skill.evidenceCount} verified evidence items • {skill.confidenceScore}% confidence
                            {peer.isVerified && endorsers.length > 0 && (
                              <span className="text-emerald-700 font-semibold ml-1.5">
                                • Attested by {endorsers.join(', ')} ({peer.confidence}% consensus)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <span className="text-xs font-bold text-slate-800">{skill.proficiencyScore}/100</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          {skill.proficiencyLevel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Authenticated Micro-Credentials & Honors Seal (Credential Reference - avoids dashboard gamification duplication) */}
            {unlockedBadges.length > 0 && (
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Award className="w-5 h-5 fill-white/20" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                        Authenticated Micro-Credentials & Honors
                      </h4>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.2 rounded-full border border-amber-300">
                        {unlockedBadges.length} Active Badges
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900/80 mt-0.5">
                      Attested honors: {unlockedBadges.map(b => b.title).join(', ')}. Full XP progression and milestone gamification are tracked on your personal student dashboard.
                    </p>
                  </div>
                </div>

                {onNavigateToDashboard && (
                  <button
                    type="button"
                    onClick={onNavigateToDashboard}
                    className="text-xs font-bold text-amber-900 hover:text-amber-950 bg-white hover:bg-amber-50 border border-amber-300/80 px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
                  >
                    <span>View Badge Showcase</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-amber-700" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right QR Code & Cryptographic Stamp (Col 4) */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50/90 rounded-3xl border border-slate-200/80 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-3">
              Scan for Public Verification
            </span>

            {/* Live QR Code Preview */}
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-md">
              {passport.qrCodeDataUrl ? (
                <img
                  src={passport.qrCodeDataUrl}
                  alt="QR Code Passport"
                  className="w-40 h-40 object-contain rounded-lg"
                />
              ) : (
                <div className="w-40 h-40 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                  <QrCode className="w-20 h-20" />
                </div>
              )}
            </div>

            <button
              onClick={onOpenPublicVerify}
              className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
            >
              Simulate Scan <ExternalLink className="w-3 h-3" />
            </button>

            <div className="mt-4 text-[10px] font-mono text-slate-500 space-y-1 w-full text-left bg-white p-2.5 rounded-xl border border-slate-200/60">
              <div className="truncate"><strong>HASH:</strong> {passport.verificationCode}</div>
              <div><strong>ISSUED:</strong> {passport.issueDate}</div>
              <div><strong>VALID UNTIL:</strong> {passport.validUntil}</div>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* NEW 'ENDORSEMENT' SECTION IN PASSPORT DISPLAY */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-6 border-t-2 border-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    PEER VERIFIED ENDORSEMENTS
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Consensus Verified
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Cryptographically attested endorsements from academic peers and project teammates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {verifiedCount} Verified Endorsement{verifiedCount !== 1 ? 's' : ''}
              </span>
              <button
                id="btn-inline-request-peer"
                onClick={() => setShowPeerModal(true)}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 active:scale-[0.98] text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Request Endorsement</span>
              </button>
            </div>
          </div>

          {/* Endorsement Cards Grid */}
          {endorsements.length === 0 ? (
            <div className="p-6 bg-slate-50/70 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
              <Users className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700">No Peer Endorsements Yet</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Request project teammates and classmates to endorse your specific skill proficiencies to reinforce your credential.
              </p>
              <button
                onClick={() => setShowPeerModal(true)}
                className="mt-2 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Request First Endorsement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {endorsements.map((endorsement) => {
                const isVerified = endorsement.status === 'VERIFIED';
                return (
                  <div
                    key={endorsement.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isVerified
                        ? 'bg-gradient-to-br from-white to-slate-50/60 border-slate-200/90 shadow-xs'
                        : 'bg-amber-50/40 border-amber-200/80'
                    }`}
                  >
                    {/* Endorser Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={endorsement.endorserAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'}
                          alt={endorsement.endorserName}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-100"
                        />
                        <div>
                          <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                            <span>{endorsement.endorserName}</span>
                            {isVerified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Classmate Identity Verified" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500">{endorsement.endorserRole}</div>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isVerified
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isVerified ? 'Verified' : 'Pending Request'}
                      </span>
                    </div>

                    {/* Skill Tag & Relationship */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-[#071f1a] text-emerald-300 shadow-2xs border border-emerald-900/60">
                        {endorsement.skillName}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {endorsement.relationship}
                      </span>
                    </div>

                    {/* Testimonial Quote */}
                    <p className="text-[11px] leading-relaxed text-slate-700 italic bg-white/80 p-2.5 rounded-xl border border-slate-100">
                      "{endorsement.comment}"
                    </p>

                    {/* Footer Audit Hash & Date */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-400">
                      <span className="truncate max-w-[170px]" title={endorsement.verificationHash || 'PENDING_ATTESTATION'}>
                        {endorsement.verificationHash ? endorsement.verificationHash.slice(0, 22) + '...' : 'PENDING CONSENSUS'}
                      </span>
                      <span>{endorsement.date}</span>
                    </div>

                    {/* Pending Actions */}
                    {!isVerified && (
                      <div className="mt-2 pt-2 border-t border-amber-100 flex items-center justify-between text-[11px]">
                        <span className="text-amber-700 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Awaiting approval
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSendReminder(endorsement.endorserName)}
                            className="px-2 py-1 text-[10px] font-bold text-slate-600 hover:text-slate-900 bg-white rounded-lg border border-slate-200"
                          >
                            Send Nudge
                          </button>
                          <button
                            onClick={() => handleSimulateApproval(endorsement.id)}
                            className="px-2 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg"
                            title="Simulate peer approval for demonstration"
                          >
                            Approve (Demo)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Certificate Footer */}
        <div className="mt-8 pt-6 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Zero sensitive personal or Aadhaar data is exposed in public QR verification payload.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className={`px-4 py-2 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all focus:outline-hidden focus:ring-2 cursor-pointer ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              }`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Passport PDF Saved</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* PEER ENDORSEMENT REGISTRY & MANAGEMENT DRAWER/CARD */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-4xl mx-auto crextio-card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-extrabold text-slate-900">
                Classmate Endorsement Management
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Peer verification consensus provides recruiter trust by verifying active collaboration on coursework and hackathons.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({endorsements.length})
            </button>
            <button
              onClick={() => setActiveFilter('verified')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeFilter === 'verified' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Verified ({verifiedCount})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeFilter === 'pending' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({pendingCount})
            </button>
          </div>
        </div>

        {/* Detailed List */}
        <div className="mt-4 space-y-3">
          {filteredEndorsements.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No endorsements found for selected filter.
            </div>
          ) : (
            filteredEndorsements.map(e => (
              <div
                key={e.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <img
                    src={e.endorserAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'}
                    alt={e.endorserName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white shrink-0 mt-0.5"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">{e.endorserName}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {e.skillName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        e.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {e.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {e.relationship} • {e.endorserRole}
                    </div>
                    <p className="text-xs text-slate-700 italic mt-1 bg-white p-2 rounded-xl border border-slate-200/50">
                      "{e.comment}"
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400">ENDORSEMENT CONFIDENCE</div>
                    <div className="text-sm font-extrabold text-emerald-700">{e.endorsementConfidence}%</div>
                  </div>

                  {e.status === 'PENDING' && (
                    <button
                      onClick={() => handleSimulateApproval(e.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs cursor-pointer"
                    >
                      Confirm (Demo)
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Educational Info Box */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
          <Award className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold text-emerald-950 block">
              How Peer Verification Strengthens Skill Credibility
            </span>
            <p className="text-[11px] leading-relaxed text-emerald-900/80">
              Unlike self-declared profiles on social networks, SkillSetu peer endorsements require institutional authentication from classmates enrolled in the same state tech college or university. Recruiters view peer-endorsed competencies as strong signals of collaboration and code readiness.
            </p>
          </div>
        </div>

      </div>

      {/* Peer Verification Request Modal */}
      <PeerVerificationModal
        isOpen={showPeerModal}
        onClose={() => setShowPeerModal(false)}
        student={student}
        classmates={peerList}
        onSubmitRequest={handleNewEndorsement}
      />

    </div>
  );
};
