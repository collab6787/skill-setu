import {
  StudentProfile,
  SkillTrend,
  JobOpening,
  CollegeStats,
  HeatmapDataRow,
  User,
  SkillPassport,
  NotificationItem,
  UserAccount,
  CollegeProfile,
  CompanyProfile
} from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'usr-student-01',
    email: 'student@skillsetu.demo',
    name: 'Arun Kumar',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
    preferred_language: 'en',
    created_at: '2026-01-10T10:00:00Z'
  },
  {
    id: 'usr-college-01',
    email: 'college@skillsetu.demo',
    name: 'Dr. Radhakrishnan (Dean of Academics)',
    role: 'college',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    preferred_language: 'en',
    created_at: '2026-01-05T09:00:00Z'
  },
  {
    id: 'usr-company-01',
    email: 'company@skillsetu.demo',
    name: 'Neha Sharma (Head of Talent @ TechNova)',
    role: 'company',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    preferred_language: 'en',
    created_at: '2026-01-08T11:00:00Z'
  },
  {
    id: 'usr-admin-01',
    email: 'admin@skillsetu.demo',
    name: 'AICTE / SIH National Admin',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
    preferred_language: 'en',
    created_at: '2026-01-01T08:00:00Z'
  }
];

export const DEMO_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'acc-student-01',
    email: 'student@skillsetu.demo',
    password_hash: 'demo123',
    role: 'STUDENT',
    status: 'ACTIVE',
    name: 'Arun Kumar',
    created_at: '2026-01-10T10:00:00Z'
  },
  {
    id: 'acc-college-01',
    email: 'college@skillsetu.demo',
    password_hash: 'demo123',
    role: 'COLLEGE',
    status: 'ACTIVE',
    name: 'Dr. Radhakrishnan (Dean of Academics)',
    created_at: '2026-01-05T09:00:00Z'
  },
  {
    id: 'acc-company-01',
    email: 'company@skillsetu.demo',
    password_hash: 'demo123',
    role: 'COMPANY',
    status: 'ACTIVE',
    name: 'Neha Sharma (Head of Talent)',
    created_at: '2026-01-08T11:00:00Z'
  }
];

export const DEMO_COLLEGE_PROFILE: CollegeProfile = {
  id: 'col-profile-01',
  userId: 'usr-college-01',
  institutionName: 'National Institute of Engineering & Technology',
  aisheCode: 'C-18492',
  affiliation: 'Affiliated to APJ Abdul Kalam Technological University • AICTE Approved',
  nirfRank: 28,
  contactPerson: 'Dr. Radhakrishnan',
  designation: 'Dean of Academic & Industry Collaborations',
  officialEmail: 'college@skillsetu.demo',
  phone: '+91 98450 12345',
  address: 'SkillSetu Tech Park, Academic Campus Road',
  city: 'Bengaluru',
  state: 'Karnataka',
  accreditation: 'NAAC A++ (CGPA 3.78) • NBA Tier-I Accredited',
  departmentsCount: 8,
  totalEnrolledStudents: 2480,
  verifiedSkillProfilesCount: 1894,
  activeMoUsCount: 42,
  establishedYear: 1988,
  placementDirector: 'Prof. S. Venkatesh (Head - Corporate Relations)',
  created_at: '2026-01-05T09:00:00Z'
};

export const DEMO_COMPANY_PROFILE: CompanyProfile = {
  id: 'comp-profile-01',
  userId: 'usr-company-01',
  companyName: 'TechNova AI Labs',
  cinOrRegistration: 'U72900KA2021PTC148902',
  industrySector: 'Enterprise AI, Cloud Microservices & Autonomous Agents',
  headquarters: 'Outer Ring Road, Bellandur, Bengaluru',
  officeLocations: ['Bengaluru', 'Hyderabad', 'Pune', 'San Jose (US)'],
  website: 'https://technova.ai.example',
  companySize: '500-1000 employees',
  talentAcquisitionHead: 'Neha Sharma',
  contactEmail: 'company@skillsetu.demo',
  phone: '+91 80 4910 8800',
  description: 'TechNova is a frontier Artificial Intelligence lab engineering high-throughput microservices, LLM orchestration platforms, and production-grade MLOps pipelines for Global 2000 enterprises.',
  verifiedStatus: true,
  totalJobsPosted: 12,
  totalHiresMade: 48,
  created_at: '2026-01-08T11:00:00Z'
};


