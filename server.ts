import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import QRCode from 'qrcode';
import {
  DEMO_USERS,
  DEMO_USER_ACCOUNTS,
  DEMO_COLLEGE_PROFILE,
  DEMO_COMPANY_PROFILE,
  STAR_STUDENT_ARUN,
  OTHER_STUDENTS_POOL,
  SKILL_TRENDS_DATA,
  DEMO_JOBS,
  DEMO_PASSPORTS,
  DEMO_COLLEGE_STATS,
  DEMO_HEATMAP_DATA,
  DEMO_NOTIFICATIONS
} from './src/data/seedData';
import {
  predictSkillDemandTrend,
  calculateStudentSkillGaps,
  generateNextBestSkillRecommendation,
  simulateSkillMasteryImpact,
  rankCandidatesForJob,
  calculateSkillProficiency
} from './src/services/mlEngine';
import { evaluateStudentBadges, calculateBadgeStats } from './src/services/badgeService';
import { AadhaarVerificationService } from './src/services/aadhaarService';
import { ChatbotService } from './src/services/chatService';
import { GeminiService } from './src/services/geminiService';
import {
  JobOpening,
  StudentProfile,
  SkillEvidence,
  UserAccount,
  CollegeProfile,
  CompanyProfile,
  CandidateMatch
} from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // In-memory relational & entity store initialized with seed data
  let userAccountsStore: UserAccount[] = JSON.parse(JSON.stringify(DEMO_USER_ACCOUNTS));
  let collegeProfileStore: CollegeProfile = JSON.parse(JSON.stringify(DEMO_COLLEGE_PROFILE));
  let companyProfileStore: CompanyProfile = JSON.parse(JSON.stringify(DEMO_COMPANY_PROFILE));
  let shortlistedCandidatesStore: Set<string> = new Set(['std-rohit-02']);

  let studentStore: Record<string, StudentProfile> = {
    [STAR_STUDENT_ARUN.id]: JSON.parse(JSON.stringify(STAR_STUDENT_ARUN))
  };
  OTHER_STUDENTS_POOL.forEach(st => {
    studentStore[st.id] = JSON.parse(JSON.stringify(st));
  });

  let jobStore: JobOpening[] = JSON.parse(JSON.stringify(DEMO_JOBS));
  let applicationsStore: {
    id: string;
    jobId: string;
    jobTitle: string;
    companyName: string;
    studentId: string;
    studentName: string;
    status: string;
    appliedAt: string;
  }[] = [
    {
      id: 'app-01',
      jobId: 'job-technova-01',
      jobTitle: 'AI Solutions Engineer',
      companyName: 'TechNova AI Labs',
      studentId: 'std-arun-01',
      studentName: 'Arun Kumar',
      status: 'Applied',
      appliedAt: '2026-02-15T10:00:00Z'
    },
    {
      id: 'app-02',
      jobId: 'job-technova-01',
      jobTitle: 'AI Solutions Engineer',
      companyName: 'TechNova AI Labs',
      studentId: 'std-rohit-02',
      studentName: 'Rohit Verma',
      status: 'Shortlisted',
      appliedAt: '2026-02-18T11:30:00Z'
    }
  ];

  // Helper to ensure QR code data URL exists on passports
  for (const pid of Object.keys(DEMO_PASSPORTS)) {
    try {
      const baseUrl = process.env.APP_URL || '';
      const publicUrl = baseUrl ? `${baseUrl}/verify/passport/${pid}` : `/verify/passport/${pid}`;
      DEMO_PASSPORTS[pid].qrCodeDataUrl = await QRCode.toDataURL(publicUrl, {
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' }
      });
    } catch (e) {
      console.warn('QR generation error for passport', pid, e);
    }
  }

  // ==========================================
  // RBAC AUTHENTICATION & AUTHORIZATION HELPERS
  // ==========================================
  function extractUserFromRequest(req: Request): UserAccount | null {
    const authHeader = req.headers.authorization;
    const roleHeader = (req.headers['x-user-role'] as string || '').toUpperCase();
    const emailHeader = (req.headers['x-user-email'] as string || '').toLowerCase();

    if (emailHeader) {
      const match = userAccountsStore.find(u => u.email.toLowerCase() === emailHeader);
      if (match) return match;
    }

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      if (token.includes('STUDENT') || token.includes('student')) {
        return userAccountsStore.find(u => u.role === 'STUDENT') || userAccountsStore[0];
      }
      if (token.includes('COLLEGE') || token.includes('college')) {
        return userAccountsStore.find(u => u.role === 'COLLEGE') || userAccountsStore[1];
      }
      if (token.includes('COMPANY') || token.includes('company')) {
        return userAccountsStore.find(u => u.role === 'COMPANY') || userAccountsStore[2];
      }
      const match = userAccountsStore.find(u => token.includes(u.id));
      if (match) return match;
    }

    if (roleHeader) {
      return userAccountsStore.find(u => u.role === roleHeader) || null;
    }

    return null;
  }

  function requireRole(allowedRoles: ('STUDENT' | 'COLLEGE' | 'COMPANY')[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = extractUserFromRequest(req);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication Required',
          message: 'Please sign in to access this portal resource.'
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          error: 'Access Restricted',
          userRole: user.role,
          requiredRoles: allowedRoles,
          message: `Access denied. Your ${user.role} account cannot access ${allowedRoles.join(' or ')} resources.`
        });
      }

      (req as any).user = user;
      next();
    };
  }

  // ==========================================
  // REST API ENDPOINTS
  // ==========================================

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'SkillSetu Academia-Industry Platform API',
      version: '2.0.0-SIH2026',
      architecture: '3-Role Ecosystem (STUDENT, COLLEGE, COMPANY) with RBAC',
      activeUsers: userAccountsStore.length,
      timestamp: new Date().toISOString()
    });
  });

  // Unified Registration Endpoint
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { email, password, role, name, institutionName, companyName, department, degree } = req.body;

    if (!email || !role) {
      return res.status(400).json({ success: false, error: 'Email and portal role are required.' });
    }

    const roleUpper = (role.toUpperCase() as 'STUDENT' | 'COLLEGE' | 'COMPANY');
    if (!['STUDENT', 'COLLEGE', 'COMPANY'].includes(roleUpper)) {
      return res.status(400).json({ success: false, error: 'Invalid role. Must be STUDENT, COLLEGE, or COMPANY.' });
    }

    const existing = userAccountsStore.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
    }

    const newUserId = `acc-${roleUpper.toLowerCase()}-${Date.now()}`;
    const newUser: UserAccount = {
      id: newUserId,
      email: email.toLowerCase(),
      password_hash: password || 'demo123',
      role: roleUpper,
      status: 'ACTIVE',
      name: name || (roleUpper === 'STUDENT' ? 'New Student' : roleUpper === 'COLLEGE' ? 'College Admin' : 'Hiring Manager'),
      created_at: new Date().toISOString()
    };

    userAccountsStore.push(newUser);

    let redirectUrl = '/student/dashboard';
    if (roleUpper === 'COLLEGE') {
      redirectUrl = '/college/dashboard';
      if (institutionName) {
        collegeProfileStore.institutionName = institutionName;
      }
    } else if (roleUpper === 'COMPANY') {
      redirectUrl = '/company/dashboard';
      if (companyName) {
        companyProfileStore.companyName = companyName;
      }
    }

    res.json({
      success: true,
      token: `JWT-DEMO-${newUser.id}-${Date.now()}`,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role.toLowerCase()
      },
      role: newUser.role,
      redirectUrl
    });
  });

  // Unified Login Endpoint with Role Redirection
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    // Check against persistent user store
    let user = userAccountsStore.find(u => u.email.toLowerCase() === cleanEmail);

    // Support flexible demo logins
    if (!user) {
      if (cleanEmail.includes('student') || role === 'student' || role === 'STUDENT') {
        user = userAccountsStore.find(u => u.role === 'STUDENT') || userAccountsStore[0];
      } else if (cleanEmail.includes('college') || role === 'college' || role === 'COLLEGE') {
        user = userAccountsStore.find(u => u.role === 'COLLEGE') || userAccountsStore[1];
      } else if (cleanEmail.includes('company') || role === 'company' || role === 'COMPANY') {
        user = userAccountsStore.find(u => u.role === 'COMPANY') || userAccountsStore[2];
      }
    }

    if (!user) {
      const defaultRole = (role ? role.toUpperCase() : 'STUDENT') as 'STUDENT' | 'COLLEGE' | 'COMPANY';
      user = {
        id: `acc-${defaultRole.toLowerCase()}-${Date.now()}`,
        email: cleanEmail || `${defaultRole.toLowerCase()}@skillsetu.demo`,
        name: cleanEmail.split('@')[0] || `${defaultRole} User`,
        password_hash: password || 'demo123',
        role: defaultRole,
        status: 'ACTIVE',
        created_at: new Date().toISOString()
      };
      userAccountsStore.push(user);
    }

    const redirectMap = {
      STUDENT: '/student/dashboard',
      COLLEGE: '/college/dashboard',
      COMPANY: '/company/dashboard'
    };

    res.json({
      success: true,
      token: `JWT-DEMO-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.toLowerCase()
      },
      role: user.role,
      redirectUrl: redirectMap[user.role]
    });
  });

  // Current User Profile Context
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = extractUserFromRequest(req) || userAccountsStore[0];
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.toLowerCase()
      },
      role: user.role
    });
  });

  // ==========================================
  // 1. STUDENT PROTECTED API ENDPOINTS (/api/student/*)
  // ==========================================
  app.get('/api/student/insights', requireRole(['STUDENT']), (req: Request, res: Response) => {
    const student = studentStore['std-arun-01'];
    const gaps = calculateStudentSkillGaps(student);
    const recommendation = generateNextBestSkillRecommendation(student, gaps);
    const matchingJobs = jobStore.filter(j => {
      const match = rankCandidatesForJob(j, [student])[0];
      return match && match.matchScore >= 70;
    });

    res.json({
      role: 'STUDENT',
      careerReadiness: `${student.careerReadinessScore.overall}/100`,
      careerReadinessScore: student.careerReadinessScore.overall,
      biggestSkillGap: gaps[0]?.skillName || 'Cloud Deployment',
      recommendedNextSkill: recommendation.recommendedSkill,
      matchedCompaniesCount: matchingJobs.length,
      headline: `Your Career Readiness: ${student.careerReadinessScore.overall}/100 • Your biggest skill gap: ${gaps[0]?.skillName || 'Cloud Deployment'} • Recommended next skill: ${recommendation.recommendedSkill} • ${matchingJobs.length} companies currently match your profile`,
      gaps: gaps.slice(0, 4),
      recommendation,
      salaryImpact: '+₹2.5 – ₹3.5 LPA upon verifying Docker & Cloud deployment'
    });
  });

  app.get('/api/student/profile', requireRole(['STUDENT']), (req: Request, res: Response) => {
    const student = studentStore['std-arun-01'];
    res.json(student);
  });

  app.put('/api/student/profile', requireRole(['STUDENT']), (req: Request, res: Response) => {
    const student = studentStore['std-arun-01'];
    if (req.body.name) student.name = req.body.name;
    if (req.body.targetRole) student.targetRole = req.body.targetRole;
    if (req.body.degree) student.degree = req.body.degree;
    if (req.body.department) student.department = req.body.department;
    if (req.body.cgpa) student.cgpa = Number(req.body.cgpa);
    res.json({ success: true, profile: student });
  });

  app.get('/api/student/dashboard', requireRole(['STUDENT']), (req: Request, res: Response) => {
    const student = studentStore['std-arun-01'];
    const gaps = calculateStudentSkillGaps(student);
    const recommendation = generateNextBestSkillRecommendation(student, gaps);
    const verifiedSkillsCount = student.skills.filter(s => s.verificationStatus === 'Verified').length;
    const avgProficiency = Math.round(
      student.skills.reduce((acc, s) => acc + s.proficiencyScore, 0) / (student.skills.length || 1)
    );
    const matchingJobs = jobStore.filter(j => {
      const match = rankCandidatesForJob(j, [student])[0];
      return match && match.matchScore >= 70;
    });

    res.json({
      studentName: student.name,
      careerReadinessScore: student.careerReadinessScore.overall,
      verifiedSkills: `${verifiedSkillsCount}/${student.skills.length}`,
      skillProficiency: `${avgProficiency}%`,
      matchingJobsCount: matchingJobs.length,
      applicationsCount: applicationsStore.filter(a => a.studentId === student.id).length,
      certificationsCount: student.certifications.length,
      projectsCount: student.projects.length,
      skillGapsCount: gaps.filter(g => g.priority === 'HIGH').length,
      strongestSkills: [...student.skills].sort((a, b) => b.proficiencyScore - a.proficiencyScore).slice(0, 4),
      criticalSkillGaps: gaps.slice(0, 3),
      recommendation,
      recentJobs: matchingJobs.slice(0, 3),
      passportId: student.passportId || 'PASS-2026-ARUN-8921'
    });
  });

  app.get('/api/student/skills', requireRole(['STUDENT']), (req: Request, res: Response) => {
    const student = studentStore['std-arun-01'];
    res.json(student.skills);
  });

  app.get('/api/student/badges', (req: Request, res: Response) => {
    const student = studentStore['std-arun-01'];
    const badges = evaluateStudentBadges(student);
    const stats = calculateBadgeStats(badges);
    res.json({ badges, stats });
  });

  app.get('/api/students/:id/badges', (req: Request, res: Response) => {
    const student = studentStore[req.params.id] || studentStore['std-arun-01'];
    const badges = evaluateStudentBadges(student);
    const stats = calculateBadgeStats(badges);
    res.json({ badges, stats });
  });

  app.post('/api/student/evidence', requireRole(['STUDENT']), (req: Request, res: Response) => {
    const student = studentStore['std-arun-01'];
    const evidenceData: SkillEvidence = {
      id: `ev-${Date.now()}`,
      skillId: req.body.skillId || 'sk-fastapi',
      skillName: req.body.skillName || 'FastAPI',
      type: req.body.type || 'PROJECT',
      title: req.body.title || 'Asynchronous AI Microservice Project',
      description: req.body.description || 'High-throughput async endpoints and model orchestration.',
      issuer: req.body.issuer || 'Institutional Verification Committee',
      date: req.body.date || new Date().toISOString().split('T')[0],
      url: req.body.url || 'https://github.com/demo-arun/fastapi-ai-service',
      skillsDemonstrated: [req.body.skillName || 'FastAPI'],
      verificationStatus: 'Verified',
      verificationSource: 'Academic Registrar & Code Review Protocol',
      scoreContribution: 88,
      created_at: new Date().toISOString()
    };

    if (evidenceData.type === 'CERTIFICATION') {
      student.certifications.unshift(evidenceData);
    } else {
      student.projects.unshift(evidenceData);
    }

    let existingSkill = student.skills.find(s => s.skillName.toLowerCase() === evidenceData.skillName.toLowerCase());
    if (existingSkill) {
      existingSkill.proficiencyScore = Math.min(96, existingSkill.proficiencyScore + 30);
      existingSkill.proficiencyLevel = existingSkill.proficiencyScore >= 85 ? 'Expert' : existingSkill.proficiencyScore >= 70 ? 'Advanced' : 'Intermediate';
      existingSkill.confidenceScore = Math.min(98, existingSkill.confidenceScore + 20);
      existingSkill.evidenceCount += 1;
      existingSkill.verificationStatus = 'Verified';
    } else {
      student.skills.push({
        skillId: evidenceData.skillId,
        skillName: evidenceData.skillName,
        category: 'Backend & APIs',
        proficiencyScore: 82,
        proficiencyLevel: 'Advanced',
        confidenceScore: 85,
        evidenceCount: 1,
        evidenceItems: [evidenceData],
        verificationStatus: 'Verified',
        marketDemandScore: 84,
        growthRate: 26.2,
        trend: 'BOOMING',
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }

    student.careerReadinessScore.overall = Math.min(96, student.careerReadinessScore.overall + 6);
    res.json({ success: true, evidence: evidenceData, student });
  });

  app.post('/api/student/aadhaar-verify', requireRole(['STUDENT']), (req: Request, res: Response) => {
    try {
      const { aadhaarNumber } = req.body;
      const student = studentStore['std-arun-01'];
      const result = AadhaarVerificationService.verifyAadhaar(aadhaarNumber, student.name);
      student.identityVerification = result;
      res.json({ success: true, verification: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.get('/api/student/applications', requireRole(['STUDENT']), (req: Request, res: Response) => {
    const apps = applicationsStore.filter(a => a.studentId === 'std-arun-01');
    res.json(apps);
  });

  app.post('/api/student/applications', requireRole(['STUDENT']), (req: Request, res: Response) => {
    const { jobId } = req.body;
    const job = jobStore.find(j => j.id === jobId) || jobStore[0];
    const student = studentStore['std-arun-01'];

    const newApp = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      studentId: student.id,
      studentName: student.name,
      status: 'Applied',
      appliedAt: new Date().toISOString()
    };
    applicationsStore.unshift(newApp);
    job.applicationsCount++;

    res.json({ success: true, application: newApp });
  });

  app.get('/api/student/passport', requireRole(['STUDENT']), (req: Request, res: Response) => {
    const passport = DEMO_PASSPORTS['PASS-2026-ARUN-8921'];
    res.json(passport);
  });

  // ==========================================
  // 2. COLLEGE PROTECTED API ENDPOINTS (/api/college/*)
  // ==========================================
  app.get('/api/college/analytics', requireRole(['COLLEGE']), (req: Request, res: Response) => {
    res.json({
      role: 'COLLEGE',
      overallStudentReadiness: '74/100',
      placementReadinessIncrease: '+12% this semester',
      departmentalGaps: [
        { department: 'Computer Science (CSE)', gap: '28% Cloud & DevOps skill gap', priority: 'HIGH' },
        { department: 'AI & Data Science', gap: '18% Production ML Serving deficit', priority: 'MEDIUM' },
        { department: 'Information Tech', gap: '32% Distributed Systems deficit', priority: 'HIGH' }
      ],
      highestDemandSkills: ['Python', 'SQL', 'FastAPI', 'Machine Learning', 'Docker'],
      headline: 'CSE students have a 28% Cloud skill gap • Placement readiness increased 12% this semester • Python and SQL are currently the highest-demand skills',
      stats: DEMO_COLLEGE_STATS,
      heatmap: DEMO_HEATMAP_DATA
    });
  });

  app.get('/api/college/profile', requireRole(['COLLEGE']), (req: Request, res: Response) => {
    res.json(collegeProfileStore);
  });

  app.put('/api/college/profile', requireRole(['COLLEGE']), (req: Request, res: Response) => {
    if (req.body.institutionName) collegeProfileStore.institutionName = req.body.institutionName;
    if (req.body.contactPerson) collegeProfileStore.contactPerson = req.body.contactPerson;
    if (req.body.officialEmail) collegeProfileStore.officialEmail = req.body.officialEmail;
    if (req.body.phone) collegeProfileStore.phone = req.body.phone;
    if (req.body.nirfRank) collegeProfileStore.nirfRank = Number(req.body.nirfRank);
    res.json({ success: true, profile: collegeProfileStore });
  });

  app.get('/api/college/dashboard', requireRole(['COLLEGE']), (req: Request, res: Response) => {
    res.json({
      headerTitle: 'College Skill Intelligence Center',
      metrics: {
        totalStudents: 2480,
        verifiedStudents: 1894,
        jobReadyStudents: 1742,
        placementRate: '82%',
        averageSkillScore: '74/100',
        activeOpportunities: 38
      },
      stats: DEMO_COLLEGE_STATS,
      departmentsSummary: [
        { name: 'Computer Science', students: 780, jobReady: 654, avgScore: 82, placementRate: 89 },
        { name: 'AI & Data Science', students: 420, jobReady: 382, avgScore: 86, placementRate: 94 },
        { name: 'Information Tech', students: 540, jobReady: 412, avgScore: 78, placementRate: 85 },
        { name: 'Electronics (ECE)', students: 480, jobReady: 294, avgScore: 68, placementRate: 72 }
      ],
      boomingSkills: ['Python', 'FastAPI', 'Machine Learning', 'Docker', 'Kubernetes'],
      decliningSkills: ['PHP 7', 'jQuery', 'Vanilla SOAP APIs', 'Flash ActionScript']
    });
  });

  app.get('/api/college/students', requireRole(['COLLEGE']), (req: Request, res: Response) => {
    // Privacy-conscious aggregated / authorized student directory
    const list = Object.values(studentStore).map(st => ({
      id: st.id,
      name: st.name,
      degree: st.degree,
      department: st.department,
      graduationYear: st.graduationYear,
      cgpa: st.cgpa,
      careerReadiness: st.careerReadinessScore.overall,
      verifiedSkillsCount: st.skills.filter(s => s.verificationStatus === 'Verified').length,
      topSkills: st.skills.slice(0, 3).map(s => s.skillName),
      jobReady: st.careerReadinessScore.overall >= 75
    }));
    res.json(list);
  });

  app.get('/api/college/heatmap', requireRole(['COLLEGE']), (req: Request, res: Response) => {
    const { department, skill, proficiency } = req.query;
    let data = [...DEMO_HEATMAP_DATA];

    if (skill && typeof skill === 'string' && skill !== 'ALL') {
      data = data.filter(r => r.skill.toLowerCase().includes(skill.toLowerCase()));
    }

    if (department && typeof department === 'string' && department !== 'ALL') {
      data = data.map(r => ({
        ...r,
        departments: {
          [department]: r.departments[department] || r.overallAverage
        }
      }));
    }

    res.json(data);
  });

  app.get('/api/college/placement', requireRole(['COLLEGE']), (req: Request, res: Response) => {
    res.json({
      placementRate: 82,
      placedStudents: 1428,
      averagePackageLPA: 8.4,
      highestPackageLPA: 38.0,
      hiringPartnersCount: 42,
      topHiringPartners: [
        { name: 'TechNova AI Labs', offers: 18, avgLpa: '₹11.2 LPA' },
        { name: 'CloudScale Networks', offers: 24, avgLpa: '₹9.5 LPA' },
        { name: 'CyberShield Systems', offers: 14, avgLpa: '₹8.8 LPA' },
        { name: 'DataWeave Global', offers: 22, avgLpa: '₹10.4 LPA' }
      ]
    });
  });

  app.get('/api/college/reports', requireRole(['COLLEGE']), (req: Request, res: Response) => {
    res.json([
      {
        id: 'rep-01',
        title: 'Institutional NAAC Skill Accreditation Audit 2026',
        category: 'Accreditation',
        generatedAt: '2026-02-20',
        verifiedSkillsMapped: 1894,
        readinessIndex: '84.2%'
      },
      {
        id: 'rep-02',
        title: 'Curriculum Skill Gap vs Industry Demand Analysis',
        category: 'Industry Alignment',
        generatedAt: '2026-02-15',
        deficitsFlagged: 3,
        recommendations: 'Integrate Async Microservices & Container Orchestration into Sem 6'
      }
    ]);
  });

  // ==========================================
  // 3. COMPANY PROTECTED API ENDPOINTS (/api/company/*)
  // ==========================================
  app.get('/api/company/talent', requireRole(['COMPANY']), (req: Request, res: Response) => {
    const defaultJob = jobStore[0];
    const candidateList = Object.values(studentStore);
    const ranked = rankCandidatesForJob(defaultJob, candidateList);
    const verifiedPythonCount = candidateList.filter(s =>
      s.skills.some(sk => sk.skillName.toLowerCase() === 'python' && sk.verificationStatus === 'Verified')
    ).length;

    res.json({
      role: 'COMPANY',
      totalCandidatesMatching: candidateList.length,
      verifiedSkillsTalentCount: verifiedPythonCount,
      topCandidateMatchScore: `${ranked[0]?.matchScore || 94}%`,
      topCandidateName: ranked[0]?.studentName || 'Arun Kumar',
      headline: `${candidateList.length} candidates match your ${defaultJob.title} requirements • ${verifiedPythonCount} candidates have verified Python + ML skills • Top candidate match: ${ranked[0]?.matchScore || 94}%`,
      candidates: ranked,
      activeJobsCount: jobStore.length
    });
  });

  app.get('/api/company/profile', requireRole(['COMPANY']), (req: Request, res: Response) => {
    res.json(companyProfileStore);
  });

  app.put('/api/company/profile', requireRole(['COMPANY']), (req: Request, res: Response) => {
    if (req.body.companyName) companyProfileStore.companyName = req.body.companyName;
    if (req.body.talentAcquisitionHead) companyProfileStore.talentAcquisitionHead = req.body.talentAcquisitionHead;
    if (req.body.contactEmail) companyProfileStore.contactEmail = req.body.contactEmail;
    if (req.body.website) companyProfileStore.website = req.body.website;
    if (req.body.description) companyProfileStore.description = req.body.description;
    res.json({ success: true, profile: companyProfileStore });
  });

  app.get('/api/company/dashboard', requireRole(['COMPANY']), (req: Request, res: Response) => {
    res.json({
      headerTitle: 'Talent Intelligence Center',
      metrics: {
        activeJobs: jobStore.length,
        totalApplicants: 486,
        shortlisted: shortlistedCandidatesStore.size + 73,
        interviews: 18,
        averageCandidateMatch: '87%'
      },
      pipeline: {
        applied: 486,
        screened: 240,
        shortlisted: 74,
        interviewing: 18,
        offered: 6
      },
      jobs: jobStore.slice(0, 4)
    });
  });

  app.get('/api/company/jobs', requireRole(['COMPANY']), (req: Request, res: Response) => {
    res.json(jobStore);
  });

  app.post('/api/company/jobs', requireRole(['COMPANY']), (req: Request, res: Response) => {
    const {
      title,
      description,
      roleCategory,
      location,
      workMode,
      jobType,
      experienceRequired,
      educationRequirement,
      packageRange,
      openingsCount,
      applicationDeadline,
      requiredSkills,
      preferredSkills
    } = req.body;

    const newJob: JobOpening = {
      id: `job-${Date.now()}`,
      companyId: companyProfileStore.id,
      companyName: companyProfileStore.companyName,
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
      title: title || 'AI Solutions Engineer',
      description: description || 'Build production-grade systems and backend services.',
      roleCategory: roleCategory || 'AI & Data Science',
      location: location || 'Bengaluru / Hybrid',
      workMode: workMode || 'Hybrid',
      jobType: jobType || 'Full-time',
      experienceRequired: experienceRequired || '0-2 years (Freshers eligible)',
      educationRequirement: educationRequirement || 'B.Tech / B.E. / MCA',
      packageRange: packageRange || '₹8 - ₹12 LPA',
      openingsCount: Number(openingsCount) || 3,
      applicationDeadline: applicationDeadline || '2026-06-30',
      requiredSkills: requiredSkills || [
        { skillId: 'sk-python', skillName: 'Python', minProficiency: 75, minLevel: 'Advanced' },
        { skillId: 'sk-fastapi', skillName: 'FastAPI', minProficiency: 65, minLevel: 'Intermediate' }
      ],
      preferredSkills: preferredSkills || ['Docker', 'Cloud'],
      created_at: new Date().toISOString().split('T')[0],
      applicationsCount: 0
    };

    jobStore.unshift(newJob);
    companyProfileStore.totalJobsPosted++;
    res.json({ success: true, job: newJob });
  });

  app.get('/api/company/candidates', requireRole(['COMPANY']), (req: Request, res: Response) => {
    const { jobId } = req.query;
    const job = jobStore.find(j => j.id === jobId) || jobStore[0];
    const candidateList = Object.values(studentStore);
    const rankedMatches = rankCandidatesForJob(job, candidateList);
    res.json({
      jobId: job.id,
      jobTitle: job.title,
      matches: rankedMatches
    });
  });

  app.post('/api/company/talent-search', requireRole(['COMPANY']), (req: Request, res: Response) => {
    const { query, skills, minProficiency, education, graduationYear, location, jobReadinessMin } = req.body;
    let list = Object.values(studentStore);

    if (query && typeof query === 'string') {
      const q = query.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.skills.some(sk => sk.skillName.toLowerCase().includes(q))
      );
    }

    if (skills && Array.isArray(skills) && skills.length > 0) {
      list = list.filter(s =>
        skills.some(reqSkill =>
          s.skills.some(sk => sk.skillName.toLowerCase() === reqSkill.toLowerCase())
        )
      );
    }

    if (jobReadinessMin) {
      list = list.filter(s => s.careerReadinessScore.overall >= Number(jobReadinessMin));
    }

    const defaultJob = jobStore[0];
    const ranked = rankCandidatesForJob(defaultJob, list);
    res.json(ranked);
  });

  app.get('/api/company/shortlisted', requireRole(['COMPANY']), (req: Request, res: Response) => {
    const list = Object.values(studentStore).filter(s => shortlistedCandidatesStore.has(s.id));
    res.json(list);
  });

  app.post('/api/company/shortlist', requireRole(['COMPANY']), (req: Request, res: Response) => {
    const { studentId, action } = req.body;
    if (action === 'remove') {
      shortlistedCandidatesStore.delete(studentId);
    } else {
      shortlistedCandidatesStore.add(studentId);
    }
    res.json({ success: true, shortlisted: Array.from(shortlistedCandidatesStore) });
  });

  app.get('/api/company/applications', requireRole(['COMPANY']), (req: Request, res: Response) => {
    res.json(applicationsStore);
  });

  app.post('/api/company/applications/:id/status', requireRole(['COMPANY']), (req: Request, res: Response) => {
    const appItem = applicationsStore.find(a => a.id === req.params.id);
    if (appItem) {
      appItem.status = req.body.status || 'Shortlisted';
    }
    res.json({ success: true, application: appItem });
  });

  // ==========================================
  // GENERAL & COMPATIBILITY ENDPOINTS (Preserved)
  // ==========================================
  app.get('/api/students/:id', (req: Request, res: Response) => {
    const student = studentStore[req.params.id] || studentStore['std-arun-01'];
    res.json(student);
  });

  app.get('/api/students', (req: Request, res: Response) => {
    res.json(Object.values(studentStore));
  });

  app.get('/api/skill-trends', (req: Request, res: Response) => {
    const enriched = SKILL_TRENDS_DATA.map(st => {
      const ml = predictSkillDemandTrend(st.historicalData);
      return {
        ...st,
        predictedNextDemand: ml.predictedDemand,
        growthRate: ml.growthRate,
        trendClassification: ml.classification,
        confidence: ml.confidence
      };
    });
    res.json(enriched);
  });

  app.post('/api/job-simulator', (req: Request, res: Response) => {
    const { studentId, skillName, targetRole } = req.body;
    const student = studentStore[studentId] || studentStore['std-arun-01'];
    const simulation = simulateSkillMasteryImpact(student, skillName || 'FastAPI', targetRole || student.targetRole);
    res.json(simulation);
  });

  app.get('/api/jobs', (req: Request, res: Response) => {
    const student = studentStore['std-arun-01'];
    const list = jobStore.map(job => {
      const matches = rankCandidatesForJob(job, [student]);
      return {
        ...job,
        studentMatchScore: matches[0]?.matchScore || 70
      };
    });
    res.json(list);
  });

  app.get('/api/passports/:id', async (req: Request, res: Response) => {
    const pid = req.params.id;
    const passport = DEMO_PASSPORTS[pid] || DEMO_PASSPORTS['PASS-2026-ARUN-8921'];
    if (!passport) return res.status(404).json({ error: 'Passport not found' });
    res.json(passport);
  });

  app.get('/api/verify/passport/:id', async (req: Request, res: Response) => {
    const pid = req.params.id;
    const passport = DEMO_PASSPORTS[pid] || DEMO_PASSPORTS['PASS-2026-ARUN-8921'];
    res.json({
      verificationStatus: 'VALID_AND_AUTHENTIC',
      verifiedBy: 'SkillSetu National Skill Verification Protocol (SIH 2026)',
      passport
    });
  });

  app.get('/api/colleges/analytics', (req: Request, res: Response) => {
    res.json({
      stats: DEMO_COLLEGE_STATS,
      heatmap: DEMO_HEATMAP_DATA
    });
  });

  // Dedicated Controlled Gemini AI API Endpoint
  app.post('/api/gemini/chat', async (req: Request, res: Response) => {
    try {
      const { message, history, language, studentId, role, forcedMode } = req.body;
      const student = studentStore[studentId || 'std-arun-01'];

      const result = await GeminiService.generateResponse({
        message: message || '',
        history: history || [],
        language: language || 'en',
        student,
        college: DEMO_COLLEGE_STATS,
        job: jobStore[0],
        skillTrends: SKILL_TRENDS_DATA,
        role: role || 'student',
        forcedMode
      });

      res.json({
        success: true,
        ...result,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Error in /api/gemini/chat:', err);
      res.status(500).json({
        success: false,
        reply: "SkillSetu AI is temporarily unavailable. You can continue using skill analysis and verified records.",
        intent: 'CAREER_GUIDANCE',
        mode: 'JOB_INSIGHTS',
        isOutOfScope: false,
        isFallback: true
      });
    }
  });

  app.post('/api/chat', async (req: Request, res: Response) => {
    const { message, history, language, studentId, role, forcedMode } = req.body;
    const student = studentStore[studentId || 'std-arun-01'];

    const geminiResult = await GeminiService.generateResponse({
      message: message || '',
      history: history || [],
      language: language || 'en',
      student,
      college: DEMO_COLLEGE_STATS,
      job: jobStore[0],
      skillTrends: SKILL_TRENDS_DATA,
      role: role || 'student',
      forcedMode
    });

    res.json({
      response: geminiResult.reply,
      intent: geminiResult.intent,
      mode: geminiResult.mode,
      isOutOfScope: geminiResult.isOutOfScope,
      isFallback: geminiResult.isFallback,
      suggestedPrompts: geminiResult.suggestedPrompts,
      referencedData: geminiResult.referencedData,
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/notifications', (req: Request, res: Response) => {
    res.json(DEMO_NOTIFICATIONS);
  });


  // ==========================================
  // Vite Middleware / Static Asset Serving
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🚀 SkillSetu Full-Stack Server Running on Port ${PORT}`);
    console.log(`🌐 Problem Statement 26044 — Smart India Hackathon 2026`);
    console.log(`⚡ Student ↔ College ↔ Industry Verified Skill Bridge`);
    console.log(`====================================================`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
