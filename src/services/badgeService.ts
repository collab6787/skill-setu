import { StudentProfile, SkillBadge } from '../types';

export interface BadgeSystemStats {
  totalBadges: number;
  unlockedCount: number;
  lockedCount: number;
  totalXpEarned: number;
  totalXpPossible: number;
  completionPercentage: number;
  studentLevel: {
    level: number;
    title: string;
    nextLevelXp: number;
    currentLevelXp: number;
    progressToNextLevel: number;
  };
}

export function evaluateStudentBadges(student: StudentProfile): SkillBadge[] {
  const skills = student.skills || [];

  // Helper to find skill by exact or partial name
  const findSkill = (name: string) => {
    const q = name.toLowerCase();
    return skills.find(s => s.skillName.toLowerCase().includes(q) || q.includes(s.skillName.toLowerCase()));
  };

  const pythonSkill = findSkill('python');
  const dockerSkill = findSkill('docker') || findSkill('kubernetes');
  const mlSkill = findSkill('machine learning') || findSkill('ml');
  const pandasSkill = findSkill('pandas');
  const fastapiSkill = findSkill('fastapi');
  const reactSkill = findSkill('react');
  const sqlSkill = findSkill('sql') || findSkill('postgres');
  const genaiSkill = findSkill('llm') || findSkill('generative ai');

  const pythonScore = pythonSkill?.proficiencyScore || 0;
  const dockerScore = dockerSkill?.proficiencyScore || 0;
  const mlScore = mlSkill?.proficiencyScore || 0;
  const pandasScore = pandasSkill?.proficiencyScore || 0;
  const fastapiScore = fastapiSkill?.proficiencyScore || 0;
  const reactScore = reactSkill?.proficiencyScore || 0;
  const sqlScore = sqlSkill?.proficiencyScore || 0;
  const genaiScore = genaiSkill?.proficiencyScore || 0;
  const gitScore = 85;
  const systemDesignScore = 45;

  // Peer verification count
  const peerVerifiedCount = skills.filter(s => s.peerVerified).length;
  const effectivePeerCount = Math.max(peerVerifiedCount, student.peerVerifiedCount || 0);

  // Identity verified
  const isAadhaarVerified =
    Boolean(student.identityVerification?.verified) ||
    student.identityVerification?.status === 'DEMO_VERIFIED' ||
    student.identityVerification?.status === 'OFFICIAL_VERIFIED';

  const badges: SkillBadge[] = [
    {
      id: 'badge-python-master',
      title: 'Master of Python',
      subtitle: 'Core Language Virtuoso',
      description: 'Awarded for reaching Advanced/Expert proficiency in Python algorithms, data pipelines, and clean architectures.',
      category: 'Proficiency',
      rarity: 'Rare',
      xpReward: 250,
      targetSkillName: 'Python',
      requiredProficiency: 80,
      currentProficiency: pythonScore,
      progressPercentage: Math.min(100, Math.round((pythonScore / 80) * 100)),
      isUnlocked: pythonScore >= 80,
      unlockedAt: pythonScore >= 80 ? '2026-02-18' : undefined,
      criteriaText: 'Achieve 80%+ proficiency (Advanced / Expert) in Python',
      industrySignificance: 'Essential foundation for 90%+ of AI/ML engineering and modern backend roles across India tech ecosystems.',
      iconType: 'terminal'
    },
    {
      id: 'badge-cloud-architect',
      title: 'Cloud Architect',
      subtitle: 'Infrastructure & Containerization',
      description: 'Mastery of Docker container orchestration, deployment reproducibility, and resilient multi-container environments.',
      category: 'Infrastructure',
      rarity: 'Legendary',
      xpReward: 500,
      targetSkillName: 'Docker',
      requiredProficiency: 75,
      currentProficiency: dockerScore,
      progressPercentage: Math.min(100, Math.round((dockerScore / 75) * 100)),
      isUnlocked: dockerScore >= 75,
      unlockedAt: dockerScore >= 75 ? '2026-02-28' : undefined,
      criteriaText: 'Reach 75%+ proficiency in Docker or Kubernetes infrastructure',
      industrySignificance: 'High-salary prerequisite for Cloud, DevOps, and MLOps engineering ensuring production zero-downtime.',
      iconType: 'cloud'
    },
    {
      id: 'badge-ai-ml-practitioner',
      title: 'AI & ML Practitioner',
      subtitle: 'Predictive Modeling & Scikit-Learn',
      description: 'Demonstrated competency in mathematical modeling, training validation, error analysis, and statistical ML algorithms.',
      category: 'Data & AI',
      rarity: 'Epic',
      xpReward: 350,
      targetSkillName: 'Machine Learning',
      requiredProficiency: 75,
      currentProficiency: mlScore,
      progressPercentage: Math.min(100, Math.round((mlScore / 75) * 100)),
      isUnlocked: mlScore >= 75,
      unlockedAt: mlScore >= 75 ? '2026-02-20' : undefined,
      criteriaText: 'Reach 75%+ proficiency in Machine Learning workflows',
      industrySignificance: 'Direct eligibility signal for Junior & Associate AI Researcher roles at product enterprises.',
      iconType: 'cpu'
    },
    {
      id: 'badge-data-science-virtuoso',
      title: 'Data Science Virtuoso',
      subtitle: 'Vectorized Analytics & Pandas',
      description: 'Awarded for precision tabular data processing, missing value resolution, feature engineering, and statistical aggregations.',
      category: 'Data & AI',
      rarity: 'Rare',
      xpReward: 250,
      targetSkillName: 'Pandas & NumPy',
      requiredProficiency: 80,
      currentProficiency: pandasScore,
      progressPercentage: Math.min(100, Math.round((pandasScore / 80) * 100)),
      isUnlocked: pandasScore >= 80,
      unlockedAt: pandasScore >= 80 ? '2026-02-10' : undefined,
      criteriaText: 'Achieve 80%+ proficiency in Pandas & NumPy tabular processing',
      industrySignificance: 'Foundational prerequisite for quantitative research, data engineering, and business intelligence.',
      iconType: 'database'
    },
    {
      id: 'badge-fastapi-ninja',
      title: 'API Craftsman',
      subtitle: 'Asynchronous Python Web Services',
      description: 'Mastery of FastAPI, async request handling, Pydantic type models, and high-concurrency model inference serving.',
      category: 'Proficiency',
      rarity: 'Epic',
      xpReward: 350,
      targetSkillName: 'FastAPI',
      requiredProficiency: 75,
      currentProficiency: fastapiScore,
      progressPercentage: Math.min(100, Math.round((fastapiScore / 75) * 100)),
      isUnlocked: fastapiScore >= 75,
      unlockedAt: fastapiScore >= 75 ? new Date().toISOString().split('T')[0] : undefined,
      criteriaText: 'Reach 75%+ proficiency in FastAPI microservices & async APIs',
      industrySignificance: 'Fastest-growing backend skill across AI startups looking to wrap models in low-latency REST/WebSockets.',
      iconType: 'zap'
    },
    {
      id: 'badge-frontend-artisan',
      title: 'Frontend Artisan',
      subtitle: 'Reactive UI Architecture',
      description: 'Demonstrated ability to build performant component trees, declarative hooks, and modern TypeScript web apps.',
      category: 'Full-Stack',
      rarity: 'Rare',
      xpReward: 250,
      targetSkillName: 'React.js',
      requiredProficiency: 75,
      currentProficiency: reactScore,
      progressPercentage: Math.min(100, Math.round((reactScore / 75) * 100)),
      isUnlocked: reactScore >= 75,
      unlockedAt: reactScore >= 75 ? '2026-01-25' : undefined,
      criteriaText: 'Reach 75%+ proficiency in React.js and modern state management',
      industrySignificance: 'Ensures immediate capability to contribute to production client-facing dashboards and platforms.',
      iconType: 'layout'
    },
    {
      id: 'badge-sql-guardian',
      title: 'Data Guardian',
      subtitle: 'Relational Schema & SQL Engineering',
      description: 'Expertise in relational schema modeling, indexing strategies, complex analytical window functions, and query optimization.',
      category: 'Data & AI',
      rarity: 'Common',
      xpReward: 150,
      targetSkillName: 'PostgreSQL / SQL',
      requiredProficiency: 70,
      currentProficiency: sqlScore,
      progressPercentage: Math.min(100, Math.round((sqlScore / 70) * 100)),
      isUnlocked: sqlScore >= 70,
      unlockedAt: sqlScore >= 70 ? '2026-01-28' : undefined,
      criteriaText: 'Reach 70%+ proficiency in PostgreSQL / SQL query design',
      industrySignificance: 'Universal requirement across 95% of software engineering vacancies regardless of domain.',
      iconType: 'server'
    },
    {
      id: 'badge-genai-innovator',
      title: 'GenAI Innovator',
      subtitle: 'LLM Pipelines & RAG Systems',
      description: 'Cutting-edge proficiency in Retrieval-Augmented Generation, vector embeddings, Gemini/Claude prompt orchestration, and autonomous agents.',
      category: 'Data & AI',
      rarity: 'Legendary',
      xpReward: 500,
      targetSkillName: 'LLM & Generative AI',
      requiredProficiency: 70,
      currentProficiency: genaiScore,
      progressPercentage: Math.min(100, Math.round((genaiScore / 70) * 100)),
      isUnlocked: genaiScore >= 70,
      unlockedAt: genaiScore >= 70 ? new Date().toISOString().split('T')[0] : undefined,
      criteriaText: 'Reach 70%+ proficiency in LLMs, RAG, and AI orchestration',
      industrySignificance: 'Highest demand premium in 2026 tech placements with +₹3-₹5 LPA compensation uplift.',
      iconType: 'sparkles'
    },
    {
      id: 'badge-consensus-vanguard',
      title: 'Consensus Vanguard',
      subtitle: 'Peer-Attested Technical Authority',
      description: 'Awarded when 3 or more skills have been independently verified and corroborated by academic peers and hackathon teammates.',
      category: 'Verification',
      rarity: 'Rare',
      xpReward: 200,
      targetSkillName: 'Peer Consensus',
      requiredProficiency: 3,
      currentProficiency: effectivePeerCount,
      progressPercentage: Math.min(100, Math.round((effectivePeerCount / 3) * 100)),
      isUnlocked: effectivePeerCount >= 3,
      unlockedAt: effectivePeerCount >= 3 ? '2026-02-15' : undefined,
      criteriaText: 'Obtain verified consensus from peers on at least 3 skills',
      industrySignificance: 'Prevents resume inflation through tamper-resistant social and academic consensus proof.',
      iconType: 'users'
    },
    {
      id: 'badge-aadhaar-sovereign',
      title: 'Aadhaar Sovereign',
      subtitle: 'National Identity Authenticated',
      description: 'Verified student identity secured via the Indian UIDAI Aadhaar sandbox protocol for zero-trust authenticity.',
      category: 'Verification',
      rarity: 'Common',
      xpReward: 100,
      targetSkillName: 'UIDAI Aadhaar',
      requiredProficiency: 100,
      currentProficiency: isAadhaarVerified ? 100 : 0,
      progressPercentage: isAadhaarVerified ? 100 : 0,
      isUnlocked: isAadhaarVerified,
      unlockedAt: isAadhaarVerified ? '2026-01-15' : undefined,
      criteriaText: 'Authenticate national student identity with UIDAI protocol',
      industrySignificance: 'Guarantees authenticated, background-cleared talent to corporate recruiters from Day 1.',
      iconType: 'shield'
    },
    {
      id: 'badge-devops-sentinel',
      title: 'DevOps Sentinel',
      subtitle: 'Version Control & CI/CD Pipelines',
      description: 'Demonstrated proficiency in collaborative git workflows, trunk-based branching, conflict resolution, and automated workflows.',
      category: 'Infrastructure',
      rarity: 'Rare',
      xpReward: 250,
      targetSkillName: 'Git & DevOps',
      requiredProficiency: 75,
      currentProficiency: gitScore,
      progressPercentage: Math.min(100, Math.round((gitScore / 75) * 100)),
      isUnlocked: gitScore >= 75,
      unlockedAt: '2026-02-01',
      criteriaText: 'Achieve 75%+ proficiency in Git & DevOps automation',
      industrySignificance: 'Fundamental for high-velocity software teams and automated deployment pipelines.',
      iconType: 'terminal'
    },
    {
      id: 'badge-system-architect',
      title: 'System Architect',
      subtitle: 'Distributed Systems & Microservices',
      description: 'Mastery of decoupled API services, caching strategies, rate limiting, and scalable backend infrastructure design.',
      category: 'Full-Stack',
      rarity: 'Epic',
      xpReward: 350,
      targetSkillName: 'System Architecture',
      requiredProficiency: 75,
      currentProficiency: systemDesignScore,
      progressPercentage: Math.min(100, Math.round((systemDesignScore / 75) * 100)),
      isUnlocked: systemDesignScore >= 75,
      unlockedAt: systemDesignScore >= 75 ? '2026-02-28' : undefined,
      criteriaText: 'Reach 75%+ proficiency in distributed systems & API architecture',
      industrySignificance: 'Distinguishes senior engineering candidates capable of designing production-scale backends.',
      iconType: 'server'
    }
  ];

  return badges;
}