export const SKILL_TRENDS_DATA: SkillTrend[] = [
  {
    skillId: 'sk-python',
    skillName: 'Python',
    category: 'AI & Data',
    historicalData: [
      { year: 2023, demandScore: 58 },
      { year: 2024, demandScore: 68 },
      { year: 2025, demandScore: 78 },
      { year: 2026, demandScore: 88 },
      { year: 2027, demandScore: 94, isPredicted: true }
    ],
    predictedNextDemand: 94,
    growthRate: 18.5,
    trendClassification: 'BOOMING',
    confidence: 96,
    jobCount: 1420,
    topRoles: ['AI/ML Engineer', 'Data Scientist', 'Backend Architect'],
    averageProficiency: 72,
    description: 'Core foundation language powering machine learning, automation, and high-performance backends.',
    dependencies: ['Basic Programming', 'Algorithms'],
    unlocks: ['Pandas', 'Machine Learning', 'FastAPI', 'PyTorch', 'LangChain']
  },
  {
    skillId: 'sk-fastapi',
    skillName: 'FastAPI',
    category: 'Backend & APIs',
    historicalData: [
      { year: 2023, demandScore: 35 },
      { year: 2024, demandScore: 52 },
      { year: 2025, demandScore: 69 },
      { year: 2026, demandScore: 84 },
      { year: 2027, demandScore: 92, isPredicted: true }
    ],
    predictedNextDemand: 92,
    growthRate: 26.2,
    trendClassification: 'BOOMING',
    confidence: 94,
    jobCount: 980,
    topRoles: ['AI Application Developer', 'Python Backend Engineer', 'MLOps Specialist'],
    averageProficiency: 44,
    description: 'High-performance asynchronous Python web framework for production-grade REST & AI microservices.',
    dependencies: ['Python', 'REST APIs'],
    unlocks: ['AI Microservices', 'Async Pipelines', 'Realtime AI Systems']
  },
  {
    skillId: 'sk-docker',
    skillName: 'Docker',
    category: 'DevOps & Cloud',
    historicalData: [
      { year: 2023, demandScore: 50 },
      { year: 2024, demandScore: 63 },
      { year: 2025, demandScore: 74 },
      { year: 2026, demandScore: 86 },
      { year: 2027, demandScore: 91, isPredicted: true }
    ],
    predictedNextDemand: 91,
    growthRate: 19.8,
    trendClassification: 'BOOMING',
    confidence: 95,
    jobCount: 1250,
    topRoles: ['Cloud Engineer', 'MLOps Engineer', 'Full Stack Developer'],
    averageProficiency: 48,
    description: 'Industry standard for containerization, seamless deployments, and scalable reproducible cloud environments.',
    dependencies: ['Linux Basics', 'Networking'],
    unlocks: ['Kubernetes', 'CI/CD Pipelines', 'Cloud Run', 'Microservices Architecture']
  },
  {
    skillId: 'sk-ml',
    skillName: 'Machine Learning',
    category: 'AI & Data',
    historicalData: [
      { year: 2023, demandScore: 62 },
      { year: 2024, demandScore: 71 },
      { year: 2025, demandScore: 81 },
      { year: 2026, demandScore: 90 },
      { year: 2027, demandScore: 96, isPredicted: true }
    ],
    predictedNextDemand: 96,
    growthRate: 21.4,
    trendClassification: 'BOOMING',
    confidence: 97,
    jobCount: 1650,
    topRoles: ['ML Engineer', 'Data Scientist', 'AI Researcher'],
    averageProficiency: 58,
    description: 'Supervised, unsupervised algorithms, model evaluation, scikit-learn, and predictive analytics.',
    dependencies: ['Python', 'Linear Algebra', 'Statistics'],
    unlocks: ['Deep Learning', 'Computer Vision', 'NLP', 'LLM Engineering']
  },
  {
    skillId: 'sk-react',
    skillName: 'React.js',
    category: 'Frontend',
    historicalData: [
      { year: 2023, demandScore: 75 },
      { year: 2024, demandScore: 78 },
      { year: 2025, demandScore: 81 },
      { year: 2026, demandScore: 83 },
      { year: 2027, demandScore: 85, isPredicted: true }
    ],
    predictedNextDemand: 85,
    growthRate: 7.2,
    trendClassification: 'GROWING',
    confidence: 92,
    jobCount: 1800,
    topRoles: ['Frontend Engineer', 'Full Stack Developer', 'UI Engineer'],
    averageProficiency: 65,
    description: 'Declarative component-based UI library powering modern enterprise web applications.',
    dependencies: ['JavaScript / TypeScript', 'HTML/CSS'],
    unlocks: ['Next.js', 'React Native', 'Design Systems']
  },
  {
    skillId: 'sk-sql',
    skillName: 'PostgreSQL / SQL',
    category: 'Databases',
    historicalData: [
      { year: 2023, demandScore: 70 },
      { year: 2024, demandScore: 73 },
      { year: 2025, demandScore: 76 },
      { year: 2026, demandScore: 80 },
      { year: 2027, demandScore: 82, isPredicted: true }
    ],
    predictedNextDemand: 82,
    growthRate: 6.5,
    trendClassification: 'STABLE',
    confidence: 98,
    jobCount: 1540,
    topRoles: ['Backend Engineer', 'Data Engineer', 'Full Stack Developer'],
    averageProficiency: 70,
    description: 'Relational data modeling, ACID transactions, complex aggregations, and indexing.',
    dependencies: ['Database Fundamentals'],
    unlocks: ['ORM Tools (SQLAlchemy, Drizzle)', 'Data Warehousing', 'Analytics Engineering']
  },
  {
    skillId: 'sk-pandas',
    skillName: 'Pandas & NumPy',
    category: 'AI & Data',
    historicalData: [
      { year: 2023, demandScore: 60 },
      { year: 2024, demandScore: 66 },
      { year: 2025, demandScore: 73 },
      { year: 2026, demandScore: 79 },
      { year: 2027, demandScore: 84, isPredicted: true }
    ],
    predictedNextDemand: 84,
    growthRate: 11.2,
    trendClassification: 'GROWING',
    confidence: 94,
    jobCount: 1100,
    topRoles: ['Data Analyst', 'ML Engineer', 'Quant Researcher'],
    averageProficiency: 76,
    description: 'High-performance tabular data manipulation, feature engineering, and statistical cleaning.',
    dependencies: ['Python'],
    unlocks: ['Feature Engineering Pipelines', 'Data Visualizations']
  },
  {
    skillId: 'sk-legacy-php',
    skillName: 'Legacy Monoliths / PHP 5',
    category: 'Legacy Web',
    historicalData: [
      { year: 2023, demandScore: 48 },
      { year: 2024, demandScore: 40 },
      { year: 2025, demandScore: 32 },
      { year: 2026, demandScore: 24 },
      { year: 2027, demandScore: 18, isPredicted: true }
    ],
    predictedNextDemand: 18,
    growthRate: -28.5,
    trendClassification: 'DECLINING',
    confidence: 91,
    jobCount: 190,
    topRoles: ['Legacy Maintenance'],
    averageProficiency: 55,
    description: 'Older server-rendered legacy architectures being replaced by modern headless/API microservices.',
    dependencies: ['Basic Web'],
    unlocks: ['Modern Framework Migration']
  },
  {
    skillId: 'sk-llm',
    skillName: 'LLM & Generative AI Engineering',
    category: 'AI & Data',
    historicalData: [
      { year: 2023, demandScore: 20 },
      { year: 2024, demandScore: 50 },
      { year: 2025, demandScore: 78 },
      { year: 2026, demandScore: 94 },
      { year: 2027, demandScore: 99, isPredicted: true }
    ],
    predictedNextDemand: 99,
    growthRate: 48.0,
    trendClassification: 'BOOMING',
    confidence: 97,
    jobCount: 1350,
    topRoles: ['GenAI Engineer', 'Prompt Architect', 'AI Solutions Lead'],
    averageProficiency: 36,
    description: 'RAG systems, vector embeddings, fine-tuning, Gemini & LangChain orchestration.',
    dependencies: ['Python', 'Machine Learning', 'FastAPI'],
    unlocks: ['Autonomous Agents', 'Multimodal Enterprise Copilots']
  },
  {
    skillId: 'sk-kubernetes',
    skillName: 'Kubernetes',
    category: 'DevOps & Cloud',
    historicalData: [
      { year: 2023, demandScore: 45 },
      { year: 2024, demandScore: 58 },
      { year: 2025, demandScore: 70 },
      { year: 2026, demandScore: 82 },
      { year: 2027, demandScore: 89, isPredicted: true }
    ],
    predictedNextDemand: 89,
    growthRate: 21.0,
    trendClassification: 'BOOMING',
    confidence: 93,
    jobCount: 880,
    topRoles: ['Cloud Architect', 'DevOps Lead', 'Site Reliability Engineer'],
    averageProficiency: 30,
    description: 'Production container orchestration, auto-scaling, service meshes, and cloud resilience.',
    dependencies: ['Docker', 'Linux Systems'],
    unlocks: ['Multi-Cloud Cluster Architecture']
  }
];

