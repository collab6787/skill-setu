export type UserRole = 'student' | 'college' | 'company' | 'admin';

export type LanguageCode = 'en' | 'ta' | 'hi';

export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected' | 'Demo Verified';

export type SkillProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type TrendClassification = 'BOOMING' | 'GROWING' | 'STABLE' | 'DECLINING' | 'LOW_DEMAND';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  preferred_language: LanguageCode;
  created_at: string;
}

export interface AadhaarVerificationResult {
  verified: boolean;
  status: 'DEMO_VERIFIED' | 'OFFICIAL_VERIFIED' | 'UNVERIFIED';
  maskedNumber: string; // e.g. "XXXX-XXXX-8921"
  verificationToken: string;
  verifiedAt: string;
  verificationSource: string;
  disclaimer: string;
}

export interface SkillEvidence {
  id: string;
  skillId: string;
  skillName: string;
  type: 'CERTIFICATION' | 'PROJECT' | 'INTERNSHIP' | 'ASSESSMENT' | 'INSTITUTION_EVIDENCE' | 'SELF_DECLARATION';
  title: string;
  description: string;
  issuer?: string;
  date: string;
  url?: string;
  documentName?: string;
  skillsDemonstrated: string[];
  verificationStatus: VerificationStatus;
  verificationSource: string;
  scoreContribution: number; // 0 to 100
  created_at: string;
}

export interface StudentSkill {
  skillId: string;
  skillName: string;
  category: string;
  proficiencyScore: number; // 0-100
  proficiencyLevel: SkillProficiencyLevel;
  confidenceScore: number; // 0-100
  evidenceCount: number;
  evidenceItems: SkillEvidence[];
  verificationStatus: VerificationStatus;
  peerVerified?: boolean;
  peerEndorsementCount?: number;
  peerEndorsers?: string[];
  marketDemandScore: number; // 0-100
  growthRate: number; // e.g. +14%
  trend: TrendClassification;
  lastUpdated: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  collegeId: string;
  collegeName: string;
  degree: string;
  department: string;
  graduationYear: number;
  cgpa: number;
  targetRole: string;
  identityVerification: AadhaarVerificationResult;
  peerVerifiedCount?: number;
  careerReadinessScore: {
    overall: number; // 0-100
    skillStrength: number;
    evidenceStrength: number;
    industryAlignment: number;
    jobReadiness: number;
    breakdownExplanation: string;
  };
  skills: StudentSkill[];
  certifications: SkillEvidence[];
  projects: SkillEvidence[];
  passportId?: string;
  createdAt: string;
}

export interface SkillDemandPoint {
  year: number;
  demandScore: number; // 0-100
  isPredicted?: boolean;
}

export interface SkillTrend {
  skillId: string;
  skillName: string;
  category: string;
  historicalData: SkillDemandPoint[];
  predictedNextDemand: number;
  growthRate: number; // percentage
  trendClassification: TrendClassification;
  confidence: number;
  jobCount: number;
  topRoles: string[];
  averageProficiency: number;
  description: string;
  dependencies: string[];
  unlocks: string[];
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  category: string;
  currentProficiency: number;
  currentLevel: string;
  requiredProficiency: number;
  requiredLevel: string;
  gapScore: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  marketDemand: number;
  growthRate: number;
  trend: TrendClassification;
  recommendationReason: string;
}

export interface AIRecommendation {
  recommendedSkill: string;
  skillId: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  headline: string;
  reasons: string[];
  estimatedTimeToLearn: string; // e.g. "3-4 weeks"
  unlockedRoles: string[];
  unlockedProjects: string[];
  projectedOpportunityImpact: string; // e.g. "+₹2.5 - ₹3.5 LPA"
}

