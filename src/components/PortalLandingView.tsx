import React from 'react';
import {
  GraduationCap,
  Landmark,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Radio,
  QrCode,
  Sparkles,
  Lock,
  Globe2,
  ArrowUpRight,
  Layers,
  FileCheck2,
  Award,
  Users2,
  Clock,
  Shield,
  Zap,
  BarChart3,
  LogIn,
  LogOut
} from 'lucide-react';
import { UserRole } from '../types';

interface PlatformLandingViewProps {
  onSelectRole?: (role: UserRole) => void;
  onNavigateTab?: (tabId: string) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export const PlatformLandingView: React.FC<PlatformLandingViewProps> = ({
  onSelectRole,
  onNavigateTab,
  isLoggedIn = false,
  onLogout
}) => {
  const handleRoleClick = (role: UserRole) => {
    if (onSelectRole) {
      onSelectRole(role);
    }
  };

  const handleTabClick = (tabId: string) => {
    if (onNavigateTab) {
      onNavigateTab(tabId);
    }
  };

  return (
    <div id="platform-landing-page" className="space-y-12 pb-16 animate-in fade-in duration-300">
      
      {/* 1. HERO SECTION: PLATFORM VALUE & NATIONAL SCOPE */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[#071f1a] via-[#092b24] to-[#071f1a] text-white p-8 sm:p-12 lg:p-16 border border-emerald-900/80 shadow-2xl">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-800/80 text-emerald-300 text-xs font-bold tracking-wide shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>AICTE & Ministry of Education • SIH 2026 National Standard</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            India’s Unified National <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              Skill Intelligence & Passport
            </span> Platform
          </h1>

          <p className="text-base sm:text-xl text-emerald-100/80 max-w-3xl mx-auto font-normal leading-relaxed">
            Eliminating the trust deficit between academia and industry through cryptographic W3C Verifiable Credentials, 
            explainable AI skill forecasting, and peer-attested candidate verification.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                handleRoleClick('student');
                handleTabClick('dashboard');
              }}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
            >
              <span>Explore Student Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                handleRoleClick('college');
                handleTabClick('college-analytics');
              }}
              className="px-6 py-3.5 bg-[#0a2f26] hover:bg-[#0e3d32] active:scale-98 text-white border border-emerald-700/60 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Landmark className="w-4 h-4 text-emerald-400" />
              <span>Institutional Analytics</span>
            </button>

            <button
              onClick={() => {
                handleRoleClick('company');
                handleTabClick('jobs');
              }}
              className="px-6 py-3.5 bg-[#0a2f26] hover:bg-[#0e3d32] active:scale-98 text-white border border-emerald-700/60 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Recruiter Portal</span>
            </button>

            {isLoggedIn ? (
              <button
                onClick={onLogout}
                className="px-5 py-3.5 bg-red-950/70 hover:bg-red-900/70 active:scale-98 text-red-200 border border-red-700/60 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-red-950/50 transition-all cursor-pointer"
                title="Log out of active session"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Logout Session</span>
              </button>
            ) : (
              <button
                onClick={() => handleTabClick('login')}
                className="px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 text-white border border-emerald-400/50 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-emerald-200" />
                <span>Stakeholder Login</span>
              </button>
            )}

            <button
              onClick={() => handleTabClick('verify-public')}
              className="px-4 py-3.5 bg-emerald-950/80 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/80 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
              title="Test Zero-Auth QR Verification"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Instant QR Audit</span>
            </button>
          </div>
        </div>