export const STAR_STUDENT_ARUN: StudentProfile = {
  id: 'std-arun-01',
  userId: 'usr-student-01',
  name: 'Arun Kumar',
  email: 'student@demo.com',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
  collegeId: 'col-01',
  collegeName: 'SkillSetu Demo Engineering College',
  degree: 'B.Tech - Computer Science & AI',
  department: 'Computer Science and Engineering',
  graduationYear: 2026,
  cgpa: 8.72,
  targetRole: 'AI/ML Engineer',
  peerVerifiedCount: 3,
  identityVerification: {
    verified: true,
    status: 'DEMO_VERIFIED',
    maskedNumber: 'XXXX-XXXX-8921',
    verificationToken: 'SHA256:DEMO-AADHAAR-TOKEN-8921-GOVT-VERIFIED-V1',
    verifiedAt: '2026-01-15T14:30:00Z',
    verificationSource: 'SkillSetu Demo Identity Provider (Simulated Sandbox)',
    disclaimer: 'Demo Aadhaar verification executed in safe sandbox mode. Zero raw Aadhaar numbers are persisted in database.'
  },
  careerReadinessScore: {
    overall: 78,
    skillStrength: 84,
    evidenceStrength: 72,
    industryAlignment: 81,
    jobReadiness: 75,
    breakdownExplanation: 'Strong baseline in Python, Pandas, and ML algorithms. Identified critical gap in production API deployment (FastAPI) and Containerization (Docker) to achieve 92%+ AI/ML readiness.'
  },
  skills: [
    {
      skillId: 'sk-python',
      skillName: 'Python',
      category: 'AI & Data',
      proficiencyScore: 86,
      proficiencyLevel: 'Advanced',
      confidenceScore: 88,
      evidenceCount: 4,
      evidenceItems: [],
      verificationStatus: 'Verified',
      peerVerified: true,
      peerEndorsementCount: 1,
      peerEndorsers: ['Rohit Kumar'],
      marketDemandScore: 88,
      growthRate: 18.5,
      trend: 'BOOMING',
      lastUpdated: '2026-02-18'
    },
    {
      skillId: 'sk-pandas',
      skillName: 'Pandas & NumPy',
      category: 'AI & Data',
      proficiencyScore: 82,
      proficiencyLevel: 'Advanced',
      confidenceScore: 85,
      evidenceCount: 3,
      evidenceItems: [],
      verificationStatus: 'Verified',
      peerVerified: false,
      peerEndorsementCount: 0,
      marketDemandScore: 79,
      growthRate: 11.2,
      trend: 'GROWING',
      lastUpdated: '2026-02-10'
    },
    {
      skillId: 'sk-sql',
      skillName: 'PostgreSQL / SQL',
      category: 'Databases',
      proficiencyScore: 74,
      proficiencyLevel: 'Intermediate',
      confidenceScore: 78,
      evidenceCount: 3,
      evidenceItems: [],
      verificationStatus: 'Verified',
      peerVerified: true,
      peerEndorsementCount: 1,
      peerEndorsers: ['Ananya Iyer'],
      marketDemandScore: 80,
      growthRate: 6.5,
      trend: 'STABLE',
      lastUpdated: '2026-01-28'
    },
    {
      skillId: 'sk-ml',
      skillName: 'Machine Learning',
      category: 'AI & Data',
      proficiencyScore: 68,
      proficiencyLevel: 'Intermediate',
      confidenceScore: 72,
      evidenceCount: 2,
      evidenceItems: [],
      verificationStatus: 'Verified',
      peerVerified: true,
      peerEndorsementCount: 1,
      peerEndorsers: ['Priya Sharma'],
      marketDemandScore: 90,
      growthRate: 21.4,
      trend: 'BOOMING',
      lastUpdated: '2026-02-05'
    },
    {
      skillId: 'sk-react',
      skillName: 'React.js',
      category: 'Frontend',
      proficiencyScore: 62,
      proficiencyLevel: 'Intermediate',
      confidenceScore: 65,
      evidenceCount: 2,
      evidenceItems: [],
      verificationStatus: 'Verified',
      marketDemandScore: 83,
      growthRate: 7.2,
      trend: 'GROWING',
      lastUpdated: '2026-01-12'
    },
    {
      skillId: 'sk-fastapi',
      skillName: 'FastAPI',
      category: 'Backend & APIs',
      proficiencyScore: 28,
      proficiencyLevel: 'Beginner',
      confidenceScore: 35,
      evidenceCount: 1,
      evidenceItems: [],
      verificationStatus: 'Demo Verified',
      marketDemandScore: 84,
      growthRate: 26.2,
      trend: 'BOOMING',
      lastUpdated: '2026-02-01'
    },
    {
      skillId: 'sk-docker',
      skillName: 'Docker',
      category: 'DevOps & Cloud',
      proficiencyScore: 22,
      proficiencyLevel: 'Beginner',
      confidenceScore: 30,
      evidenceCount: 1,
      evidenceItems: [],
      verificationStatus: 'Demo Verified',
      marketDemandScore: 86,
      growthRate: 19.8,
      trend: 'BOOMING',
      lastUpdated: '2026-01-20'
    }
  ],
  certifications: [
    {
      id: 'cert-01',
      skillId: 'sk-python',
      skillName: 'Python',
      type: 'CERTIFICATION',
      title: 'Python for Data Science & Machine Learning Bootcamp',
      description: 'Comprehensive 40-hour hands-on certification covering OOP, data structures, algorithms, and computational modeling.',
      issuer: 'DeepLearning.AI / Coursera',
      date: '2025-11-20',
      url: 'https://coursera.org/verify/DEMO-PY-8891',
      documentName: 'deeplearning_ai_python_verified.pdf',
      skillsDemonstrated: ['Python', 'Pandas & NumPy', 'Algorithms'],
      verificationStatus: 'Verified',
      verificationSource: 'Academic Registrar & Digital Signature Protocol',
      scoreContribution: 92,
      created_at: '2025-11-21'
    },
    {
      id: 'cert-02',
      skillId: 'sk-sql',
      skillName: 'PostgreSQL / SQL',
      type: 'CERTIFICATION',
      title: 'Relational Database Architecture & Advanced SQL Analytics',
      description: 'Industry-standard credential for query optimization, indexing, and transactional integrity.',
      issuer: 'Oracle / NPTEL National Certification',
      date: '2025-10-15',
      url: 'https://nptel.ac.in/noc/Ecertificate/?q=NPTEL25CS99S1',
      documentName: 'nptel_sql_honor_code.pdf',
      skillsDemonstrated: ['PostgreSQL / SQL', 'Database Design'],
      verificationStatus: 'Verified',
      verificationSource: 'NPTEL National Portal Sync',
      scoreContribution: 88,
      created_at: '2025-10-16'
    }
  ],
  projects: [
    {
      id: 'proj-01',
      skillId: 'sk-ml',
      skillName: 'Machine Learning',
      type: 'PROJECT',
      title: 'Intelligent Crop Disease Detection using Scikit-Learn & Feature Vectors',
      description: 'Built a predictive classifier achieving 92.4% validation accuracy on agricultural sensor data with automated feature normalization.',
      date: '2025-12-10',
      url: 'https://github.com/demo-arun/crop-disease-ml',
      skillsDemonstrated: ['Python', 'Pandas & NumPy', 'Machine Learning'],
      verificationStatus: 'Verified',
      verificationSource: 'Institutional Capstone Evaluation Committee',
      scoreContribution: 89,
      created_at: '2025-12-12'
    },
    {
      id: 'proj-02',
      skillId: 'sk-react',
      skillName: 'React.js',
      type: 'PROJECT',
      title: 'Real-Time Campus Event Pulse Dashboard',
      description: 'Designed interactive responsive web interface with live filtering, state caching, and responsive charts.',
      date: '2025-09-18',
      url: 'https://github.com/demo-arun/campus-pulse-react',
      skillsDemonstrated: ['React.js', 'PostgreSQL / SQL'],
      verificationStatus: 'Verified',
      verificationSource: 'College Open-Source Guild',
      scoreContribution: 84,
      created_at: '2025-09-20'
    },
    {
      id: 'proj-03',
      skillId: 'sk-python',
      skillName: 'Python',
      type: 'PROJECT',
      title: 'High-Throughput Financial Transaction Fraud Anomaly Detector',
      description: 'Developed streaming anomaly detection pipeline utilizing Random Forests and isolation forest estimators with synthetic transaction datasets.',
      date: '2026-01-25',
      url: 'https://github.com/demo-arun/fraud-detector-engine',
      skillsDemonstrated: ['Python', 'Machine Learning', 'Pandas & NumPy'],
      verificationStatus: 'Verified',
      verificationSource: 'Inter-College Hackathon 1st Prize Evaluation',
      scoreContribution: 91,
      created_at: '2026-01-26'
    }
  ],
  passportId: 'PASS-2026-ARUN-8921',
  createdAt: '2025-08-01'
};