export interface JobSimulatorResult {
  targetRole: string;
  selectedSkill: string;
  currentProfile: {
    jobMatchPercentage: number;
    careerReadiness: number;
    eligibleJobCount: number;
    skillGapCount: number;
    opportunityRangeLPA: string; // e.g. "₹4.5 – ₹6.5 LPA"
    accessibleProjectCategories: string[];
  };
  projectedProfile: {
    jobMatchPercentage: number;
    careerReadiness: number;
    eligibleJobCount: number;
    skillGapCount: number;
    opportunityRangeLPA: string; // e.g. "₹7.0 – ₹10.0 LPA"
    accessibleProjectCategories: string[];
  };
  improvementDelta: {
    matchIncrease: number;
    readinessIncrease: number;
    newJobsUnlocked: number;
    gapsResolved: number;
    opportunityIncrease: string;
  };
  disclaimer: string;
}

export interface JobOpening {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  roleCategory: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-Site';
  jobType: 'Full-time' | 'Internship';
  experienceRequired: string; // e.g. "0-2 years (Freshers eligible)"
  packageRange: string; // e.g. "₹6 - ₹9 LPA" or "₹25,000/month"
  openingsCount: number;
  applicationDeadline: string;
  requiredSkills: {
    skillId: string;
    skillName: string;
    minProficiency: number; // 0-100
    minLevel: SkillProficiencyLevel;
  }[];
  preferredSkills: string[];
  educationRequirement: string;
  created_at: string;
  applicationsCount: number;
}

export interface CandidateMatch {
  studentId: string;
  studentName: string;
  studentAvatar: string;
  collegeName: string;
  department: string;
  graduationYear: number;
  cgpa: number;
  matchScore: number; // 0-100
  ranking: number;
  breakdown: {
    skillMatch: number;
    proficiencyMatch: number;
    evidenceStrength: number;
    projectRelevance: number;
    experienceScore: number;
    educationMatch: number;
  };
  verifiedEvidenceCount: number;
  hasSkillPassport: boolean;
  passportId?: string;
  matchedSkills: {
    name: string;
    studentProficiency: number;
    requiredProficiency: number;
    isMet: boolean;
  }[];
  missingSkills: string[];
  explainableReasons: string[];
  applicationStatus?: 'Not Applied' | 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Offered' | 'Rejected';
  appliedAt?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  matchScore: number;
  status: 'Applied' | 'Reviewing' | 'Shortlisted' | 'Interview Scheduled' | 'Offered' | 'Rejected';
  appliedAt: string;
  lastUpdated: string;
  notes?: string;
}

export interface PeerEndorsement {
  id: string;
  skillName: string;
  endorserId?: string;
  endorserName: string;
  endorserRole: string; // e.g. "Classmate • Final Year B.Tech CSE"
  endorserAvatar?: string;
  endorserCollege: string;
  relationship: string; // e.g. "Hackathon Teammate - Crop Yield AI", "Lab Partner"
  comment: string;
  date: string;
  status: 'VERIFIED' | 'PENDING';
  endorsementConfidence: number; // e.g. 92
  verificationHash?: string;
}

export interface SkillPassport {
  passportId: string;
  studentId: string;
  studentName: string;
  institutionName: string;
  department: string;
  degree: string;
  cgpa: number;
  targetRole: string;
  careerReadinessScore: number;
  topSkills: {
    skillName: string;
    proficiencyScore: number;
    proficiencyLevel: SkillProficiencyLevel;
    confidenceScore: number;
    evidenceCount: number;
    peerVerified?: boolean;
    peerEndorsementCount?: number;
    peerEndorsers?: string[];
  }[];
  verifiedCertificationsCount: number;
  verifiedProjectsCount: number;
  endorsements?: PeerEndorsement[];
  status: 'VALID' | 'REVOKED' | 'EXPIRED';
  issueDate: string;
  validUntil: string;
  verificationCode: string;
  qrPayloadUrl: string;
  qrCodeDataUrl: string;
}

export interface CollegeStats {
  id: string;
  name: string;
  totalStudents: number;
  placementRate: number; // e.g. 84.5%
  internshipRate: number; // e.g. 76.2%
  studentsJobReady: number;
  averageSkillScore: number; // e.g. 74.8
  verifiedSkillPercentage: number;
  topPerformingSkills: { skill: string; avgScore: number; growth: number }[];
  criticalSkillGaps: { skill: string; deficit: number; industryDemand: number }[];
  boomingSkills: string[];
  decliningSkills: string[];
  activeCompanyPartnerships: number;
  openApplicationsCount: number;
  placedStudentsCount: number;
  averagePackageLPA: number;
  highestPackageLPA: number;
  departments: string[];
}

