import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Landmark,
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  User as UserIcon,
  Fingerprint,
  FileBadge,
  Briefcase,
  ArrowLeft,
  Check,
  HelpCircle,
  Building,
  Hash,
  School,
  QrCode,
  Shield,
  LogOut
} from 'lucide-react';
import { UserRole, User } from '../types';
import { DEMO_USERS } from '../data/seedData';

export interface LoginPageProps {
  initialRole?: UserRole;
  onLoginSuccess: (user: User, role: UserRole) => void;
  onNavigateToTab?: (tab: string) => void;
  currentUser?: User;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialRole = 'student',
  onLoginSuccess,
  onNavigateToTab,
  currentUser,
  isLoggedIn = false,
  onLogout
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    initialRole === 'admin' ? 'student' : initialRole
  );
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  // Auto-closing login success confirmation state
  const [loginSuccessData, setLoginSuccessData] = useState<{
    user: User;
    role: UserRole;
    sessionHash: string;
  } | null>(null);

  // Auto close and enter workspace after 5 seconds
  useEffect(() => {
    if (!loginSuccessData) return;

    const timer = setTimeout(() => {
      onLoginSuccess(loginSuccessData.user, loginSuccessData.role);
    }, 5000);

    return () => clearTimeout(timer);
  }, [loginSuccessData, onLoginSuccess]);

  // Auto close forgot password modal after 5 seconds
  useEffect(() => {
    if (!forgotPasswordSent) return;

    const timer = setTimeout(() => {
      setShowForgotPasswordModal(false);
      setForgotPasswordSent(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [forgotPasswordSent]);

  // Form input states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Register extra fields
  const [regName, setRegName] = useState('');
  const [regInstitutionOrCompany, setRegInstitutionOrCompany] = useState('');
  const [regCodeOrRoll, setRegCodeOrRoll] = useState('');

  // Role details config
  const roleConfig = {
    student: {
      title: 'Student & Learner Portal',
      subtitle: 'Sign in to access your Skill Passport, AI Gap Diagnostics, and recruiter matches.',
      icon: GraduationCap,
      accentBg: 'bg-emerald-600',
      accentText: 'text-emerald-700',
      accentBorder: 'border-emerald-500',
      identifierLabel: 'Email, Roll Number, or Student ID',
      identifierPlaceholder: 'e.g. arun.kumar@eng.edu or 2026-CS-8921',
      defaultEmail: 'student@skillsetu.demo',
      defaultPassword: '••••••••',
      badgeText: 'Verified Learner',
      benefits: [
        'W3C-compliant Verifiable Digital Passport with live QR code',
        'Personalized AI Next Best Skill & gap diagnostics',
        'Direct discovery by verified corporate talent recruiters',
        'Peer-to-peer decentralized project attestation'
      ],
      quickDemoUser: DEMO_USERS.find(u => u.role === 'student') || DEMO_USERS[0],
      demoNote: 'Arun Kumar • Final Year B.Tech Computer Science'
    },
    college: {
      title: 'Higher Education Institution Portal',
      subtitle: 'Sign in for AICTE/NIRF cohort analytics, batch skill heatmaps, and curriculum alignment.',
      icon: Landmark,
      accentBg: 'bg-teal-700',
      accentText: 'text-teal-700',
      accentBorder: 'border-teal-500',
      identifierLabel: 'Institutional Email or AISHE Code',
      identifierPlaceholder: 'e.g. dean.academics@niet.edu.in or C-18492',
      defaultEmail: 'college@skillsetu.demo',
      defaultPassword: '••••••••',
      badgeText: 'Accredited Institution',
      benefits: [
        'Batch-wide skill proficiencies & employment heatmap',
        'NAAC/NBA/NIRF accreditation analytics exports',
        'Automated curriculum deficit & industry gap alerts',
        'Student attestation & institutional verification workflow'
      ],
      quickDemoUser: DEMO_USERS.find(u => u.role === 'college') || DEMO_USERS[1],
      demoNote: 'Dr. Radhakrishnan • Dean of Academics (NIET Bengaluru)'
    },
    company: {
      title: 'Enterprise Recruiter Portal',
      subtitle: 'Sign in to access verified talent pools, benchmark candidates, and post verified jobs.',
      icon: Building2,
      accentBg: 'bg-emerald-800',
      accentText: 'text-emerald-800',
      accentBorder: 'border-emerald-600',
      identifierLabel: 'Corporate Work Email or CIN',
      identifierPlaceholder: 'e.g. talent@technova.ai or U72900KA2020PTC',
      defaultEmail: 'company@skillsetu.demo',
      defaultPassword: '••••••••',
      badgeText: 'Verified Hiring Partner',
      benefits: [
        'Direct pipeline of candidates with tamper-proof code proof',
        'Cryptographic Skill Passport validation in 1 click',
        'Algorithmic match ranking based on actual verified skills',
        'Job simulator integration to test candidates live'
      ],
      quickDemoUser: DEMO_USERS.find(u => u.role === 'company') || DEMO_USERS[2],
      demoNote: 'Neha Sharma • Head of Talent @ TechNova AI Labs'
    }
  };

  const currentRoleConfig = roleConfig[selectedRole as 'student' | 'college' | 'company'] || roleConfig.student;

  // Handle Quick Demo Login
  const handleQuickDemoLogin = (roleToLogin: UserRole) => {
    setIsLoading(true);
    setErrorMsg(null);
    const demoUser = DEMO_USERS.find(u => u.role === roleToLogin) || DEMO_USERS[0];
    
    setTimeout(() => {
      setIsLoading(false);
      const sessionHash = `SHA256:AUTH-${demoUser.role.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      setSuccessMsg(`Authenticated as ${demoUser.name}`);
      setLoginSuccessData({
        user: demoUser,
        role: roleToLogin,
        sessionHash
      });
    }, 450);
  };

  // Handle Standard Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim()) {
      setErrorMsg(`Please enter your ${currentRoleConfig.identifierLabel.toLowerCase()}`);
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Please enter your password');
      return;
    }

    setIsLoading(true);

    // Simulate authenticating against seed accounts
    setTimeout(() => {
      setIsLoading(false);
      
      const demoUser = DEMO_USERS.find(u => u.role === selectedRole) || DEMO_USERS[0];
      const authenticatedUser: User = {
        ...demoUser,
        name: isRegisterMode && regName.trim() ? regName.trim() : demoUser.name,
        email: identifier.includes('@') ? identifier.trim() : demoUser.email
      };

      const sessionHash = `SHA256:AUTH-${selectedRole.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      setSuccessMsg(`Welcome, ${authenticatedUser.name}!`);
      setLoginSuccessData({
        user: authenticatedUser,
        role: selectedRole,
        sessionHash
      });
    }, 500);
  };

  // Fill Demo Credentials in Input Fields
  const handlePrefillDemo = () => {
    setIdentifier(currentRoleConfig.defaultEmail);
    setPassword('demo123');
    setErrorMsg(null);
  };

  return (
    <div id="login-page-container" className="min-h-[85vh] py-6 sm:py-10 flex flex-col justify-center animate-in fade-in duration-300">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb / Back to Platform */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            {onNavigateToTab && (
              <button
                type="button"
                onClick={() => onNavigateToTab('landing')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Platform Overview</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>SIH 2026 Unified Authentication Portal</span>
            </span>
          </div>
        </div>

        {/* ACTIVE SESSION STATUS BANNER (When User is already logged in) */}
        {isLoggedIn && currentUser && (
          <div className="bg-[#08221b] text-white rounded-3xl p-4 sm:p-5 border border-emerald-800/80 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 min-w-12 min-h-12 rounded-2xl object-cover ring-2 ring-emerald-400/60 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-sm truncate">
                    Signed In: {currentUser.name}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-800/90 text-emerald-200 border border-emerald-600/60">
                    Active Session
                  </span>
                </div>
                <div className="text-xs text-emerald-300/70 truncate mt-0.5">
                  {currentUser.email} • Current Role: <span className="text-emerald-300 font-bold capitalize">{currentUser.role}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-red-900/60 hover:bg-red-800 text-red-100 border border-red-700/60 text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                  id="login-page-session-logout-btn"
                  title="Log out of this session"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-300" />
                  <span>Logout</span>
                </button>
              )}
              {onNavigateToTab && (
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser.role === 'student') onNavigateToTab('dashboard');
                    else if (currentUser.role === 'college') onNavigateToTab('college-analytics');
                    else if (currentUser.role === 'company') onNavigateToTab('jobs');
                    else onNavigateToTab('dashboard');
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <span>Return to Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* TOP ROLE SELECTION TABS: Student vs College vs Company */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2.5 px-2 flex items-center justify-between">
            <span>Select Your Access Role:</span>
            <span className="text-emerald-700 font-extrabold">Instant Multi-Stakeholder Access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Student Tab */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('student');
                setErrorMsg(null);
                setIdentifier('');
                setPassword('');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                selectedRole === 'student'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs ring-2 ring-emerald-500/20'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                selectedRole === 'student' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="font-black text-sm flex items-center gap-1.5">
                  <span>Student & Graduate</span>
                  {selectedRole === 'student' && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  Skill Passports, AI Recs & Jobs
                </div>
              </div>
            </button>

            {/* College Tab */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('college');
                setErrorMsg(null);
                setIdentifier('');
                setPassword('');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                selectedRole === 'college'
                  ? 'bg-teal-50 border-teal-500 text-teal-950 shadow-xs ring-2 ring-teal-500/20'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                selectedRole === 'college' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <Landmark className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="font-black text-sm flex items-center gap-1.5">
                  <span>College / Institution</span>
                  {selectedRole === 'college' && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  AISHE Heatmap & Curriculum Sync
                </div>
              </div>
            </button>

            {/* Company Tab */}
            <button
              type="button"
              onClick={() => {
                setSelectedRole('company');
                setErrorMsg(null);
                setIdentifier('');
                setPassword('');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                selectedRole === 'company'
                  ? 'bg-emerald-900/10 border-emerald-800 text-emerald-950 shadow-xs ring-2 ring-emerald-800/20'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                selectedRole === 'company' ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <Building2 className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="font-black text-sm flex items-center gap-1.5">
                  <span>Company / Recruiter</span>
                  {selectedRole === 'company' && <Check className="w-4 h-4 text-emerald-800 shrink-0" />}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  Verified Talent Pool & Job Posts
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* MAIN SPLIT CARD: Form Left, Role Highlights & Quick Demo Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          
          {/* LEFT: AUTHENTICATION FORM (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
            <div>
              {/* Form Title & Description */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${currentRoleConfig.accentBg}`}>
                    {currentRoleConfig.badgeText}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Secured with 256-bit AES</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {isRegisterMode ? `Register New ${currentRoleConfig.badgeText}` : `Sign In to ${currentRoleConfig.title}`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {currentRoleConfig.subtitle}
                </p>
              </div>

              {/* Mode Toggle (Sign In vs Register) */}
              <div className="flex p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200/70 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-lg font-extrabold transition-all cursor-pointer ${
                    !isRegisterMode ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In to Existing Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-lg font-extrabold transition-all cursor-pointer ${
                    isRegisterMode ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create New Account
                </button>
              </div>

              {/* Error & Success Messages */}
              {errorMsg && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Form Elements */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Registration Extra Fields */}
                {isRegisterMode && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {selectedRole === 'student' ? 'Full Legal Name' : selectedRole === 'college' ? 'Institution Name' : 'Company Name'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder={selectedRole === 'student' ? 'e.g. Arun Kumar' : selectedRole === 'college' ? 'e.g. National Institute of Engineering & Technology' : 'e.g. TechNova AI Labs'}
                          className="w-full px-3.5 py-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                        />
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {selectedRole === 'student' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          College / University & Degree
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={regInstitutionOrCompany}
                            onChange={(e) => setRegInstitutionOrCompany(e.target.value)}
                            placeholder="e.g. NIET Bengaluru - B.Tech Computer Science"
                            className="w-full px-3.5 py-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                          />
                          <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    )}

                    {selectedRole === 'college' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          AISHE Institution Code
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={regCodeOrRoll}
                            onChange={(e) => setRegCodeOrRoll(e.target.value)}
                            placeholder="e.g. C-18492"
                            className="w-full px-3.5 py-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                          />
                          <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    )}

                    {selectedRole === 'company' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Corporate Registration (CIN / MCA ID)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={regCodeOrRoll}
                            onChange={(e) => setRegCodeOrRoll(e.target.value)}
                            placeholder="e.g. U72900KA2020PTC138942"
                            className="w-full px-3.5 py-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                          />
                          <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Primary Identifier: Email / Roll / AISHE / CIN */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {currentRoleConfig.identifierLabel}
                    </label>
                    {!isRegisterMode && (
                      <button
                        type="button"
                        onClick={handlePrefillDemo}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                      >
                        Auto-fill demo credentials
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={currentRoleConfig.identifierPlaceholder}
                      className="w-full px-3.5 py-2.5 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    {!isRegisterMode && (
                      <button
                        type="button"
                        onClick={() => {
                          setForgotPasswordEmail(identifier);
                          setShowForgotPasswordModal(true);
                        }}
                        className="text-[11px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your secure password"
                      className="w-full px-3.5 py-2.5 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Terms */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                    />
                    <span>Remember this device for 30 days</span>
                  </label>

                  <span className="text-[10px] text-slate-400">
                    NCrF / NEP 2020 Compliant
                  </span>
                </div>

                {/* Submit CTA Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98 ${
                      selectedRole === 'student'
                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/20'
                        : selectedRole === 'college'
                        ? 'bg-teal-700 hover:bg-teal-600 shadow-teal-950/20'
                        : 'bg-emerald-800 hover:bg-emerald-700 shadow-emerald-950/20'
                    } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Verifying Credentials...</span>
                      </span>
                    ) : (
                      <>
                        <span>{isRegisterMode ? 'Complete Registration & Open Dashboard' : `Sign In as ${selectedRole === 'student' ? 'Student' : selectedRole === 'college' ? 'Institution' : 'Enterprise Recruiter'}`}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Alternative National Digital Identity Integrations */}
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
                Or authenticate via Government Digital Infrastructure
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(selectedRole)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Fingerprint className="w-4 h-4 text-emerald-600" />
                  <span>DigiLocker / Aadhaar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(selectedRole)}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <FileBadge className="w-4 h-4 text-teal-600" />
                  <span>Academic Bank of Credits</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: PERSONA HIGHLIGHTS & 1-CLICK DEMO LOGIN (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#071f1a] via-[#092b24] to-[#071f1a] text-white p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-emerald-900/60">
            <div className="space-y-6">
              
              {/* Persona Showcase Box */}
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-400/30">
                  <currentRoleConfig.icon className="w-6 h-6" />
                </div>
                <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  Target Experience
                </div>
                <h3 className="text-xl font-black text-white tracking-tight mt-0.5">
                  {currentRoleConfig.title}
                </h3>
                <p className="text-xs text-emerald-200/70 mt-1 leading-relaxed">
                  Tailored tools built specifically for the needs of {selectedRole === 'student' ? 'engineering graduates & learners' : selectedRole === 'college' ? 'deans, HODs and placement directors' : 'talent acquisition teams & tech recruiters'}.
                </p>
              </div>

              {/* Benefits Checklist */}
              <div className="space-y-2.5 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-800/60">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 mb-1">
                  Key Portal Capabilities:
                </div>
                {currentRoleConfig.benefits.map((benefit, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2.5 text-xs text-emerald-100/90 leading-snug">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* 1-Click Sandbox Fast Access */}
              <div className="p-4 bg-emerald-900/30 rounded-2xl border border-emerald-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Demo Sandbox</span>
                  </div>
                  <span className="text-[10px] text-emerald-200/60">1-Click Live Test</span>
                </div>

                <div className="p-3 bg-emerald-950/90 rounded-xl border border-emerald-700/60 flex items-center gap-3">
                  <img
                    src={currentRoleConfig.quickDemoUser.avatar}
                    alt={currentRoleConfig.quickDemoUser.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/50 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-black text-xs text-white truncate">
                      {currentRoleConfig.quickDemoUser.name}
                    </div>
                    <div className="text-[10px] text-emerald-300/70 truncate">
                      {currentRoleConfig.demoNote}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin(selectedRole)}
                  className="w-full py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>1-Click Launch as {currentRoleConfig.quickDemoUser.name.split(' ')[0]}</span>
                </button>
              </div>

            </div>

            {/* Bottom Security / Compliance Badge */}
            <div className="pt-6 mt-6 border-t border-emerald-900/60 flex items-center justify-between text-[11px] text-emerald-300/60">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Knowledge Verification</span>
              </span>
              <span>ISO 27001 Certified</span>
            </div>
          </div>

        </div>

        {/* THREE-PERSONA FAST SWITCH PILLS AT FOOTER */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Need to switch accounts?</span>
            <span>You can log in directly as:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('student')}
              className="px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Arun Kumar (Student)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('college')}
              className="px-3 py-1.5 bg-white hover:bg-teal-50 text-teal-800 border border-teal-200 rounded-xl font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Landmark className="w-3.5 h-3.5 text-teal-600" />
              <span>Dr. Radhakrishnan (Dean)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('company')}
              className="px-3 py-1.5 bg-white hover:bg-emerald-900/10 text-emerald-900 border border-emerald-300 rounded-xl font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Neha Sharma (Recruiter)</span>
            </button>
          </div>
        </div>

      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">Reset Account Password</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPasswordModal(false);
                  setForgotPasswordSent(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {forgotPasswordSent ? (
              <div className="space-y-4 py-2">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Password Reset Link Dispatched</div>
                    <div className="text-emerald-700/80 mt-0.5">
                      Instructions have been sent to <strong>{forgotPasswordEmail || 'your registered email'}</strong>. Check your inbox or institutional email.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPasswordModal(false);
                    setForgotPasswordSent(false);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Close & Return to Sign In Now</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter your registered institutional or corporate email address. We will send you an OTP and cryptographic recovery link.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registered Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="e.g. yourname@domain.edu or yourname@company.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordSent(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LOGIN SUCCESS 6-SECOND AUTO CLOSING CONFIRMATION MODAL */}
      {loginSuccessData && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            {/* Header with Success */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Access Granted
                    </span>
                    <span className="text-xs text-slate-400 font-mono">256-bit AES</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                    Authentication Confirmed
                  </h3>
                </div>
              </div>
            </div>

            {/* Authenticated User Preview Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3.5">
              <img
                src={loginSuccessData.user.avatar}
                alt={loginSuccessData.user.name}
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-emerald-500/40 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-slate-900 truncate">
                    {loginSuccessData.user.name}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                    {loginSuccessData.role}
                  </span>
                </div>
                <div className="text-xs text-slate-500 truncate mt-0.5">
                  {loginSuccessData.user.email}
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate mt-1">
                  Token: {loginSuccessData.sessionHash}
                </div>
              </div>
            </div>

            {/* Action Buttons: Continue Now vs Stay/Cancel */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => onLoginSuccess(loginSuccessData.user, loginSuccessData.role)}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Enter Workspace Immediately</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginSuccessData(null);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200"
              >
                Cancel / Switch Role
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
