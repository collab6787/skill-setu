import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserRole,
  LanguageCode,
  NotificationItem,
  User,
  StudentProfile,
  JobOpening
} from '../types';
import {
  Sparkles,
  Compass,
  Cpu,
  Radio,
  ShieldCheck,
  Building2,
  Layers,
  QrCode,
  GraduationCap,
  Globe,
  ChevronRight,
  CheckCircle2,
  Menu,
  X,
  Clock,
  RotateCcw,
  Search,
  ExternalLink,
  HelpCircle,
  LogOut,
  ChevronDown,
  UserCheck,
  Check,
  Target,
  LogIn,
  Award,
  TrendingUp,
  Briefcase,
  FileCheck,
  Star,
  Users,
  AlertTriangle,
  Building,
  Flame,
  BookOpen,
  BarChart3,
  FileText,
  Plus,
  Calendar,
  Lock
} from 'lucide-react';
import { JobNotificationBell } from './JobNotificationBell';

export interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  notifications: NotificationItem[];
  currentUser: User;
  onOpenChat: () => void;
  student?: StudentProfile;
  jobs?: JobOpening[];
  onSelectJob?: (jobId: string) => void;
  onSimulateSkill?: (skillName: string) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const AUTO_HIDE_SECONDS = 15;

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeRole,
  setActiveRole,
  language,
  setLanguage,
  notifications,
  currentUser,
  onOpenChat,
  student,
  jobs = [],
  onSelectJob,
  onSimulateSkill,
  isLoggedIn = true,
  onLogout
}) => {
  // Navigation visibility state - Hidden by default as mandated
  const [isOpen, setIsOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(AUTO_HIDE_SECONDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // References
  const drawerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Reset the 15-second timer
  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setSecondsRemaining(AUTO_HIDE_SECONDS);
  }, []);

  // Handle open/close with keyboard and focus management
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    resetTimer();
  }, [resetTimer]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Return focus to menu button for accessibility
    setTimeout(() => {
      menuButtonRef.current?.focus();
    }, 50);
  }, []);

  // Global keyboard shortcuts (Alt+M to toggle, Escape to close)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && (e.key === 'm' || e.key === 'M')) || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        setIsOpen(prev => {
          if (!prev) resetTimer();
          return !prev;
        });
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, handleClose, resetTimer]);

  // 15-Second Inactivity Auto-Hide Engine
  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Reset timestamp on drawer open
    lastActivityRef.current = Date.now();
    setSecondsRemaining(AUTO_HIDE_SECONDS);

    timerRef.current = setInterval(() => {
      if (isTimerPaused) return;

      const elapsed = (Date.now() - lastActivityRef.current) / 1000;
      const left = Math.max(0, Math.ceil(AUTO_HIDE_SECONDS - elapsed));
      setSecondsRemaining(left);

      if (left <= 0) {
        handleClose();
      }
    }, 200);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, isTimerPaused, handleClose]);

  // Activity listeners inside drawer to reset the 15-second timer
  const handleDrawerActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  // Role Metadata
  const roleLabels: Record<
    UserRole,
    { label: string; icon: any; color: string; desc: string; badge: string; pill: string }
  > = {
    student: {
      label: 'Student Portal',
      icon: GraduationCap,
      color: 'bg-emerald-600 text-white hover:bg-emerald-500',
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
      pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      desc: 'Verify skills, simulate roles & match jobs'
    },
    college: {
      label: 'College Center',
      icon: Layers,
      color: 'bg-teal-600 text-white hover:bg-teal-500',
      badge: 'bg-teal-950/80 text-teal-300 border-teal-800/60',
      pill: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      desc: 'Curriculum heatmap & cohort analytics'
    },
    company: {
      label: 'Company Hiring',
      icon: Building2,
      color: 'bg-emerald-700 text-white hover:bg-emerald-600',
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
      pill: 'bg-emerald-600/20 text-emerald-200 border-emerald-600/40',
      desc: 'Verified candidate ranking & pipeline'
    },
    admin: {
      label: 'National Admin',
      icon: ShieldCheck,
      color: 'bg-amber-600 text-white hover:bg-amber-500',
      badge: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
      pill: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      desc: 'Accreditation, Aadhaar audit & compliance'
    }
  };

  // Structured Role-Specific Navigation Groups
  const getNavigationItems = () => {
    if (!isLoggedIn) {
      return [
        { id: 'landing', label: 'Platform Overview', icon: Globe, desc: 'National skill verification mission & architecture', badge: 'Public' },
        { id: 'login', label: 'Stakeholder Login', icon: LogIn, desc: 'Dedicated portal for Students, Colleges & Companies', badge: 'Auth' },
        { id: 'verify-public', label: 'Public QR Check', icon: QrCode, desc: 'Recruiter credential audit & QR verification', badge: 'Audit Ready' }
      ];
    }

    if (activeRole === 'student') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: Compass, desc: 'Readiness score, skills & quick actions', badge: 'Overview' },
        { id: 'profile', label: 'Profile', icon: UserCheck, desc: 'Academic details, target role & verify status', badge: 'Profile' },
        { id: 'skill-assessment', label: 'Skill Assessment', icon: Award, desc: 'AI diagnostic test & live evaluation', badge: 'AI Test' },
        { id: 'skill-demand', label: 'Skill Demand', icon: TrendingUp, desc: 'Hiring demand & salary trajectory', badge: 'Market' },
        { id: 'career-roadmap', label: 'Career Roadmap', icon: Target, desc: 'Personalized milestone roadmap', badge: 'Roadmap' },
        { id: 'job-simulator', label: 'Job Simulator', icon: Radio, desc: 'Day-in-the-life workplace tasks', badge: 'Interactive' },
        { id: 'jobs', label: 'Jobs', icon: Briefcase, desc: 'Tailored openings matching verified profile', badge: 'Direct Hire' },
        { id: 'company-matching', label: 'Company Matching', icon: Sparkles, desc: 'Company culture & fit radar', badge: 'AI Match' },
        { id: 'passport', label: 'Skill Passport', icon: ShieldCheck, desc: 'Verifiable credentials & peer proofs', badge: 'Audit Ready' },
        { id: 'evidence', label: 'Evidence & Verification', icon: FileCheck, desc: 'Cryptographic GitHub & project proofs', badge: 'Cryptographic' },
        { id: 'certificates', label: 'Certificates', icon: Award, desc: 'Accredited certificates with QR check', badge: 'Accredited' },
        { id: 'badges', label: 'Badges & XP', icon: Star, desc: 'Skill mastery badges, XP & streak stats', badge: 'Gamified' },
        { id: 'career-insights', label: 'Career Insights', icon: Cpu, desc: 'Career readiness index & salary forecast', badge: 'Intelligence' },
        { id: 'logout', label: 'Logout', icon: LogOut, desc: `Sign out of ${currentUser.name}'s Student Account`, badge: 'Exit' }
      ];
    }

    if (activeRole === 'college') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: Compass, desc: 'Institutional cohort metrics & stats', badge: 'Overview' },
        { id: 'student-analytics', label: 'Student Analytics', icon: Users, desc: 'Student skill proficiency distribution', badge: 'Analytics' },
        { id: 'skill-gap-analysis', label: 'Skill Gap Analysis', icon: AlertTriangle, desc: 'Curriculum deficit vs industry benchmark', badge: 'Gaps' },
        { id: 'placement-readiness', label: 'Placement Readiness', icon: TrendingUp, desc: 'Placement rate trajectory & salary offers', badge: 'Readiness' },
        { id: 'department-analytics', label: 'Department Analytics', icon: Building, desc: 'CSE, AI/DS, IT & ECE comparative metrics', badge: 'Departments' },
        { id: 'industry-demand', label: 'Industry Demand', icon: Flame, desc: 'Skills actively sought by recruiters', badge: 'Industry' },
        { id: 'student-cohorts', label: 'Student Cohorts', icon: GraduationCap, desc: 'Batch roster & verification status', badge: 'Cohorts' },
        { id: 'training-insights', label: 'Training Insights', icon: BookOpen, desc: 'Recommended bootcamps & intervention', badge: 'Curriculum' },
        { id: 'companies', label: 'Companies', icon: Building2, desc: 'Recruiting partners & campus drive pipeline', badge: 'Partners' },
        { id: 'placement-analytics', label: 'Placement Analytics', icon: BarChart3, desc: 'Package distribution & offer stats', badge: 'Placements' },
        { id: 'reports', label: 'Reports', icon: FileText, desc: 'NAAC, NIRF & AICTE compliance skill exports', badge: 'Accreditation' },
        { id: 'college-profile', label: 'College Profile', icon: Building2, desc: 'Institutional accreditation & details', badge: 'Profile' },
        { id: 'logout', label: 'Logout', icon: LogOut, desc: `Sign out of ${currentUser.name}'s College Account`, badge: 'Exit' }
      ];
    }

    // activeRole === 'company'
    return [
      { id: 'dashboard', label: 'Dashboard', icon: Compass, desc: 'Pipeline overview, active requisitions & candidates', badge: 'Overview' },
      { id: 'post-job', label: 'Post a Job', icon: Plus, desc: 'Create and publish new role opening', badge: 'Hiring' },
      { id: 'find-candidates', label: 'Find Candidates', icon: Search, desc: 'Filter pre-verified students by skill', badge: 'Search' },
      { id: 'ai-matching', label: 'AI Matching', icon: Sparkles, desc: 'Smart candidate matching & semantic scoring', badge: 'AI Fit' },
      { id: 'talent-pool', label: 'Talent Pool', icon: Users, desc: 'Pre-screened engineering candidates', badge: 'Pool' },
      { id: 'verified-skills', label: 'Verified Skills', icon: ShieldCheck, desc: 'Cryptographic proof audit & tamper check', badge: 'Verified' },
      { id: 'applications', label: 'Applications', icon: Briefcase, desc: 'Applicant tracking pipeline & review', badge: 'ATS' },
      { id: 'interview-pipeline', label: 'Interview Pipeline', icon: Calendar, desc: 'Technical & manager interview board', badge: 'Pipeline' },
      { id: 'hiring-analytics', label: 'Hiring Analytics', icon: TrendingUp, desc: 'Time-to-hire & institutional yield', badge: 'Metrics' },
      { id: 'industry-insights', label: 'Industry Insights', icon: Flame, desc: 'Talent scarcity & market compensation', badge: 'Benchmarks' },
      { id: 'company-profile', label: 'Company Profile', icon: Building2, desc: 'Employer credentials & verification', badge: 'Profile' },
      { id: 'logout', label: 'Logout', icon: LogOut, desc: `Sign out of ${currentUser.name}'s Company Account`, badge: 'Exit' }
    ];
  };

  const mainNavigationItems = getNavigationItems();
  const toolsNavigationItems: { id: string; label: string; icon: any; desc: string; badge: string }[] = [];

  const handleRoleSelect = (role: UserRole) => {
    setActiveRole(role);
    resetTimer();
    setActiveTab('dashboard');
    handleClose();
  };

  const handleNavigate = (tabId: string) => {
    if (tabId === 'logout') {
      handleClose();
      onLogout?.();
      return;
    }
    setActiveTab(tabId);
    handleClose();
  };

  // Active tab label for the top bar breadcrumb
  const currentTabItem =
    [...mainNavigationItems, ...toolsNavigationItems].find(item => item.id === activeTab) ||
    mainNavigationItems[0];
  const CurrentIcon = currentTabItem.icon;

  // Filter items if user typed in search query
  const query = searchQuery.trim().toLowerCase();
  const filteredMain = mainNavigationItems.filter(
    item => item.label.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
  );
  const filteredTools = toolsNavigationItems.filter(
    item => item.label.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)
  );

  return (
    <>
      {/* =========================================================================
          PERMANENT TOP APPLICATION BAR (Always Accessible, Clean & Minimal)
         ========================================================================= */}
      <header
        aria-label="Application Top Header"
        className="w-full shrink-0 z-30 bg-[#071f1a] border-b border-emerald-900/60 shadow-lg lg:rounded-[22px] px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3 text-slate-100"
      >
        {/* Left Side: Designated Menu Button + SkillSetu Brand */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          
          {/* PRIMARY DESIGNATED MENU / NAVIGATION BUTTON */}
          <button
            ref={menuButtonRef}
            id="nav-menu-trigger-button"
            onClick={() => (isOpen ? handleClose() : handleOpen())}
            aria-expanded={isOpen}
            aria-controls="navigation-system-drawer"
            aria-label="Toggle Application Navigation Menu"
            className={`h-10 px-3.5 sm:px-4 rounded-xl font-extrabold text-xs flex items-center gap-2 sm:gap-2.5 transition-all shadow-md active:scale-95 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-400 select-none ${
              isOpen
                ? 'bg-emerald-500 text-white shadow-emerald-950/60 ring-2 ring-emerald-300'
                : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white hover:from-emerald-500 hover:to-teal-400 shadow-emerald-950/40 hover:shadow-emerald-900/60'
            }`}
          >
            {isOpen ? (
              <X className="w-4 h-4 shrink-0 aspect-square text-white" />
            ) : (
              <Menu className="w-4 h-4 shrink-0 aspect-square text-white" />
            )}
            
            <span className="tracking-wide">
              {isOpen ? 'Close' : 'Menu'}
            </span>

            {/* Keyboard shortcut hint badge */}
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-950/40 text-emerald-200 border border-emerald-400/30">
              Alt+M
            </span>
          </button>

          {/* Brand Identity Logo & Name */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 text-left group focus:outline-hidden cursor-pointer"
            aria-label="SkillSetu home dashboard"
          >
            <div className="w-9 h-9 min-w-9 min-h-9 aspect-square shrink-0 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 shrink-0 aspect-square text-white animate-pulse" />
            </div>
            <div className="hidden xs:flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg tracking-tight text-white leading-none">
                  Skill<span className="text-emerald-400">Setu</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-bold bg-emerald-950/80 text-emerald-300 rounded-full border border-emerald-800/80 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 aspect-square rounded-full bg-emerald-400 animate-pulse" />
                  AI Platform
                </span>
              </div>
              <p className="text-[10px] text-emerald-200/60 font-medium whitespace-nowrap leading-tight mt-0.5 hidden sm:block">
                National Skill Intelligence
              </p>
            </div>
          </button>

          {/* Current Active Location Pill (Breadcrumb) */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-emerald-900/60">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0a2922] border border-emerald-900/80 text-xs font-semibold text-emerald-200">
              <CurrentIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0 aspect-square" />
              <span className="truncate max-w-[140px] lg:max-w-[180px]">{currentTabItem.label}</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleLabels[activeRole].pill}`}>
              {roleLabels[activeRole].label.replace(' Portal', '').replace(' Center', '').replace(' Hiring', '')}
            </span>
          </div>
        </div>

        {/* Right Side: Language Switcher, Notifications, AI Assistant & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Quick Regional Language Switcher Pill */}
          <div className="hidden sm:flex items-center p-0.5 bg-[#0a2922] rounded-xl border border-emerald-900/60 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                language === 'en' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-200/70 hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                language === 'ta' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-200/70 hover:text-white'
              }`}
              title="தமிழ் (Tamil)"
            >
              தமிழ்
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                language === 'hi' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-200/70 hover:text-white'
              }`}
              title="हिन्दी (Hindi)"
            >
              हिन्दी
            </button>
          </div>

          {/* Job Notification Bell */}
          <JobNotificationBell
            student={student}
            jobs={jobs}
            notifications={notifications}
            onSelectJob={(jobId) => {
              if (onSelectJob) onSelectJob(jobId);
              else setActiveTab('jobs');
            }}
            onNavigateToJobs={() => setActiveTab('jobs')}
            onNavigateToSkillSimulator={onSimulateSkill}
          />

          {/* Quick AI Advisor Trigger */}
          <button
            onClick={onOpenChat}
            className="h-9 px-2.5 sm:px-3 rounded-xl bg-emerald-700/60 hover:bg-emerald-600 border border-emerald-600/40 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
            title="Open SkillSetu AI Assistant"
            aria-label="Open SkillSetu AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0 aspect-square text-emerald-200 animate-pulse" />
            <span className="hidden sm:inline">AI Advisor</span>
          </button>

          {/* Auth State Button: Shows "Logout" only once signed in or logged in, otherwise "Sign In" */}
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="h-9 px-2.5 sm:px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-red-950/50 hover:bg-red-900/70 text-red-200 border-red-800/70 shadow-xs active:scale-95"
              title={`Logged in as ${currentUser.name} (${roleLabels[activeRole].label}). Click to log out`}
              aria-label="Logout"
              id="navbar-auth-logout-btn"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className={`h-9 px-2.5 sm:px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                activeTab === 'login'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-xs'
                  : 'bg-[#0a2922] hover:bg-emerald-900/50 text-emerald-200/90 border-emerald-800/70'
              }`}
              title="Open Student, College & Company Login Portal"
              aria-label="Sign In"
              id="navbar-auth-signin-btn"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden md:inline">Sign In</span>
            </button>
          )}

          {/* Active User Avatar with Online Status */}
          <div
            onClick={() => handleOpen()}
            className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-emerald-900/60 cursor-pointer group"
            title={`${currentUser.name} (${roleLabels[activeRole].label}) - Click to open menu`}
          >
            <div className="relative h-9 w-9 min-h-9 min-w-9 aspect-square shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-9 w-9 min-h-9 min-w-9 aspect-square shrink-0 rounded-full ring-2 ring-emerald-700/60 object-cover shadow-2xs group-hover:ring-emerald-400 transition-all"
              />
              <span
                className="absolute bottom-0 right-0 w-2.5 h-2.5 min-w-2.5 min-h-2.5 aspect-square bg-emerald-400 border-2 border-[#071f1a] rounded-full shrink-0"
                title="Online"
              />
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          ANIMATED PROFESSIONAL SLIDE-IN NAVIGATION DRAWER (Hidden by default)
         ========================================================================= */}
      <AnimatePresence>
        {isOpen && (
          <div
            id="navigation-system-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Main Site Navigation System"
            className="fixed inset-0 z-50 flex"
          >
            {/* Backdrop with Blur and Outside Click Dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/65 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-In Navigation Panel from Left */}
            <motion.div
              ref={drawerRef}
              initial={{ x: '-100%', opacity: 0.7 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              onMouseMove={handleDrawerActivity}
              onMouseDown={handleDrawerActivity}
              onTouchStart={handleDrawerActivity}
              onKeyDown={handleDrawerActivity}
              onScroll={handleDrawerActivity}
              className="relative w-full max-w-md sm:max-w-lg h-full max-h-[100vh] bg-[#071f1a] text-slate-100 shadow-2xl flex flex-col justify-between z-10 border-r border-emerald-900/70 overflow-hidden"
              style={{ maxHeight: '100dvh' }}
            >
              {/* =====================================================================
                  DRAWER HEADER: Brand, Close Button & 15s Auto-Hide Countdown Pill
                 ===================================================================== */}
              <div className="p-4 sm:p-5 border-b border-emerald-900/60 bg-[#061a15] shrink-0 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 min-w-10 min-h-10 aspect-square shrink-0 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-950/50">
                      <Sparkles className="w-5 h-5 shrink-0 aspect-square text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-black text-lg tracking-tight text-white leading-none">
                          Skill<span className="text-emerald-400">Setu</span>
                        </h2>
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-950 text-emerald-300 rounded-full border border-emerald-800/80">
                          Navigation
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-300/60 font-medium leading-tight mt-0.5">
                        National Skill Intelligence & Verification
                      </p>
                    </div>
                  </div>

                  {/* Manual Close Button */}
                  <button
                    onClick={handleClose}
                    className="h-9 w-9 min-h-9 min-w-9 aspect-square shrink-0 rounded-xl bg-[#0a2922] text-emerald-300 border border-emerald-800/60 flex items-center justify-center hover:bg-emerald-900/60 hover:text-white transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
                    aria-label="Close navigation drawer"
                    title="Close Navigation (Esc)"
                  >
                    <X className="w-5 h-5 shrink-0 aspect-square" />
                  </button>
                </div>

                {/* 15-SECOND AUTO-HIDE TIMER BAR & INDICATOR */}
                <div className="p-2.5 bg-[#0a2922]/90 rounded-xl border border-emerald-900/70 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <div className="flex items-center gap-1.5 text-emerald-300">
                      <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0 aspect-square animate-spin" style={{ animationDuration: '6s' }} />
                      <span>
                        Auto-closing in <strong className="font-extrabold text-white text-xs">{secondsRemaining}s</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-emerald-300/70">
                      <span>Activity resets timer</span>
                      <button
                        onClick={() => {
                          setIsTimerPaused(prev => !prev);
                          resetTimer();
                        }}
                        className={`px-1.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                          isTimerPaused
                            ? 'bg-amber-500 text-slate-900'
                            : 'bg-emerald-900/80 text-emerald-200 hover:text-white'
                        }`}
                        title={isTimerPaused ? 'Resume auto-close' : 'Pause auto-close'}
                      >
                        {isTimerPaused ? 'Paused' : 'Pause'}
                      </button>
                    </div>
                  </div>

                  {/* Smooth countdown progress bar */}
                  <div className="w-full h-1.5 bg-emerald-950/80 rounded-full overflow-hidden border border-emerald-900/40">
                    <motion.div
                      className={`h-full rounded-full transition-all ${
                        secondsRemaining <= 4 ? 'bg-amber-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      }`}
                      style={{
                        width: `${(secondsRemaining / AUTO_HIDE_SECONDS) * 100}%`
                      }}
                    />
                  </div>
                </div>

                {/* Quick Search / Filter in Navigation */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-emerald-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Jump to destination or tool..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      resetTimer();
                    }}
                    className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-[#09241e] border border-emerald-900/60 text-xs text-white placeholder-emerald-400/40 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-400/60 hover:text-white text-xs cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* =====================================================================
                  DRAWER BODY: Structured, Organized & Spacious Navigation Sections
                 ===================================================================== */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 scrollbar-thin scrollbar-thumb-emerald-900">
                
                {/* SECTION 1: AUTHENTICATED ROLE STATUS & TENANT ISOLATION */}
                {isLoggedIn ? (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#092b23] to-[#0d3b30] border border-emerald-800/80 text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                        Authenticated Account
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                        <Lock className="w-2.5 h-2.5 text-emerald-400" />
                        Session Locked
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/40 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-white text-sm truncate">{currentUser.name}</h4>
                        <p className="text-[11px] text-emerald-300/80 font-medium truncate">
                          {roleLabels[activeRole].label} • {currentUser.email}
                        </p>
                      </div>
                    </div>

                    <p className="text-[10px] text-emerald-300/60 leading-tight pt-1.5 border-t border-emerald-900/60">
                      Role is determined by your authenticated account. In accordance with strict RBAC standards, manual cross-role switching is disabled. To access another role, please log out.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400/70">
                        Choose Portal to Sign In
                      </span>
                      <span className="text-[10px] font-bold text-emerald-300/50">3 Roles</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {(['student', 'college', 'company'] as UserRole[]).map(r => (
                        <button
                          key={r}
                          onClick={() => {
                            setActiveRole(r);
                            setActiveTab('login');
                            handleClose();
                          }}
                          className="p-2 rounded-xl bg-[#0a2922] border border-emerald-900/60 hover:bg-emerald-900/50 text-center text-xs text-white cursor-pointer"
                        >
                          <span className="capitalize font-bold text-[11px] block">{r}</span>
                          <span className="text-[9px] text-emerald-400">Sign In</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION 2: PRIMARY NAVIGATION (MAIN) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400/70">
                      Main Workspace
                    </span>
                    <span className="text-[10px] font-bold text-emerald-300/50">Primary</span>
                  </div>

                  <div className="space-y-1.5">
                    {filteredMain.length === 0 ? (
                      <p className="text-xs text-emerald-400/50 py-2">No matching items in Main Workspace.</p>
                    ) : (
                      filteredMain.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                          <button
                            key={tab.id}
                            onClick={() => handleNavigate(tab.id)}
                            className={`w-full p-3 rounded-2xl flex items-center gap-3.5 text-left transition-all group focus:outline-hidden cursor-pointer select-none ${
                              isActive
                                ? 'bg-gradient-to-r from-emerald-500/25 to-teal-500/15 text-emerald-200 font-bold border border-emerald-400/50 shadow-sm'
                                : 'text-emerald-100/80 hover:bg-emerald-900/30 hover:text-white border border-transparent'
                            }`}
                          >
                            {/* 1:1 Aspect Ratio Icon Box */}
                            <div
                              className={`w-9 h-9 min-w-9 min-h-9 aspect-square shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                                isActive
                                  ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-900'
                                  : 'bg-[#0a2922] text-emerald-400 border border-emerald-900/60 group-hover:text-emerald-200 group-hover:border-emerald-700/60'
                              }`}
                            >
                              <Icon className="w-4.5 h-4.5 shrink-0 aspect-square" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-bold leading-tight truncate">
                                  {tab.label}
                                </span>
                                {tab.badge && (
                                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold shrink-0 ${
                                    isActive ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                                  }`}>
                                    {tab.badge}
                                  </span>
                                )}
                              </div>
                              <div className={`text-[11px] font-normal leading-tight truncate mt-0.5 ${
                                isActive ? 'text-emerald-200/80' : 'text-emerald-300/50'
                              }`}>
                                {tab.desc}
                              </div>
                            </div>

                            <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                              isActive ? 'text-emerald-300 translate-x-0.5' : 'text-emerald-600 group-hover:translate-x-0.5 group-hover:text-emerald-300'
                            }`} />
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* SECTION 3: INTELLIGENCE & SIMULATION (TOOLS) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400/70">
                      Tools & Intelligence
                    </span>
                    <span className="text-[10px] font-bold text-emerald-300/50">Simulations</span>
                  </div>

                  <div className="space-y-1.5">
                    {filteredTools.length === 0 ? (
                      <p className="text-xs text-emerald-400/50 py-2">No matching items in Tools.</p>
                    ) : (
                      filteredTools.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                          <button
                            key={tab.id}
                            onClick={() => handleNavigate(tab.id)}
                            className={`w-full p-3 rounded-2xl flex items-center gap-3.5 text-left transition-all group focus:outline-hidden cursor-pointer select-none ${
                              isActive
                                ? 'bg-gradient-to-r from-emerald-500/25 to-teal-500/15 text-emerald-200 font-bold border border-emerald-400/50 shadow-sm'
                                : 'text-emerald-100/80 hover:bg-emerald-900/30 hover:text-white border border-transparent'
                            }`}
                          >
                            <div
                              className={`w-9 h-9 min-w-9 min-h-9 aspect-square shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                                isActive
                                  ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-900'
                                  : 'bg-[#0a2922] text-emerald-400 border border-emerald-900/60 group-hover:text-emerald-200 group-hover:border-emerald-700/60'
                              }`}
                            >
                              <Icon className="w-4.5 h-4.5 shrink-0 aspect-square" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-bold leading-tight truncate">
                                  {tab.label}
                                </span>
                                {tab.badge && (
                                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold shrink-0 ${
                                    isActive ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                                  }`}>
                                    {tab.badge}
                                  </span>
                                )}
                              </div>
                              <div className={`text-[11px] font-normal leading-tight truncate mt-0.5 ${
                                isActive ? 'text-emerald-200/80' : 'text-emerald-300/50'
                              }`}>
                                {tab.desc}
                              </div>
                            </div>

                            <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                              isActive ? 'text-emerald-300 translate-x-0.5' : 'text-emerald-600 group-hover:translate-x-0.5 group-hover:text-emerald-300'
                            }`} />
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* SECTION 4: PREFERENCES & REGIONAL LANGUAGE */}
                <div className="p-3.5 bg-[#0a2922]/70 rounded-2xl border border-emerald-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400/70 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Regional Language</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-300/50">Multilingual</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setLanguage('en');
                        resetTimer();
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                        language === 'en'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-[#09241e] text-emerald-200 hover:bg-emerald-900/40 border border-emerald-900/50'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('ta');
                        resetTimer();
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                        language === 'ta'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-[#09241e] text-emerald-200 hover:bg-emerald-900/40 border border-emerald-900/50'
                      }`}
                    >
                      தமிழ்
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('hi');
                        resetTimer();
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                        language === 'hi'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-[#09241e] text-emerald-200 hover:bg-emerald-900/40 border border-emerald-900/50'
                      }`}
                    >
                      हिन्दी
                    </button>
                  </div>
                </div>
              </div>

              {/* =====================================================================
                  DRAWER FOOTER: User Profile, AI Advisor Button & Sign-Out / Reset
                 ===================================================================== */}
              <div className="p-4 sm:p-5 border-t border-emerald-900/60 bg-[#061a15] space-y-3 shrink-0">
                
                {/* AI Assistant Quick Trigger Button */}
                <button
                  onClick={() => {
                    handleClose();
                    onOpenChat();
                  }}
                  className="w-full h-11 px-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4 shrink-0 aspect-square text-emerald-100 animate-pulse" />
                  <span>Open SkillSetu AI Advisor</span>
                </button>

                {/* Account & Profile Summary Card */}
                <div className="p-3 bg-[#0a2922] rounded-2xl border border-emerald-900/70 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative h-10 w-10 min-h-10 min-w-10 aspect-square shrink-0">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="h-10 w-10 min-h-10 min-w-10 aspect-square shrink-0 rounded-full object-cover ring-2 ring-emerald-700/60"
                      />
                      <span
                        className="absolute bottom-0 right-0 w-2.5 h-2.5 aspect-square bg-emerald-400 border-2 border-[#0a2922] rounded-full"
                        title="Active Session"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-white truncate flex items-center gap-1.5">
                        <span>{currentUser.name}</span>
                        {student?.identityVerification?.verified && (
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="Identity Verified" />
                        )}
                      </div>
                      <div className="text-[10px] text-emerald-300/60 truncate mt-0.5">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Logout / Sign In button */}
                    {isLoggedIn ? (
                      <button
                        onClick={() => {
                          handleClose();
                          onLogout?.();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white border border-red-800/60 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                        title="Log out of current session"
                        aria-label="Log out"
                      >
                        <LogOut className="w-3.5 h-3.5 shrink-0 text-red-400" />
                        <span>Logout</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleClose();
                          setActiveTab('login');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 hover:text-white border border-emerald-800/60 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                        title="Sign In"
                        aria-label="Sign In"
                      >
                        <LogIn className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                        <span>Sign In</span>
                      </button>
                    )}

                    {/* Reset/Sign out simulation button */}
                    <button
                      onClick={() => {
                        handleClose();
                        setActiveTab('dashboard');
                        setActiveRole('student');
                      }}
                      className="p-2 rounded-xl text-emerald-300/70 hover:text-white hover:bg-emerald-900/50 transition-colors cursor-pointer"
                      title="Reset Session / Return to Student Dashboard"
                      aria-label="Reset session"
                    >
                      <RotateCcw className="w-4 h-4 shrink-0 aspect-square" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
