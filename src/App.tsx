import React, { useState, useEffect } from 'react';
import {
  UserRole,
  LanguageCode,
  StudentProfile,
  SkillTrend,
  JobOpening,
  SkillPassport,
  CollegeStats,
  HeatmapDataRow,
  NotificationItem,
  User
} from './types';
import {
  DEMO_USERS,
  STAR_STUDENT_ARUN,
  OTHER_STUDENTS_POOL,
  SKILL_TRENDS_DATA,
  DEMO_JOBS,
  DEMO_PASSPORTS,
  DEMO_COLLEGE_STATS,
  DEMO_HEATMAP_DATA,
  DEMO_NOTIFICATIONS
} from './data/seedData';
import {
  calculateStudentSkillGaps,
  generateNextBestSkillRecommendation
} from './services/mlEngine';
import { Navbar } from './components/Navbar';
import { StudentDashboard } from './components/StudentDashboard';
import { SkillIntelligenceView } from './components/SkillIntelligenceView';
import { JobSimulatorView } from './components/JobSimulatorView';
import { SkillPassportView } from './components/SkillPassportView';
import { PublicVerifyPassportView } from './components/PublicVerifyPassportView';
import { CollegeDashboardView } from './components/CollegeDashboardView';
import { CompanyDashboardView } from './components/CompanyDashboardView';
import { JobsView } from './components/JobsView';
import { EvidenceModal } from './components/EvidenceModal';
import { AadhaarVerifyModal } from './components/AadhaarVerifyModal';
import { RegionalChatbotDrawer } from './components/RegionalChatbotDrawer';
import { SkillSetuAIChat } from './components/SkillSetuAIChat';
import { PlatformLandingView } from './components/PortalLandingView';
import { SkillRecommendationsView } from './components/SkillRecommendationsView';
import { LoginPage } from './components/LoginPage';

// Student Role Views
import { StudentProfileView } from './components/StudentProfileView';
import { StudentSkillAssessmentView } from './components/StudentSkillAssessmentView';
import { StudentSkillDemandView } from './components/StudentSkillDemandView';
import { StudentCareerRoadmapView } from './components/StudentCareerRoadmapView';
import { StudentCompanyMatchingView } from './components/StudentCompanyMatchingView';
import { StudentEvidenceView } from './components/StudentEvidenceView';
import { StudentCertificatesView } from './components/StudentCertificatesView';
import { StudentBadgesView } from './components/StudentBadgesView';
import { StudentCareerInsightsView } from './components/StudentCareerInsightsView';

// College Role Views
import { CollegeStudentAnalyticsView } from './components/college/CollegeStudentAnalyticsView';
import { CollegeSkillGapAnalysisView } from './components/college/CollegeSkillGapAnalysisView';
import { CollegePlacementReadinessView } from './components/college/CollegePlacementReadinessView';
import { CollegeDepartmentAnalyticsView } from './components/college/CollegeDepartmentAnalyticsView';
import { CollegeIndustryDemandView } from './components/college/CollegeIndustryDemandView';
import { CollegeStudentCohortsView } from './components/college/CollegeStudentCohortsView';
import { CollegeTrainingInsightsView } from './components/college/CollegeTrainingInsightsView';
import { CollegeCompaniesView } from './components/college/CollegeCompaniesView';
import { CollegePlacementAnalyticsView } from './components/college/CollegePlacementAnalyticsView';
import { CollegeReportsView } from './components/college/CollegeReportsView';
import { CollegeProfileView } from './components/college/CollegeProfileView';

// Company Role Views
import { CompanyJobCreatePage } from './components/CompanyJobCreatePage';
import { CompanyFindCandidatesView } from './components/company/CompanyFindCandidatesView';
import { CompanyAIMatchingView } from './components/company/CompanyAIMatchingView';
import { CompanyTalentPoolView } from './components/company/CompanyTalentPoolView';
import { CompanyVerifiedSkillsView } from './components/company/CompanyVerifiedSkillsView';
import { CompanyApplicationsView } from './components/company/CompanyApplicationsView';
import { CompanyInterviewPipelineView } from './components/company/CompanyInterviewPipelineView';
import { CompanyHiringAnalyticsView } from './components/company/CompanyHiringAnalyticsView';
import { CompanyIndustryInsightsView } from './components/company/CompanyIndustryInsightsView';
import { CompanyProfileView } from './components/company/CompanyProfileView';