export const DEMO_PASSPORTS: Record<string, SkillPassport> = {
  'PASS-2026-ARUN-8921': {
    passportId: 'PASS-2026-ARUN-8921',
    studentId: 'std-arun-01',
    studentName: 'Arun Kumar',
    institutionName: 'SkillSetu Demo Engineering College',
    department: 'Computer Science and Engineering',
    degree: 'B.Tech in Artificial Intelligence',
    cgpa: 8.72,
    targetRole: 'AI/ML Engineer',
    careerReadinessScore: 78,
    topSkills: [
      { skillName: 'Python', proficiencyScore: 86, proficiencyLevel: 'Advanced', confidenceScore: 88, evidenceCount: 4, peerVerified: true, peerEndorsementCount: 1, peerEndorsers: ['Rohit Kumar'] },
      { skillName: 'Pandas & NumPy', proficiencyScore: 82, proficiencyLevel: 'Advanced', confidenceScore: 85, evidenceCount: 3, peerVerified: false, peerEndorsementCount: 0 },
      { skillName: 'PostgreSQL / SQL', proficiencyScore: 74, proficiencyLevel: 'Intermediate', confidenceScore: 78, evidenceCount: 3, peerVerified: true, peerEndorsementCount: 1, peerEndorsers: ['Ananya Iyer'] },
      { skillName: 'Machine Learning', proficiencyScore: 68, proficiencyLevel: 'Intermediate', confidenceScore: 72, evidenceCount: 2, peerVerified: true, peerEndorsementCount: 1, peerEndorsers: ['Priya Sharma'] },
      { skillName: 'React.js', proficiencyScore: 62, proficiencyLevel: 'Intermediate', confidenceScore: 65, evidenceCount: 2, peerVerified: false, peerEndorsementCount: 0 }
    ],
    verifiedCertificationsCount: 2,
    verifiedProjectsCount: 3,
    endorsements: [
      {
        id: 'end-01',
        skillName: 'Python',
        endorserId: 'std-rohit-02',
        endorserName: 'Rohit Kumar',
        endorserRole: 'Classmate • Final Year B.Tech CSE',
        endorserAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
        endorserCollege: 'SkillSetu Demo Engineering College',
        relationship: 'Cap-stone Project Teammate (IoT & ML Anomaly Detection)',
        comment: 'Arun architected our streaming preprocessing pipeline in Python. His data structure design and error handling in high-throughput loops were stellar and production-grade.',
        date: '2026-02-14',
        status: 'VERIFIED',
        endorsementConfidence: 95,
        verificationHash: 'SHA256:PEER-ROHIT-PY-9921'
      },
      {
        id: 'end-02',
        skillName: 'Machine Learning',
        endorserId: 'std-priya-03',
        endorserName: 'Priya Sharma',
        endorserRole: 'Classmate • Final Year B.Tech CSE',
        endorserAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
        endorserCollege: 'SkillSetu Demo Engineering College',
        relationship: 'National Smart India Hackathon Teammate',
        comment: 'Collaborated during the 36-hour SIH hackathon on agricultural yield models. Arun tuned our Random Forest ensemble and achieved 93.4% accuracy under intense time constraints.',
        date: '2026-02-08',
        status: 'VERIFIED',
        endorsementConfidence: 92,
        verificationHash: 'SHA256:PEER-PRIYA-ML-4412'
      },
      {
        id: 'end-03',
        skillName: 'PostgreSQL / SQL',
        endorserId: 'std-ananya-04',
        endorserName: 'Ananya Iyer',
        endorserRole: 'Classmate • Final Year B.Tech AI & DS',
        endorserAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        endorserCollege: 'SkillSetu Demo Engineering College',
        relationship: 'Database Management Systems Lab Partner',
        comment: 'Wrote complex indexing queries and CTEs for our semester hospital management database project. Strong understanding of query execution plans and relational normalization.',
        date: '2026-01-29',
        status: 'VERIFIED',
        endorsementConfidence: 89,
        verificationHash: 'SHA256:PEER-ANANYA-SQL-7731'
      }
    ],
    status: 'VALID',
    issueDate: '2026-02-15',
    validUntil: '2027-02-15',
    verificationCode: 'SKILLSETU-HASH-88A92-CRYPTO-V2',
    qrPayloadUrl: '/verify/passport/PASS-2026-ARUN-8921',
    qrCodeDataUrl: ''
  }
};