export interface HeatmapDataRow {
  skill: string;
  skillId?: string;
  category: string;
  studentCount?: number;
  departments: {
    [deptName: string]: number; // score 0-100
  };
  overallAverage: number;
  industryBenchmark: number;
}

export type GeminiIntent =
  | 'JOB_INSIGHT'
  | 'CAREER_GUIDANCE'
  | 'INTERNSHIP'
  | 'PLACEMENT'
  | 'JOB_MATCHING'
  | 'SKILL_DEMAND'
  | 'SKILL_GAP'
  | 'JOB_SIMULATOR'
  | 'RESUME'
  | 'INTERVIEW_PREPARATION'
  | 'STUDY'
  | 'LEARNING'
  | 'ACADEMIC_DOUBT'
  | 'SKILL_DEVELOPMENT'
  | 'OUT_OF_SCOPE';

export type GeminiAIMode = 'JOB_INSIGHTS' | 'STUDY_MODE';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  language: LanguageCode;
  text: string;
  timestamp: string;
  intent?: GeminiIntent;
  mode?: GeminiAIMode;
  isOutOfScope?: boolean;
  isFallback?: boolean;
  suggestedPrompts?: string[];
  referencedData?: {
    skillName?: string;
    gapScore?: number;
    jobTitle?: string;
    targetRole?: string;
    relatedAction?: 'job_simulator' | 'skill_demand' | 'evidence_upload' | 'passport';
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'match' | 'trend' | 'recommendation' | 'passport' | 'application' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  password_hash?: string;
  role: 'STUDENT' | 'COLLEGE' | 'COMPANY';
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';
  name: string;
  created_at: string;
}

export interface CollegeProfile {
  id: string;
  userId: string;
  institutionName: string;
  aisheCode: string; // e.g. C-18492
  affiliation: string;
  nirfRank?: number;
  contactPerson: string;
  designation: string;
  officialEmail: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  accreditation: string; // NAAC A++, NBA
  departmentsCount: number;
  totalEnrolledStudents: number;
  verifiedSkillProfilesCount: number;
  activeMoUsCount: number;
  establishedYear: number;
  placementDirector: string;
  created_at: string;
}

export interface CompanyProfile {
  id: string;
  userId: string;
  companyName: string;
  cinOrRegistration: string;
  industrySector: string;
  headquarters: string;
  officeLocations: string[];
  website: string;
  companySize: string; // e.g. "500-1000 employees"
  talentAcquisitionHead: string;
  contactEmail: string;
  phone: string;
  description: string;
  verifiedStatus: boolean;
  totalJobsPosted: number;
  totalHiresMade: number;
  created_at: string;
}

export interface TalentSearchFilter {
  query?: string;
  skills?: string[];
  minProficiency?: SkillProficiencyLevel | 'All';
  education?: string;
  graduationYear?: number | 'All';
  location?: string;
  jobReadinessMin?: number;
  hasSkillPassport?: boolean;
}

export type BadgeRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type BadgeCategory = 'Proficiency' | 'Infrastructure' | 'Data & AI' | 'Verification' | 'Full-Stack';

export interface SkillBadge {
  id: string;
  title: string; // e.g. "Master of Python", "Cloud Architect"
  subtitle: string;
  description: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  xpReward: number;
  targetSkillName: string; // Target skill required (or 'Aadhaar', 'Peer Consensus')
  requiredProficiency: number; // e.g. 80
  currentProficiency: number;
  progressPercentage: number; // 0 to 100
  isUnlocked: boolean;
  unlockedAt?: string;
  criteriaText: string;
  industrySignificance: string;
  iconType: 'terminal' | 'cloud' | 'cpu' | 'database' | 'zap' | 'layout' | 'server' | 'sparkles' | 'users' | 'shield';
}

export interface DepartmentHeatmap {
  department: string;
  studentCount: number;
  overallReadiness: number;
  skills: {
    name: string;
    proficiency: number;
  }[];
}