import { AccessRestrictedView } from './components/AccessRestrictedView';
import {
  Sparkles,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  LogOut
} from 'lucide-react';

export default function App() {
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [language, setLanguage] = useState<LanguageCode>('en');

  // Application Data States
  const [student, setStudent] = useState<StudentProfile>(STAR_STUDENT_ARUN);
  const [skillTrends, setSkillTrends] = useState<SkillTrend[]>(SKILL_TRENDS_DATA);
  const [jobs, setJobs] = useState<JobOpening[]>(DEMO_JOBS);
  const [passport, setPassport] = useState<SkillPassport>(DEMO_PASSPORTS['PASS-2026-ARUN-8921']);
  const [collegeStats, setCollegeStats] = useState<CollegeStats>(DEMO_COLLEGE_STATS);
  const [heatmap, setHeatmap] = useState<HeatmapDataRow[]>(DEMO_HEATMAP_DATA);
  const [candidates, setCandidates] = useState<StudentProfile[]>([STAR_STUDENT_ARUN, ...OTHER_STUDENTS_POOL]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEMO_NOTIFICATIONS);

  // Modals & Drawers
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceModalSkill, setEvidenceModalSkill] = useState('FastAPI');
  const [showAadhaarModal, setShowAadhaarModal] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [simulatorInitialSkill, setSimulatorInitialSkill] = useState('FastAPI');
  const [selectedJobId, setSelectedJobId] = useState('job-technova-01');
  const [inspectedCandidateId, setInspectedCandidateId] = useState<string>('std-arun-01');
  const [companyPreviousTab, setCompanyPreviousTab] = useState<string>('dashboard');

  const handleOpenCandidatePassport = (candidateId?: string) => {
    if (candidateId) {
      setInspectedCandidateId(candidateId);
    }
    setCompanyPreviousTab(activeTab);
    setActiveTab('passport');
  };

  // Skill boost simulation for badges & leveling
  const handleSimulateSkillBoost = (skillName: string, delta: number) => {
    setStudent(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      let s = updated.skills.find(
        (x: any) => x.skillName.toLowerCase().includes(skillName.toLowerCase()) ||
                    skillName.toLowerCase().includes(x.skillName.toLowerCase())
      );
      if (s) {
        s.proficiencyScore = Math.min(100, s.proficiencyScore + delta);
        s.proficiencyLevel = s.proficiencyScore >= 80 ? 'Advanced' : s.proficiencyScore >= 60 ? 'Intermediate' : 'Beginner';
        s.evidenceCount = (s.evidenceCount || 0) + 1;
      } else {
        updated.skills.push({
          skillId: `sk-${skillName.toLowerCase().replace(/\s+/g, '-')}`,
          skillName: skillName,
          category: 'Specialized Track',
          proficiencyScore: Math.min(100, 75 + delta),
          proficiencyLevel: 'Advanced',
          confidenceScore: 88,
          evidenceCount: 1,
          evidenceItems: [],
          verificationStatus: 'Verified',
          marketDemandScore: 85,
          growthRate: 25,
          trend: 'BOOMING',
          lastUpdated: new Date().toISOString().split('T')[0]
        });
      }
      updated.careerReadinessScore.overall = Math.min(99, updated.careerReadinessScore.overall + 4);
      return updated;
    });
  };

  // Computed AI states for active student
  const studentGaps = calculateStudentSkillGaps(student);
  const aiRecommendation = generateNextBestSkillRecommendation(student, studentGaps);

  // Synchronize with API backend
  useEffect(() => {
    fetch('/api/students/std-arun-01')
      .then(res => res.json())
      .then(data => { if (data && data.id) setStudent(data); })
      .catch(e => console.log('Using local state initialization'));

    fetch('/api/skill-trends')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setSkillTrends(data); })
      .catch(e => console.log('Using local skill trends'));

    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setJobs(data); })
      .catch(e => console.log('Using local jobs'));
  }, []);

  // Synchronized Passport and Student Skill Endorsements
  const handleUpdatePassport = (updater: React.SetStateAction<SkillPassport>) => {
    setPassport(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const verifiedEndorsements = (next.endorsements || []).filter(e => e.status === 'VERIFIED');
      setStudent(prevStudent => ({
        ...prevStudent,
        skills: prevStudent.skills.map(s => {
          const matching = verifiedEndorsements.filter(
            e => e.skillName.toLowerCase().includes(s.skillName.toLowerCase()) ||
                 s.skillName.toLowerCase().includes(e.skillName.toLowerCase())
          );
          return {
            ...s,
            peerVerified: matching.length > 0,
            peerEndorsementCount: matching.length,
            peerEndorsers: matching.map(m => m.endorserName)
          };
        }),
        peerVerifiedCount: verifiedEndorsements.length
      }));
      return next;
    });
  };

  // Handle Evidence Submission
  const handleAddEvidence = (evData: any) => {
    fetch('/api/students/std-arun-01/evidence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evData)
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.student) {
          setStudent(data.student);
        }
      })
      .catch(() => {
        // Local state update fallback
        setStudent(prev => {
          const updated = JSON.parse(JSON.stringify(prev));
          let s = updated.skills.find((x: any) => x.skillName.toLowerCase() === evData.skillName.toLowerCase());
          if (s) {
            s.proficiencyScore = Math.min(95, s.proficiencyScore + 35);
            s.proficiencyLevel = 'Advanced';
            s.evidenceCount += 1;
          } else {
            updated.skills.push({
              skillId: `sk-${evData.skillName.toLowerCase()}`,
              skillName: evData.skillName,
              category: 'Backend & APIs',
              proficiencyScore: 82,
              proficiencyLevel: 'Advanced',
              confidenceScore: 85,
              evidenceCount: 1,
              evidenceItems: [],
              verificationStatus: 'Verified',
              marketDemandScore: 84,
              growthRate: 26.2,
              trend: 'BOOMING',
              lastUpdated: '2026-02-28'
            });
          }
          updated.careerReadinessScore.overall = Math.min(95, updated.careerReadinessScore.overall + 8);
          return updated;
        });
      });

    setShowEvidenceModal(false);
  };

  // Handle Aadhaar Sandbox Verification
  const handleAadhaarVerify = (rawNumber: string) => {
    fetch('/api/students/std-arun-01/aadhaar-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaarNumber: rawNumber })
    })
      .then(res => res.json())
      .then(data => {
        if (data.verification) {
          setStudent(prev => ({ ...prev, identityVerification: data.verification }));
        }
      })
      .catch(() => {
        const last4 = rawNumber.slice(-4) || '8921';
        setStudent(prev => ({
          ...prev,
          identityVerification: {
            verified: true,
            status: 'DEMO_VERIFIED',
            maskedNumber: `XXXX-XXXX-${last4}`,
            verificationToken: `SHA256:DEMO-TOKEN-${last4}`,
            verifiedAt: new Date().toISOString(),
            verificationSource: 'SkillSetu Demo Identity Provider (Sandbox Mode)',
            disclaimer: 'Demo Aadhaar verification'
          }
        }));
      });
  };

  const handleCreateJob = (jobData: any) => {
    fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.job) {
          setJobs(prev => [data.job, ...prev]);
        }
      })
      .catch(() => {
        const newJ: JobOpening = {
          id: `job-${Date.now()}`,
          companyId: 'comp-01',
          companyName: 'TechNova AI Labs',
          companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
          title: jobData.title,
          description: 'Enterprise AI & Microservices Engineering opening.',
          roleCategory: jobData.roleCategory,
          location: jobData.location,
          workMode: jobData.workMode,
          jobType: 'Full-time',
          experienceRequired: '0-2 years',
          packageRange: jobData.packageRange,
          openingsCount: jobData.openingsCount,
          applicationDeadline: '2026-05-30',
          requiredSkills: jobData.requiredSkills,
          preferredSkills: ['Docker', 'LangChain'],
          educationRequirement: 'B.Tech / MCA',
          created_at: '2026-02-28',
          applicationsCount: 0
        };
        setJobs(prev => [newJ, ...prev]);
      });
  };

  const [currentUser, setCurrentUser] = useState<User>(
    DEMO_USERS.find(u => u.role === activeRole) || DEMO_USERS[0]
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [logoutNotice, setLogoutNotice] = useState<string | null>(null);

  // Synchronize currentUser when activeRole changes externally
  useEffect(() => {
    if (currentUser.role !== activeRole) {
      const matched = DEMO_USERS.find(u => u.role === activeRole);
      if (matched) {
        setCurrentUser(matched);
      }
    }
  }, [activeRole]);

  // Handle user logout: terminates authenticated session and switches view to login
  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('login');
    setLogoutNotice(`You have been logged out safely from ${currentUser.name}'s session.`);
    setTimeout(() => {
      setLogoutNotice(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#081d19] text-slate-800 antialiased font-sans p-2 sm:p-3.5 lg:p-5 xl:p-6 gap-2 sm:gap-3 lg:gap-3.5 overflow-x-hidden">
      
      {/* Top Application Header & Hidden Animated Navigation System */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        language={language}
        setLanguage={setLanguage}
        notifications={notifications}
        currentUser={currentUser}
        onOpenChat={() => setShowChatDrawer(true)}
        student={student}
        jobs={jobs}
        onSelectJob={(jobId) => {
          setSelectedJobId(jobId);
          setActiveTab('jobs');
        }}
        onSimulateSkill={(s) => {
          setSimulatorInitialSkill(s);
          setActiveTab('job-simulator');
        }}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Main Content Area (Soft Off-White / Light Gray Large Rounded Container Layout) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f4f7f6] rounded-[20px] sm:rounded-[26px] xl:rounded-[30px] shadow-2xl shadow-black/40 border border-emerald-900/20 overflow-hidden min-h-[calc(100vh-5.5rem)]">
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 xl:px-10 pt-5 sm:pt-6 pb-24 scroll-smooth">
          <div className="w-full max-w-[1600px] 2xl:max-w-[1720px] mx-auto">
        
        {/* Logout feedback notification banner */}
        {logoutNotice && (
          <div className="mb-5 p-4 bg-amber-50/90 border border-amber-300/80 rounded-2xl flex items-center justify-between gap-3 text-amber-950 text-xs shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-200/60 flex items-center justify-center text-amber-800 shrink-0">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-bold">{logoutNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setLogoutNotice(null)}
              className="text-amber-800 hover:text-amber-950 font-black px-2.5 py-1 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* RENDER DEDICATED ROLE-BASED VIEW OR RESTRICTED SHIELD */}
        {(() => {
          // 1. PUBLIC ROUTES
          if (activeTab === 'login') {
            return (
              <LoginPage
                initialRole={activeRole}
                currentUser={currentUser}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                onLoginSuccess={(loggedInUser, loggedInRole) => {
                  setCurrentUser(loggedInUser);
                  setActiveRole(loggedInRole);
                  setIsLoggedIn(true);
                  setLogoutNotice(null);
                  setActiveTab('dashboard');
                }}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            );
          }

          if (activeTab === 'landing') {
            return (
              <PlatformLandingView
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                onSelectRole={(role) => {
                  setActiveRole(role);
                  const matched = DEMO_USERS.find(u => u.role === role);
                  if (matched) setCurrentUser(matched);
                  setActiveTab('dashboard');
                }}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            );
          }

          if (activeTab === 'verify-public') {
            return (
              <PublicVerifyPassportView
                passport={passport}
                onBackToApp={() => setActiveTab('dashboard')}
              />
            );
          }

          // If not logged in and requesting internal screen, redirect to Login
          if (!isLoggedIn) {
            return (
              <LoginPage
                initialRole={activeRole}
                currentUser={currentUser}
                isLoggedIn={false}
                onLogout={handleLogout}
                onLoginSuccess={(loggedInUser, loggedInRole) => {
                  setCurrentUser(loggedInUser);
                  setActiveRole(loggedInRole);
                  setIsLoggedIn(true);
                  setLogoutNotice(null);
                  setActiveTab('dashboard');
                }}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            );
          }

          // 2. STUDENT ROLE EXPERIENCE
          if (activeRole === 'student') {
            const collegeTabs = [
              'student-analytics', 'skill-gap-analysis', 'placement-readiness',
              'department-analytics', 'industry-demand', 'student-cohorts',
              'training-insights', 'companies', 'placement-analytics', 'reports',
              'college-profile', 'college-analytics'
            ];
            const companyTabs = [
              'post-job', 'find-candidates', 'ai-matching', 'talent-pool',
              'verified-skills', 'applications', 'interview-pipeline',
              'hiring-analytics', 'industry-insights', 'company-profile'
            ];

            if (collegeTabs.includes(activeTab)) {
              return (
                <AccessRestrictedView
                  requiredRole="COLLEGE"
                  currentRole="student"
                  onReturnToDashboard={() => setActiveTab('dashboard')}
                  onLogout={handleLogout}
                />
              );
            }

            if (companyTabs.includes(activeTab)) {
              return (
                <AccessRestrictedView
                  requiredRole="COMPANY"
                  currentRole="student"
                  onReturnToDashboard={() => setActiveTab('dashboard')}
                  onLogout={handleLogout}
                />
              );
            }

            switch (activeTab) {
              case 'profile':
                return (
                  <StudentProfileView
                    student={student}
                    currentUser={currentUser}
                    onOpenPassport={() => setActiveTab('passport')}
                    onOpenEvidence={() => setShowEvidenceModal(true)}
                    onOpenAadhaar={() => setShowAadhaarModal(true)}
                    onUpdateProfile={(upd) => setStudent(prev => ({ ...prev, ...upd }))}
                  />
                );
              case 'skill-assessment':
                return (
                  <StudentSkillAssessmentView
                    student={student}
                    onSimulateSkillBoost={(s, delta) => handleSimulateSkillBoost(s, delta)}
                    onOpenSimulator={(s) => {
                      setSimulatorInitialSkill(s);
                      setActiveTab('job-simulator');
                    }}
                  />
                );
              case 'skill-demand':
              case 'skill-intelligence':
                return (
                  <StudentSkillDemandView
                    student={student}
                    skillTrends={skillTrends}
                    onOpenSimulator={(s) => {
                      setSimulatorInitialSkill(s);
                      setActiveTab('job-simulator');
                    }}
                    onOpenRoadmap={() => setActiveTab('career-roadmap')}
                  />
                );
              case 'career-roadmap':
                return (
                  <StudentCareerRoadmapView
                    student={student}
                    onOpenSimulator={(s) => {
                      setSimulatorInitialSkill(s);
                      setActiveTab('job-simulator');
                    }}
                    onOpenEvidence={() => setShowEvidenceModal(true)}
                  />
                );
              case 'job-simulator':
                return (
                  <JobSimulatorView
                    student={student}
                    initialSkill={simulatorInitialSkill}
                    onApplyUnlockedJob={() => setActiveTab('jobs')}
                    onAddEvidence={() => setShowEvidenceModal(true)}
                  />
                );
              case 'jobs':
                return (
                  <JobsView
                    jobs={jobs}
                    student={student}
                    selectedJobId={selectedJobId}
                    onSelectJob={setSelectedJobId}
                    onApplyJob={() => {}}
                    onOpenPassport={() => setActiveTab('passport')}
                    onSimulateSkill={(s) => {
                      setSimulatorInitialSkill(s);
                      setActiveTab('job-simulator');
                    }}
                  />
                );
              case 'company-matching':
                return (
                  <StudentCompanyMatchingView
                    student={student}
                    jobs={jobs}
                    onOpenJobs={() => setActiveTab('jobs')}
                    onOpenPassport={() => setActiveTab('passport')}
                  />
                );
              case 'passport':
                return (
                  <SkillPassportView
                    student={student}
                    passport={passport}
                    classmates={candidates
                      .filter(c => c.id !== student.id)
                      .map(c => ({
                        id: c.id,
                        name: c.name,
                        role: `Classmate • Final Year ${c.degree.split(' - ')[1] || c.degree}`,
                        degree: c.degree,
                        avatar: c.avatar,
                        college: c.collegeName
                      }))}
                    onOpenPublicVerify={() => setActiveTab('verify-public')}
                    onUpdatePassport={handleUpdatePassport}
                    onNavigateToDashboard={() => setActiveTab('dashboard')}
                  />
                );
              case 'evidence':
                return (
                  <StudentEvidenceView
                    student={student}
                    onOpenEvidenceModal={() => setShowEvidenceModal(true)}
                    onOpenAadhaarModal={() => setShowAadhaarModal(true)}
                  />
                );
              case 'certificates':
                return (
                  <StudentCertificatesView
                    student={student}
                    onOpenPassport={() => setActiveTab('passport')}
                  />
                );
              case 'badges':
                return (
                  <StudentBadgesView
                    student={student}
                    onOpenEvidenceModal={() => setShowEvidenceModal(true)}
                    onOpenJobSimulator={(s) => {
                      if (s) setSimulatorInitialSkill(s);
                      setActiveTab('job-simulator');
                    }}
                    onOpenPassport={() => setActiveTab('passport')}
                    onSimulateSkillBoost={handleSimulateSkillBoost}
                  />
                );
              case 'career-insights':
                return (
                  <StudentCareerInsightsView
                    student={student}
                    skillTrends={skillTrends}
                    onOpenSimulator={(s) => {
                      setSimulatorInitialSkill(s);
                      setActiveTab('job-simulator');
                    }}
                    onOpenRoadmap={() => setActiveTab('career-roadmap')}
                  />
                );
              case 'skill-gaps':
                return (
                  <SkillRecommendationsView
                    student={student}
                    gaps={studentGaps}
                    recommendation={aiRecommendation}
                    onNavigateToDashboard={() => setActiveTab('dashboard')}
                    onOpenJobSimulator={(s) => {
                      if (s) setSimulatorInitialSkill(s);
                      setActiveTab('job-simulator');
                    }}
                    onOpenEvidenceModal={(s) => {
                      if (s) setEvidenceModalSkill(s);
                      setShowEvidenceModal(true);
                    }}
                    onOpenChat={() => setShowChatDrawer(true)}
                  />
                );
              case 'skillsetu-ai':
                return (
                  <div className="max-w-4xl mx-auto">
                    <SkillSetuAIChat
                      student={student}
                      role="student"
                      language={language}
                      setLanguage={setLanguage}
                      onNavigateToSimulator={(s) => {
                        setSimulatorInitialSkill(s);
                        setActiveTab('job-simulator');
                      }}
                      onNavigateToPassport={() => setActiveTab('passport')}
                      onNavigateToTrends={() => setActiveTab('skill-demand')}
                      onOpenEvidenceModal={() => setShowEvidenceModal(true)}
                    />
                  </div>
                );
              case 'dashboard':
              default:
                return (
                  <StudentDashboard
                    student={student}
                    gaps={studentGaps}
                    recommendation={aiRecommendation}
                    jobs={jobs}
                    passport={passport}
                    onOpenJobSimulator={(s) => {
                      if (s) setSimulatorInitialSkill(s);
                      setActiveTab('job-simulator');
                    }}
                    onOpenPassport={() => setActiveTab('passport')}
                    onOpenEvidenceModal={(s) => {
                      if (s) setEvidenceModalSkill(s);
                      setShowEvidenceModal(true);
                    }}
                    onOpenAadhaarModal={() => setShowAadhaarModal(true)}
                    onOpenChat={() => setShowChatDrawer(true)}
                    onViewSkillIntelligence={() => setActiveTab('skill-demand')}
                    onViewJobMatches={() => setActiveTab('jobs')}
                    onNavigateToSkillGaps={() => setActiveTab('skill-gaps')}
                    onSimulateSkillBoost={handleSimulateSkillBoost}
                  />
                );
            }
          }

          // 3. COLLEGE ROLE EXPERIENCE
          if (activeRole === 'college') {
            const studentTabs = [
              'profile', 'skill-assessment', 'career-roadmap', 'job-simulator',
              'company-matching', 'evidence', 'certificates', 'badges',
              'career-insights', 'skill-gaps'
            ];
            const companyTabs = [
              'post-job', 'find-candidates', 'ai-matching', 'talent-pool',
              'verified-skills', 'applications', 'interview-pipeline',
              'hiring-analytics', 'industry-insights', 'company-profile'
            ];

            if (studentTabs.includes(activeTab)) {
              return (
                <AccessRestrictedView
                  requiredRole="STUDENT"
                  currentRole="college"
                  onReturnToDashboard={() => setActiveTab('dashboard')}
                  onLogout={handleLogout}
                />
              );
            }

            if (companyTabs.includes(activeTab)) {
              return (
                <AccessRestrictedView
                  requiredRole="COMPANY"
                  currentRole="college"
                  onReturnToDashboard={() => setActiveTab('dashboard')}
                  onLogout={handleLogout}
                />
              );
            }

            switch (activeTab) {
              case 'student-analytics':
                return <CollegeStudentAnalyticsView students={candidates} />;
              case 'skill-gap-analysis':
                return <CollegeSkillGapAnalysisView heatmap={heatmap} />;
              case 'placement-readiness':
                return <CollegePlacementReadinessView students={candidates} />;
              case 'department-analytics':
                return <CollegeDepartmentAnalyticsView heatmap={heatmap} students={candidates} />;
              case 'industry-demand':
                return <CollegeIndustryDemandView />;
              case 'student-cohorts':
                return <CollegeStudentCohortsView students={candidates} />;
              case 'training-insights':
                return <CollegeTrainingInsightsView heatmap={heatmap} />;
              case 'companies':
                return <CollegeCompaniesView />;
              case 'placement-analytics':
                return <CollegePlacementAnalyticsView />;
              case 'reports':
                return <CollegeReportsView />;
              case 'college-profile':
                return <CollegeProfileView currentUser={currentUser} />;
              case 'dashboard':
              case 'college-analytics':
              default:
                return (
                  <CollegeDashboardView
                    stats={collegeStats}
                    heatmap={heatmap}
                    students={candidates}
                  />
                );
            }
          }

          // 4. COMPANY ROLE EXPERIENCE
          if (activeRole === 'company') {
            const studentTabs = [
              'profile', 'skill-assessment', 'career-roadmap', 'job-simulator',
              'company-matching', 'evidence', 'certificates', 'badges',
              'career-insights', 'skill-gaps'
            ];
            const collegeTabs = [
              'student-analytics', 'skill-gap-analysis', 'placement-readiness',
              'department-analytics', 'industry-demand', 'student-cohorts',
              'training-insights', 'companies', 'placement-analytics', 'reports',
              'college-profile', 'college-analytics'
            ];

            if (studentTabs.includes(activeTab)) {
              return (
                <AccessRestrictedView
                  requiredRole="STUDENT"
                  currentRole="company"
                  onReturnToDashboard={() => setActiveTab('dashboard')}
                  onLogout={handleLogout}
                />
              );
            }

            if (collegeTabs.includes(activeTab)) {
              return (
                <AccessRestrictedView
                  requiredRole="COLLEGE"
                  currentRole="company"
                  onReturnToDashboard={() => setActiveTab('dashboard')}
                  onLogout={handleLogout}
                />
              );
            }

            switch (activeTab) {
              case 'post-job':
                return (
                  <CompanyJobCreatePage
                    onJobCreated={(newJob) => {
                      handleCreateJob(newJob);
                      setActiveTab('dashboard');
                    }}
                    onCancel={() => setActiveTab('dashboard')}
                  />
                );
              case 'find-candidates':
                return (
                  <CompanyFindCandidatesView
                    candidates={candidates}
                    onOpenPassport={handleOpenCandidatePassport}
                  />
                );
              case 'ai-matching':
                return (
                  <CompanyAIMatchingView
                    jobs={jobs}
                    candidates={candidates}
                    onOpenPassport={handleOpenCandidatePassport}
                  />
                );
              case 'talent-pool':
                return (
                  <CompanyTalentPoolView
                    candidates={candidates}
                    onOpenPassport={handleOpenCandidatePassport}
                  />
                );
              case 'verified-skills':
                return (
                  <CompanyVerifiedSkillsView
                    candidates={candidates}
                    onOpenPassport={handleOpenCandidatePassport}
                  />
                );
              case 'applications':
                return (
                  <CompanyApplicationsView
                    jobs={jobs}
                    candidates={candidates}
                    onOpenPassport={handleOpenCandidatePassport}
                  />
                );
              case 'interview-pipeline':
                return (
                  <CompanyInterviewPipelineView
                    candidates={candidates}
                    onOpenPassport={handleOpenCandidatePassport}
                  />
                );
              case 'hiring-analytics':
                return <CompanyHiringAnalyticsView />;
              case 'industry-insights':
                return <CompanyIndustryInsightsView />;
              case 'company-profile':
                return <CompanyProfileView currentUser={currentUser} />;
              case 'passport': {
                const inspected = candidates.find(
                  c => c.id === inspectedCandidateId || c.passportId === inspectedCandidateId
                ) || STAR_STUDENT_ARUN;
                const inspectedPassport = (inspected.passportId && DEMO_PASSPORTS[inspected.passportId]) || passport;

                return (
                  <div className="space-y-4">
                    {/* Recruiter Banner to return to company view */}
                    <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm flex items-center gap-2 flex-wrap">
                            <span>Auditing Verified Skill Passport: <strong className="text-emerald-400">{inspected.name}</strong></span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                              100% Tamper-Proof DID
                            </span>
                          </div>
                          <div className="text-xs text-slate-400">
                            {inspected.collegeName} • {inspected.degree} • Passport ID: <span className="font-mono text-slate-300 font-bold">{inspected.passportId}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setActiveTab(companyPreviousTab || 'dashboard')}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          ← Return to Recruiter Portal
                        </button>
                      </div>
                    </div>

                    <SkillPassportView
                      student={inspected}
                      passport={inspectedPassport}
                      classmates={candidates.filter(c => c.id !== inspected.id).map(c => ({
                        id: c.id,
                        name: c.name,
                        role: `Peer Engineer • ${c.degree.split(' - ')[1] || c.degree}`,
                        degree: c.degree,
                        avatar: c.avatar,
                        college: c.collegeName
                      }))}
                      onOpenPublicVerify={() => {}}
                      onNavigateToDashboard={() => setActiveTab(companyPreviousTab || 'dashboard')}
                    />
                  </div>
                );
              }
              case 'dashboard':
              case 'jobs':
              default:
                return (
                  <CompanyDashboardView
                    jobs={jobs}
                    candidates={candidates}
                    onOpenPassport={handleOpenCandidatePassport}
                    onPostNewJob={handleCreateJob}
                    onOpenFullJobEditor={() => setActiveTab('post-job')}
                  />
                );
            }
          }

          return null;
        })()}

          </div>
        </main>
      </div>

      {/* Modals & Regional Multilingual Chatbot */}
      {showEvidenceModal && (
        <EvidenceModal
          initialSkillName={evidenceModalSkill}
          onClose={() => setShowEvidenceModal(false)}
          onSubmit={handleAddEvidence}
        />
      )}

      {showAadhaarModal && (
        <AadhaarVerifyModal
          currentMasked={student.identityVerification.maskedNumber}
          onClose={() => setShowAadhaarModal(false)}
          onVerifySuccess={handleAadhaarVerify}
        />
      )}

      <RegionalChatbotDrawer
        isOpen={showChatDrawer}
        onClose={() => setShowChatDrawer(false)}
        language={language}
        setLanguage={setLanguage}
        student={student}
        role={activeRole}
        onNavigateToSimulator={(s) => {
          setSimulatorInitialSkill(s);
          setActiveTab('job-simulator');
          setShowChatDrawer(false);
        }}
        onNavigateToPassport={() => {
          setActiveTab('passport');
          setShowChatDrawer(false);
        }}
        onNavigateToTrends={() => {
          setActiveTab('skill-intelligence');
          setShowChatDrawer(false);
        }}
        onOpenEvidenceModal={() => {
          setShowEvidenceModal(true);
          setShowChatDrawer(false);
        }}
      />

    </div>
  );
}