export const DEMO_JOBS: JobOpening[] = [
  {
    id: 'job-technova-01',
    companyId: 'comp-01',
    companyName: 'TechNova AI Labs',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    title: 'Junior AI / ML Engineer',
    description: 'TechNova is looking for ambitious junior engineers to build production machine learning pipelines and FastAPI microservices powering our enterprise generative intelligence platform.',
    roleCategory: 'AI & Data Science',
    location: 'Bengaluru, Karnataka',
    workMode: 'Hybrid',
    jobType: 'Full-time',
    experienceRequired: '0-2 years (Freshers Eligible)',
    packageRange: '₹8.0 – ₹12.0 LPA',
    openingsCount: 4,
    applicationDeadline: '2026-04-30',
    requiredSkills: [
      { skillId: 'sk-python', skillName: 'Python', minProficiency: 75, minLevel: 'Advanced' },
      { skillId: 'sk-ml', skillName: 'Machine Learning', minProficiency: 65, minLevel: 'Intermediate' },
      { skillId: 'sk-sql', skillName: 'PostgreSQL / SQL', minProficiency: 60, minLevel: 'Intermediate' },
      { skillId: 'sk-fastapi', skillName: 'FastAPI', minProficiency: 60, minLevel: 'Intermediate' },
      { skillId: 'sk-docker', skillName: 'Docker', minProficiency: 55, minLevel: 'Intermediate' },
      { skillId: 'sk-pandas', skillName: 'Pandas & NumPy', minProficiency: 70, minLevel: 'Advanced' }
    ],
    preferredSkills: ['PyTorch', 'Git Workflow', 'REST APIs', 'Cloud Deployment'],
    educationRequirement: 'B.Tech / B.E in CSE, AI/DS, IT or related fields (CGPA > 7.5)',
    created_at: '2026-02-01',
    applicationsCount: 38
  },
  {
    id: 'job-razorpay-02',
    companyId: 'comp-02',
    companyName: 'Razorpay Engineering',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=128',
    title: 'Full Stack Web Platform Associate',
    description: 'Design robust client-facing financial checkout portals with React, TypeScript, and high-concurrency microservices.',
    roleCategory: 'Full Stack',
    location: 'Bengaluru / Remote',
    workMode: 'Remote',
    jobType: 'Full-time',
    experienceRequired: '0-1 year',
    packageRange: '₹9.0 – ₹14.0 LPA',
    openingsCount: 6,
    applicationDeadline: '2026-04-15',
    requiredSkills: [
      { skillId: 'sk-react', skillName: 'React.js', minProficiency: 75, minLevel: 'Advanced' },
      { skillId: 'sk-sql', skillName: 'PostgreSQL / SQL', minProficiency: 65, minLevel: 'Intermediate' },
      { skillId: 'sk-python', skillName: 'Python', minProficiency: 60, minLevel: 'Intermediate' },
      { skillId: 'sk-docker', skillName: 'Docker', minProficiency: 50, minLevel: 'Intermediate' }
    ],
    preferredSkills: ['Tailwind CSS', 'Next.js', 'Redis', 'Jest'],
    educationRequirement: 'B.Tech / MCA (Any Branch with proven web projects)',
    created_at: '2026-02-04',
    applicationsCount: 62
  },
  {
    id: 'job-google-03',
    companyId: 'comp-03',
    companyName: 'Google India Cloud Partner Lab',
    companyLogo: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=128',
    title: 'Cloud & MLOps Engineering Intern',
    description: '6-month pre-placement internship to deploy containerized LLM pipelines and automated CI/CD infrastructure on Google Cloud.',
    roleCategory: 'Cloud & DevOps',
    location: 'Hyderabad, Telangana',
    workMode: 'Hybrid',
    jobType: 'Internship',
    experienceRequired: 'Pre-final & Final Year Students',
    packageRange: '₹45,000 / month Stipend (PPO up to ₹16 LPA)',
    openingsCount: 8,
    applicationDeadline: '2026-03-31',
    requiredSkills: [
      { skillId: 'sk-docker', skillName: 'Docker', minProficiency: 70, minLevel: 'Advanced' },
      { skillId: 'sk-python', skillName: 'Python', minProficiency: 70, minLevel: 'Advanced' },
      { skillId: 'sk-kubernetes', skillName: 'Kubernetes', minProficiency: 55, minLevel: 'Intermediate' }
    ],
    preferredSkills: ['GCP Basics', 'Linux Bash Scripting', 'FastAPI'],
    educationRequirement: 'Enrolled in accredited engineering degree with 70%+ aggregate',
    created_at: '2026-02-10',
    applicationsCount: 94
  },
  {
    id: 'job-zomato-04',
    companyId: 'comp-04',
    companyName: 'Zomato Tech',
    companyLogo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=128',
    title: 'Data Science & Algorithm Analyst',
    description: 'Analyze real-time delivery logistics, predict demand surges, and optimize restaurant dispatch times.',
    roleCategory: 'Data & Analytics',
    location: 'Gurugram, NCR',
    workMode: 'On-Site',
    jobType: 'Full-time',
    experienceRequired: '0-2 years',
    packageRange: '₹7.5 – ₹11.0 LPA',
    openingsCount: 3,
    applicationDeadline: '2026-05-15',
    requiredSkills: [
      { skillId: 'sk-python', skillName: 'Python', minProficiency: 80, minLevel: 'Advanced' },
      { skillId: 'sk-pandas', skillName: 'Pandas & NumPy', minProficiency: 75, minLevel: 'Advanced' },
      { skillId: 'sk-sql', skillName: 'PostgreSQL / SQL', minProficiency: 75, minLevel: 'Advanced' },
      { skillId: 'sk-ml', skillName: 'Machine Learning', minProficiency: 65, minLevel: 'Intermediate' }
    ],
    preferredSkills: ['Data Visualization', 'Hypothesis Testing', 'Tableau'],
    educationRequirement: 'B.Tech / M.Sc Statistics / Data Science',
    created_at: '2026-02-12',
    applicationsCount: 45
  }
];