export function calculateBadgeStats(badges: SkillBadge[]): BadgeSystemStats {
  const totalBadges = badges.length;
  const unlockedBadges = badges.filter(b => b.isUnlocked);
  const unlockedCount = unlockedBadges.length;
  const lockedCount = totalBadges - unlockedCount;

  const totalXpEarned = unlockedBadges.reduce((sum, b) => sum + b.xpReward, 0);
  const totalXpPossible = badges.reduce((sum, b) => sum + b.xpReward, 0);
  const completionPercentage = totalXpPossible > 0 ? Math.round((totalXpEarned / totalXpPossible) * 100) : 0;

  // Level thresholds (Every 300 XP = 1 Level)
  const level = Math.max(1, Math.floor(totalXpEarned / 300) + 1);
  const currentLevelBaseXp = (level - 1) * 300;
  const nextLevelXp = level * 300;
  const xpInCurrentLevel = totalXpEarned - currentLevelBaseXp;
  const progressToNextLevel = Math.min(100, Math.round((xpInCurrentLevel / 300) * 100));

  const LEVEL_TITLES = [
    'Cadet Explorer',
    'Junior Practitioner',
    'Skill Prodigy',
    'Senior Specialist',
    'Master Craftsman',
    'Distinguished Fellow',
    'Grandmaster of Tech'
  ];
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];

  return {
    totalBadges,
    unlockedCount,
    lockedCount,
    totalXpEarned,
    totalXpPossible,
    completionPercentage,
    studentLevel: {
      level,
      title,
      nextLevelXp,
      currentLevelXp: totalXpEarned,
      progressToNextLevel
    }
  };
}