        {/* 2. GENERAL PLATFORM-LEVEL MACRO STATISTICS (NO USER-SPECIFIC DATA) */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-emerald-900/60 text-center">
          <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-900/40">
            <div className="text-2xl sm:text-3xl font-black text-white">1,420+</div>
            <div className="text-xs text-emerald-300/70 font-semibold mt-1">Accredited Higher Ed Colleges</div>
          </div>

          <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-900/40">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">125,000+</div>
            <div className="text-xs text-emerald-300/70 font-semibold mt-1">Verifiable Passports Issued</div>
          </div>

          <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-900/40">
            <div className="text-2xl sm:text-3xl font-black text-white">850+</div>
            <div className="text-xs text-emerald-300/70 font-semibold mt-1">Active Industry Hiring Partners</div>
          </div>

          <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-900/40">
            <div className="text-2xl sm:text-3xl font-black text-teal-300">99.4%</div>
            <div className="text-xs text-emerald-300/70 font-semibold mt-1">Reduction in Resume Fraud</div>
          </div>
        </div>
      </section>

      {/* 3. WHO IT IS FOR: THREE PILLARS (STUDENT, COLLEGE, COMPANY) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Multi-Stakeholder Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Tailored Experiences for Every Stakeholder
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            SkillSetu bridges the gap between students, technical institutions, and hiring enterprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Students */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 border border-emerald-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">For Students & Graduates</div>
              <h3 className="text-xl font-black text-slate-900 mt-1 mb-3">Tamper-Proof Career Records</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                Replace unverified resume claims with cryptographic skill passports. Prove mastery through verified code repositories, 
                peer consensus attestations, and AI-scored project evidence.
              </p>
              
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>W3C-compliant Verifiable Digital Passport with QR code</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Personal Career Readiness scoring and actionable gap diagnostics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Peer-to-peer decentralized project attestation consensus</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct discovery by verified recruiters without keyword filtering</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                handleRoleClick('student');
                handleTabClick('dashboard');
              }}
              className="mt-6 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Go to Student Experience</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Colleges */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-5 border border-teal-200">
                <Landmark className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700">For Academic Institutions</div>
              <h3 className="text-xl font-black text-slate-900 mt-1 mb-3">Institutional Intelligence</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                Empower department heads and placement cells with cohort-wide skill gap heatmaps, real-time curriculum alignment metrics, 
                and automated NAAC/NIRF accreditation reports.
              </p>
              
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Department vs. Skill proficiency heatmap across branches</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Campus placement readiness tracking and industry MoU tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Bulk student cohort ingestion and institutional verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Accreditation-ready audit trails compliant with AISHE standards</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                handleRoleClick('college');
                handleTabClick('college-analytics');
              }}
              className="mt-6 w-full py-3 bg-[#071f1a] hover:bg-[#0a2922] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Go to College Intelligence</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Companies */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-5 border border-indigo-200">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700">For Employers & Recruiters</div>
              <h3 className="text-xl font-black text-slate-900 mt-1 mb-3">Zero-Fraud Talent Discovery</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-5">
                Drastically cut screening cycles by evaluating verified technical evidence rather than claims. 
                Prioritize candidates with explainable AI match scores grounded in cryptographically proven skills.
              </p>
              
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Algorithmic candidate ranking based on authentic skill proof</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Instant public QR audit of candidate passports with zero friction</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Detailed breakdown of required skills vs. candidate competency</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Automated candidate shortlisting and direct recruitment pipeline</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                handleRoleClick('company');
                handleTabClick('jobs');
              }}
              className="mt-6 w-full py-3 bg-indigo-950 hover:bg-indigo-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Go to Company Hiring</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. KEY PLATFORM CAPABILITIES & DEDICATED TOOLS */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Platform Features</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Engineered for Scalable National Impact
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Every feature serves a dedicated, distinct purpose in the verification and employability lifecycle.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>5 Core Technical Engines Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1: Skill Passport */}
          <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900 mb-1">Cryptographic Skill Passport</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Generates W3C Verifiable Credentials with SHA-256 tamper-evident seals and live QR verification for instantaneous public audits.
              </p>
            </div>
            <button
              onClick={() => handleTabClick('passport')}
              className="text-xs font-extrabold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 self-start cursor-pointer"
            >
              <span>Explore Skill Passport Page</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 2: Skill Demand Forecasting */}
          <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-4 shadow-sm">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900 mb-1">ML Skill Demand Forecaster</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Time-series regression models forecasting industry demand trends (2023–2027) with salary benchmarks across tech domains.
              </p>
            </div>
            <button
              onClick={() => handleTabClick('skill-intelligence')}
              className="text-xs font-extrabold text-teal-700 hover:text-teal-900 flex items-center gap-1 self-start cursor-pointer"
            >
              <span>Explore Skill Intelligence Page</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 3: Job Simulator Engine */}
          <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-4 shadow-sm">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900 mb-1">Interactive Job Simulator</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Allows students to test "what-if" scenarios: see exactly how mastering missing competencies increases role match % and salary bands.
              </p>
            </div>
            <button
              onClick={() => handleTabClick('job-simulator')}
              className="text-xs font-extrabold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 self-start cursor-pointer"
            >
              <span>Explore Job Simulator Page</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 4: Peer Attestation Consensus */}
          <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center mb-4 shadow-sm">
                <Users2 className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900 mb-1">Peer Consensus Network</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Multi-party endorsement protocol where teammates and classmates attest to shared project contributions, preventing exaggerated resumes.
              </p>
            </div>
            <button
              onClick={() => handleTabClick('passport')}
              className="text-xs font-extrabold text-teal-800 hover:text-teal-950 flex items-center gap-1 self-start cursor-pointer"
            >
              <span>View Consensus Registry</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 5: Multilingual AI Advisory */}
          <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center mb-4 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900 mb-1">Regional AI Career Advisor</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Multilingual conversational engine providing real-time career guidance, mock technical Q&A, and learning roadmaps in English, Hindi, and Tamil.
              </p>
            </div>
            <button
              onClick={() => handleTabClick('skillsetu-ai')}
              className="text-xs font-extrabold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 self-start cursor-pointer"
            >
              <span>Open AI Career Advisor</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Feature 6: Public Zero-Auth Audit */}
          <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 shadow-sm">
                <QrCode className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900 mb-1">Zero-Auth Public Verification</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Enables any corporate recruiter to verify a candidate’s authentic competencies in 2 seconds by scanning their physical or digital passport QR.
              </p>
            </div>
            <button
              onClick={() => handleTabClick('verify-public')}
              className="text-xs font-extrabold text-slate-800 hover:text-black flex items-center gap-1 self-start cursor-pointer"
            >
              <span>Test Public QR Gateway</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. HOW THE SYSTEM WORKS (THE 5-STAGE PIPELINE) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Verification Protocol
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            How The Verification Engine Works
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            From raw engineering evidence to cryptographically attested recruiter discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Evidence Ingestion',
              desc: 'Students connect GitHub repos, live production links, and accredited course proofs.'
            },
            {
              step: '02',
              title: 'Diagnostic AI Scoring',
              desc: 'Multi-layer models evaluate code complexity, commit velocity, and test coverage.'
            },
            {
              step: '03',
              title: 'Peer Consensus',
              desc: 'Hackathon teammates and faculty provide authenticated cryptographic attestations.'
            },
            {
              step: '04',
              title: 'Passport Issuance',
              desc: 'A tamper-proof SHA-256 digital passport is minted with dynamic QR validation.'
            },
            {
              step: '05',
              title: 'Direct Hiring',
              desc: 'Companies filter and interview based on proven code capabilities, bypassing spam.'
            }
          ].map((s, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs relative">
              <div className="text-2xl font-black text-emerald-600/30 mb-2">{s.step}</div>
              <h4 className="font-extrabold text-sm text-slate-900 mb-1">{s.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TRUST, SECURITY & COMPLIANCE INFRASTRUCTURE */}
      <section className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 border border-emerald-900 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs font-bold">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Government of India Technical Standards</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Cryptographically Hardened & Privacy-First Architecture
            </h3>

            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
              SkillSetu adheres to strict national digital public infrastructure standards. Student identities are authenticated 
              via UIDAI Aadhaar 256-bit hash protocols without storing plaintext numbers. All credentials strictly comply 
              with W3C Verifiable Credentials and DigiLocker interoperability specifications.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-800/60">
                <div className="text-xs font-bold text-white">UIDAI 256-Bit Hash</div>
                <div className="text-[10px] text-emerald-300/70 mt-0.5">Zero Plaintext Aadhaar</div>
              </div>
              <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-800/60">
                <div className="text-xs font-bold text-white">W3C Credential Spec</div>
                <div className="text-[10px] text-emerald-300/70 mt-0.5">Global Interoperability</div>
              </div>
              <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-800/60">
                <div className="text-xs font-bold text-white">AISHE-Gov Standard</div>
                <div className="text-[10px] text-emerald-300/70 mt-0.5">Institutional Alignment</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#061814] p-6 rounded-2xl border border-emerald-800/80 shadow-inner space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
              <span>Cryptographic Proof Guarantee</span>
              <Lock className="w-3.5 h-3.5" />
            </div>

            <div className="font-mono text-[11px] text-emerald-200/80 bg-emerald-950/60 p-3 rounded-xl border border-emerald-900 break-all space-y-1">
              <div className="text-emerald-400 font-bold">// SHA-256 Attestation Hash Example</div>
              <div>0x9b3f8a4128c7d91e6b35041a9...</div>
              <div className="text-[10px] text-emerald-300/60 pt-1">Status: VERIFIED_TAMPER_PROOF</div>
            </div>

            <p className="text-[11px] text-emerald-300/70 leading-relaxed">
              Every badge, peer endorsement, and skill passport generated on SkillSetu contains a verifiable signature 
              that can be audited offline or through public block registries.
            </p>
          </div>
        </div>
      </section>

      {/* 7. INSTITUTIONAL & RECRUITER TESTIMONIALS (GENERAL ENDORSEMENTS) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Ecosystem Validation
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Trusted by Leaders in Education and Industry
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <p className="text-xs text-slate-600 italic leading-relaxed mb-4">
              "SkillSetu's department-level heatmaps have completely transformed how our academic council updates semester electives. 
              We now adjust curricula based on real-time market signals rather than decade-old syllabi."
            </p>
            <div className="pt-3 border-t border-slate-100">
              <div className="font-extrabold text-xs text-slate-900">Dr. K. Ramanathan</div>
              <div className="text-[11px] text-slate-500">Director of Placements • National Institute of Technology</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <p className="text-xs text-slate-600 italic leading-relaxed mb-4">
              "Our engineering recruitment cycle dropped from 4 weeks to 3 days. When a student presents a Skill Passport 
              with verified peer consensus and GitHub evidence, we bypass initial screening filters with 100% confidence."
            </p>
            <div className="pt-3 border-t border-slate-100">
              <div className="font-extrabold text-xs text-slate-900">Vikram Malhotra</div>
              <div className="text-[11px] text-slate-500">VP of Talent Acquisition • TechNova AI Labs</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <p className="text-xs text-slate-600 italic leading-relaxed mb-4">
              "The ability for students to verify identity securely through Aadhaar hashing while generating tamper-evident 
              W3C credentials makes SkillSetu the ideal standard for National Education Policy (NEP) credit frameworks."
            </p>
            <div className="pt-3 border-t border-slate-100">
              <div className="font-extrabold text-xs text-slate-900">Prof. Aruna Sundaram</div>
              <div className="text-[11px] text-slate-500">Dean of Academic Affairs • AICTE Technical Advisory Board</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BOTTOM ACTION PORTAL CARDS */}
      <section className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Ready to experience SkillSetu?
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Explore the live interactive system through your chosen stakeholder role or audit a live verifiable passport.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              handleRoleClick('student');
              handleTabClick('dashboard');
            }}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Launch Student Portal
          </button>
          <button
            onClick={() => {
              handleRoleClick('college');
              handleTabClick('college-analytics');
            }}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            Launch College Center
          </button>
          <button
            onClick={() => {
              handleRoleClick('company');
              handleTabClick('jobs');
            }}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            Launch Recruiter Suite
          </button>
        </div>
      </section>

    </div>
  );
};

// Export backward compatibility alias
export const PortalLandingView = PlatformLandingView;