export const OTHER_STUDENTS_POOL: StudentProfile[] = [
  {
    id: 'std-rohit-02',
    userId: 'usr-std-02',
    name: 'Rohit Kumar',
    email: 'rohit.kumar@demo.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    collegeId: 'col-01',
    collegeName: 'SkillSetu Demo Engineering College',
    degree: 'B.Tech - CSE',
    department: 'Computer Science and Engineering',
    graduationYear: 2026,
    cgpa: 9.15,
    targetRole: 'AI/ML Engineer',
    identityVerification: {
      verified: true,
      status: 'DEMO_VERIFIED',
      maskedNumber: 'XXXX-XXXX-9912',
      verificationToken: 'SHA256:DEMO-TOKEN-ROHIT-9912',
      verifiedAt: '2026-01-10T10:00:00Z',
      verificationSource: 'SkillSetu Demo Identity Provider',
      disclaimer: 'Demo Aadhaar verification'
    },
    careerReadinessScore: {
      overall: 91,
      skillStrength: 94,
      evidenceStrength: 89,
      industryAlignment: 92,
      jobReadiness: 88,
      breakdownExplanation: 'Exceptional full-cycle proficiency in Python, FastAPI, ML, and Docker with 4 verified production repositories.'
    },
    skills: [
      { skillId: 'sk-python', skillName: 'Python', category: 'AI & Data', proficiencyScore: 92, proficiencyLevel: 'Expert', confidenceScore: 95, evidenceCount: 5, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 88, growthRate: 18.5, trend: 'BOOMING', lastUpdated: '2026-02-18' },
      { skillId: 'sk-ml', skillName: 'Machine Learning', category: 'AI & Data', proficiencyScore: 88, proficiencyLevel: 'Expert', confidenceScore: 90, evidenceCount: 4, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 90, growthRate: 21.4, trend: 'BOOMING', lastUpdated: '2026-02-15' },
      { skillId: 'sk-fastapi', skillName: 'FastAPI', category: 'Backend & APIs', proficiencyScore: 84, proficiencyLevel: 'Advanced', confidenceScore: 86, evidenceCount: 3, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 84, growthRate: 26.2, trend: 'BOOMING', lastUpdated: '2026-02-10' },
      { skillId: 'sk-docker', skillName: 'Docker', category: 'DevOps & Cloud', proficiencyScore: 78, proficiencyLevel: 'Advanced', confidenceScore: 80, evidenceCount: 3, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 86, growthRate: 19.8, trend: 'BOOMING', lastUpdated: '2026-02-08' },
      { skillId: 'sk-sql', skillName: 'PostgreSQL / SQL', category: 'Databases', proficiencyScore: 85, proficiencyLevel: 'Expert', confidenceScore: 88, evidenceCount: 3, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 80, growthRate: 6.5, trend: 'STABLE', lastUpdated: '2026-01-30' },
      { skillId: 'sk-pandas', skillName: 'Pandas & NumPy', category: 'AI & Data', proficiencyScore: 89, proficiencyLevel: 'Expert', confidenceScore: 92, evidenceCount: 4, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 79, growthRate: 11.2, trend: 'GROWING', lastUpdated: '2026-02-14' }
    ],
    certifications: [
      { id: 'c-r1', skillId: 'sk-python', skillName: 'Python', type: 'CERTIFICATION', title: 'TensorFlow Developer Certificate', description: 'Google Deep Learning Verification', issuer: 'Google', date: '2025-10-12', skillsDemonstrated: ['Python', 'Machine Learning'], verificationStatus: 'Verified', verificationSource: 'Google Certification Hub', scoreContribution: 95, created_at: '2025-10-13' }
    ],
    projects: [
      { id: 'p-r1', skillId: 'sk-fastapi', skillName: 'FastAPI', type: 'PROJECT', title: 'Enterprise RAG Agent with Streaming REST Endpoints', description: 'Production AI backend with Redis cache and async vector lookups', date: '2026-01-20', skillsDemonstrated: ['FastAPI', 'Docker', 'Python', 'Machine Learning'], verificationStatus: 'Verified', verificationSource: 'Institutional Hackathon Grand Finalist', scoreContribution: 94, created_at: '2026-01-22' }
    ],
    passportId: 'PASS-2026-ROHIT-9912',
    createdAt: '2025-08-01'
  },
  {
    id: 'std-priya-03',
    userId: 'usr-std-03',
    name: 'Priya Sharma',
    email: 'priya.sharma@demo.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
    collegeId: 'col-01',
    collegeName: 'SkillSetu Demo Engineering College',
    degree: 'B.Tech - CSE',
    department: 'Computer Science and Engineering',
    graduationYear: 2026,
    cgpa: 8.90,
    targetRole: 'Full Stack Developer',
    identityVerification: {
      verified: true,
      status: 'DEMO_VERIFIED',
      maskedNumber: 'XXXX-XXXX-4432',
      verificationToken: 'SHA256:DEMO-TOKEN-PRIYA-4432',
      verifiedAt: '2026-01-12T12:00:00Z',
      verificationSource: 'SkillSetu Demo Identity Provider',
      disclaimer: 'Demo Aadhaar verification'
    },
    careerReadinessScore: {
      overall: 86,
      skillStrength: 89,
      evidenceStrength: 84,
      industryAlignment: 88,
      jobReadiness: 85,
      breakdownExplanation: 'Robust full stack skillset in React, TypeScript, Node.js, and PostgreSQL.'
    },
    skills: [
      { skillId: 'sk-react', skillName: 'React.js', category: 'Frontend', proficiencyScore: 90, proficiencyLevel: 'Expert', confidenceScore: 92, evidenceCount: 4, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 83, growthRate: 7.2, trend: 'GROWING', lastUpdated: '2026-02-12' },
      { skillId: 'sk-sql', skillName: 'PostgreSQL / SQL', category: 'Databases', proficiencyScore: 82, proficiencyLevel: 'Advanced', confidenceScore: 85, evidenceCount: 3, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 80, growthRate: 6.5, trend: 'STABLE', lastUpdated: '2026-01-20' },
      { skillId: 'sk-python', skillName: 'Python', category: 'AI & Data', proficiencyScore: 74, proficiencyLevel: 'Intermediate', confidenceScore: 76, evidenceCount: 2, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 88, growthRate: 18.5, trend: 'BOOMING', lastUpdated: '2026-02-05' },
      { skillId: 'sk-docker', skillName: 'Docker', category: 'DevOps & Cloud', proficiencyScore: 66, proficiencyLevel: 'Intermediate', confidenceScore: 70, evidenceCount: 2, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 86, growthRate: 19.8, trend: 'BOOMING', lastUpdated: '2026-01-18' }
    ],
    certifications: [],
    projects: [],
    passportId: 'PASS-2026-PRIYA-4432',
    createdAt: '2025-08-01'
  },
  {
    id: 'std-ananya-04',
    userId: 'usr-std-04',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@demo.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    collegeId: 'col-01',
    collegeName: 'SkillSetu Demo Engineering College',
    degree: 'B.Tech - Artificial Intelligence & Data Science',
    department: 'Artificial Intelligence & Data Science',
    graduationYear: 2026,
    cgpa: 9.32,
    targetRole: 'Data Scientist',
    identityVerification: {
      verified: true,
      status: 'DEMO_VERIFIED',
      maskedNumber: 'XXXX-XXXX-7721',
      verificationToken: 'SHA256:DEMO-TOKEN-ANANYA-7721',
      verifiedAt: '2026-01-14T09:00:00Z',
      verificationSource: 'SkillSetu Demo Identity Provider',
      disclaimer: 'Demo Aadhaar verification'
    },
    careerReadinessScore: {
      overall: 89,
      skillStrength: 92,
      evidenceStrength: 87,
      industryAlignment: 90,
      jobReadiness: 86,
      breakdownExplanation: 'Exceptional in statistical feature modeling, predictive analytics, and deep learning architectures.'
    },
    skills: [
      { skillId: 'sk-python', skillName: 'Python', category: 'AI & Data', proficiencyScore: 94, proficiencyLevel: 'Expert', confidenceScore: 96, evidenceCount: 5, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 88, growthRate: 18.5, trend: 'BOOMING', lastUpdated: '2026-02-18' },
      { skillId: 'sk-pandas', skillName: 'Pandas & NumPy', category: 'AI & Data', proficiencyScore: 92, proficiencyLevel: 'Expert', confidenceScore: 94, evidenceCount: 4, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 79, growthRate: 11.2, trend: 'GROWING', lastUpdated: '2026-02-14' },
      { skillId: 'sk-ml', skillName: 'Machine Learning', category: 'AI & Data', proficiencyScore: 90, proficiencyLevel: 'Expert', confidenceScore: 92, evidenceCount: 4, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 90, growthRate: 21.4, trend: 'BOOMING', lastUpdated: '2026-02-12' },
      { skillId: 'sk-sql', skillName: 'PostgreSQL / SQL', category: 'Databases', proficiencyScore: 88, proficiencyLevel: 'Expert', confidenceScore: 90, evidenceCount: 3, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 80, growthRate: 6.5, trend: 'STABLE', lastUpdated: '2026-01-25' }
    ],
    certifications: [],
    projects: [],
    passportId: 'PASS-2026-ANANYA-7721',
    createdAt: '2025-08-01'
  },
  {
    id: 'std-vikram-05',
    userId: 'usr-std-05',
    name: 'Vikram Patel',
    email: 'vikram.patel@demo.edu',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
    collegeId: 'col-01',
    collegeName: 'SkillSetu Demo Engineering College',
    degree: 'B.Tech - Electronics & Communication',
    department: 'Electronics and Communication Engineering',
    graduationYear: 2026,
    cgpa: 8.12,
    targetRole: 'Cloud & Embedded Engineer',
    identityVerification: {
      verified: true,
      status: 'DEMO_VERIFIED',
      maskedNumber: 'XXXX-XXXX-6619',
      verificationToken: 'SHA256:DEMO-TOKEN-VIKRAM-6619',
      verifiedAt: '2026-01-16T11:00:00Z',
      verificationSource: 'SkillSetu Demo Identity Provider',
      disclaimer: 'Demo Aadhaar verification'
    },
    careerReadinessScore: {
      overall: 73,
      skillStrength: 76,
      evidenceStrength: 68,
      industryAlignment: 74,
      jobReadiness: 72,
      breakdownExplanation: 'Good foundational programming and networking with emerging cloud & IoT competencies.'
    },
    skills: [
      { skillId: 'sk-docker', skillName: 'Docker', category: 'DevOps & Cloud', proficiencyScore: 75, proficiencyLevel: 'Advanced', confidenceScore: 78, evidenceCount: 3, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 86, growthRate: 19.8, trend: 'BOOMING', lastUpdated: '2026-02-10' },
      { skillId: 'sk-python', skillName: 'Python', category: 'AI & Data', proficiencyScore: 68, proficiencyLevel: 'Intermediate', confidenceScore: 70, evidenceCount: 2, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 88, growthRate: 18.5, trend: 'BOOMING', lastUpdated: '2026-01-20' },
      { skillId: 'sk-kubernetes', skillName: 'Kubernetes', category: 'DevOps & Cloud', proficiencyScore: 58, proficiencyLevel: 'Intermediate', confidenceScore: 60, evidenceCount: 2, evidenceItems: [], verificationStatus: 'Verified', marketDemandScore: 82, growthRate: 21.0, trend: 'BOOMING', lastUpdated: '2026-02-02' }
    ],
    certifications: [],
    projects: [],
    passportId: 'PASS-2026-VIKRAM-6619',
    createdAt: '2025-08-01'
  }
];

export const DEMO_COLLEGE_STATS: CollegeStats = {
  id: 'col-01',
  name: 'SkillSetu Demo Engineering College (Affiliated with AICTE / State Tech University)',
  totalStudents: 1480,
  placementRate: 84.6,
  internshipRate: 78.2,
  studentsJobReady: 1120,
  averageSkillScore: 73.8,
  verifiedSkillPercentage: 88.4,
  topPerformingSkills: [
    { skill: 'Python', avgScore: 76.4, growth: 14.2 },
    { skill: 'React.js', avgScore: 72.1, growth: 8.5 },
    { skill: 'PostgreSQL / SQL', avgScore: 74.8, growth: 6.1 },
    { skill: 'Machine Learning', avgScore: 66.2, growth: 19.4 }
  ],
  criticalSkillGaps: [
    { skill: 'FastAPI Microservices', deficit: 38.5, industryDemand: 84 },
    { skill: 'Docker & Kubernetes', deficit: 32.1, industryDemand: 86 },
    { skill: 'LLM & Generative AI Engineering', deficit: 44.0, industryDemand: 94 }
  ],
  boomingSkills: ['FastAPI', 'Docker', 'Machine Learning', 'LLM Engineering', 'Python'],
  decliningSkills: ['Legacy Monoliths / PHP 5', 'Visual Basic .NET', 'Desktop WinForms'],
  activeCompanyPartnerships: 42,
  openApplicationsCount: 312,
  placedStudentsCount: 680,
  averagePackageLPA: 7.4,
  highestPackageLPA: 24.5,
  departments: ['Computer Science and Engineering', 'Artificial Intelligence & Data Science', 'Information Technology', 'Electronics and Communication Engineering', 'Electrical and Electronics Engineering']
};

export const DEMO_HEATMAP_DATA: HeatmapDataRow[] = [
  {
    skill: 'Python',
    category: 'AI & Data',
    departments: {
      'Computer Science': 82,
      'AI & Data Science': 88,
      'Information Tech': 76,
      'Electronics (ECE)': 61,
      'Electrical (EEE)': 49
    },
    overallAverage: 71.2,
    industryBenchmark: 75
  },
  {
    skill: 'Machine Learning',
    category: 'AI & Data',
    departments: {
      'Computer Science': 74,
      'AI & Data Science': 86,
      'Information Tech': 68,
      'Electronics (ECE)': 52,
      'Electrical (EEE)': 38
    },
    overallAverage: 63.6,
    industryBenchmark: 70
  },
  {
    skill: 'FastAPI Microservices',
    category: 'Backend & APIs',
    departments: {
      'Computer Science': 46,
      'AI & Data Science': 54,
      'Information Tech': 42,
      'Electronics (ECE)': 24,
      'Electrical (EEE)': 15
    },
    overallAverage: 36.2,
    industryBenchmark: 65
  },
  {
    skill: 'Docker & Containers',
    category: 'DevOps & Cloud',
    departments: {
      'Computer Science': 58,
      'AI & Data Science': 52,
      'Information Tech': 50,
      'Electronics (ECE)': 36,
      'Electrical (EEE)': 22
    },
    overallAverage: 43.6,
    industryBenchmark: 65
  },
  {
    skill: 'PostgreSQL / SQL',
    category: 'Databases',
    departments: {
      'Computer Science': 80,
      'AI & Data Science': 78,
      'Information Tech': 76,
      'Electronics (ECE)': 56,
      'Electrical (EEE)': 45
    },
    overallAverage: 67.0,
    industryBenchmark: 70
  },
  {
    skill: 'React.js',
    category: 'Frontend',
    departments: {
      'Computer Science': 75,
      'AI & Data Science': 64,
      'Information Tech': 78,
      'Electronics (ECE)': 42,
      'Electrical (EEE)': 30
    },
    overallAverage: 57.8,
    industryBenchmark: 65
  }
];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    title: 'New High-Match Job Opening',
    message: 'TechNova AI Labs just posted "Junior AI / ML Engineer" matching 88% of your verified skillset!',
    type: 'match',
    timestamp: '10 minutes ago',
    read: false,
    actionUrl: '/student/jobs'
  },
  {
    id: 'notif-02',
    title: 'Market Skill Demand Alert',
    message: 'FastAPI demand increased by +26% in your target AI/ML roles. Complete the recommended sprint to close your gap.',
    type: 'trend',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/student/skill-intelligence'
  },
  {
    id: 'notif-03',
    title: 'Digital Skill Passport Verified',
    message: 'Your institutional Skill Passport (ID: PASS-2026-ARUN-8921) has been cryptographically signed and QR enabled.',
    type: 'passport',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/student/passport'
  }
];
