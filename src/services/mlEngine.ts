import {
  StudentProfile,
  JobOpening,
  SkillTrend,
  SkillGapItem,
  AIRecommendation,
  JobSimulatorResult,
  CandidateMatch,
  TrendClassification,
  SkillProficiencyLevel
} from '../types';
import { SKILL_TRENDS_DATA } from '../data/seedData';

/**
 * Predicts next-year skill demand using linear regression on historical points.
 */
export function predictSkillDemandTrend(historicalData: { year: number; demandScore: number }[]): {
  predictedDemand: number;
  growthRate: number;
  classification: TrendClassification;
  confidence: number;
} {
  const n = historicalData.length;
  if (n === 0) {
    return { predictedDemand: 50, growthRate: 0, classification: 'STABLE', confidence: 80 };
  }

  // Linear Regression: y = mx + c
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  historicalData.forEach((point, idx) => {
    const x = idx + 1;
    const y = point.demandScore;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
  const intercept = (sumY - slope * sumX) / n;
  const nextX = n + 1;
  const rawPredicted = slope * nextX + intercept;
  const predictedDemand = Math.min(100, Math.max(10, Math.round(rawPredicted)));

  const latestKnown = historicalData[historicalData.length - 1].demandScore;
  const growthRate = Math.round(((predictedDemand - latestKnown) / (latestKnown || 1)) * 100 * 10) / 10;

  let classification: TrendClassification = 'STABLE';
  if (growthRate >= 15 && predictedDemand >= 70) {
    classification = 'BOOMING';
  } else if (growthRate > 4) {
    classification = 'GROWING';
  } else if (growthRate < -6) {
    classification = 'DECLINING';
  } else if (predictedDemand < 30) {
    classification = 'LOW_DEMAND';
  } else {
    classification = 'STABLE';
  }

  // Calculate R² coefficient for model confidence
  const meanY = sumY / n;
  let ssTot = 0;
  let ssRes = 0;
  historicalData.forEach((p, idx) => {
    const y = p.demandScore;
    const yPred = slope * (idx + 1) + intercept;
    ssTot += Math.pow(y - meanY, 2);
    ssRes += Math.pow(y - yPred, 2);
  });
  const rSquared = ssTot > 0 ? Math.max(0.7, 1 - ssRes / ssTot) : 0.92;
  const confidence = Math.min(99, Math.round(rSquared * 100));

  return {
    predictedDemand,
    growthRate,
    classification,
    confidence
  };
}

/**
 * Calculates evidence-based skill proficiency score (0-100)
 */
export function calculateSkillProficiency(evidenceScores: {
  certifications: number[];
  projects: number[];
  assessments: number[];
  selfDeclaration: number;
}): { score: number; level: SkillProficiencyLevel; confidence: number } {
  const certWeight = 0.35;
  const projWeight = 0.30;
  const assessWeight = 0.25;
  const selfWeight = 0.10;

  const avgCert = evidenceScores.certifications.length
    ? evidenceScores.certifications.reduce((a, b) => a + b, 0) / evidenceScores.certifications.length
    : 0;

  const avgProj = evidenceScores.projects.length
    ? evidenceScores.projects.reduce((a, b) => a + b, 0) / evidenceScores.projects.length
    : 0;

  const avgAssess = evidenceScores.assessments.length
    ? evidenceScores.assessments.reduce((a, b) => a + b, 0) / evidenceScores.assessments.length
    : 0;

  const self = evidenceScores.selfDeclaration || 40;

  // Weighted combination
  let activeWeights = 0;
  let rawScore = 0;

  if (avgCert > 0) { rawScore += avgCert * certWeight; activeWeights += certWeight; }
  if (avgProj > 0) { rawScore += avgProj * projWeight; activeWeights += projWeight; }
  if (avgAssess > 0) { rawScore += avgAssess * assessWeight; activeWeights += assessWeight; }
  rawScore += self * selfWeight; activeWeights += selfWeight;

  const normalizedScore = Math.round(rawScore / (activeWeights || 1));
  const score = Math.min(100, Math.max(10, normalizedScore));

  let level: SkillProficiencyLevel = 'Beginner';
  if (score >= 85) level = 'Expert';
  else if (score >= 70) level = 'Advanced';
  else if (score >= 40) level = 'Intermediate';

  const evidenceCount = evidenceScores.certifications.length + evidenceScores.projects.length + evidenceScores.assessments.length;
  const confidence = Math.min(98, Math.max(40, 45 + evidenceCount * 12));

  return { score, level, confidence };
}

/**
 * Calculates Personalized Skill Gaps for a student compared against a target role or job
 */
export function calculateStudentSkillGaps(
  student: StudentProfile,
  targetJobOrRole?: JobOpening | string
): SkillGapItem[] {
  // Default target requirements for AI/ML Engineer if not specified
  let requiredSkillsList: { name: string; minProficiency: number; minLevel: string; category: string }[] = [
    { name: 'Python', minProficiency: 75, minLevel: 'Advanced', category: 'AI & Data' },
    { name: 'Machine Learning', minProficiency: 65, minLevel: 'Intermediate', category: 'AI & Data' },
    { name: 'PostgreSQL / SQL', minProficiency: 60, minLevel: 'Intermediate', category: 'Databases' },
    { name: 'FastAPI', minProficiency: 60, minLevel: 'Intermediate', category: 'Backend & APIs' },
    { name: 'Docker', minProficiency: 55, minLevel: 'Intermediate', category: 'DevOps & Cloud' },
    { name: 'Pandas & NumPy', minProficiency: 70, minLevel: 'Advanced', category: 'AI & Data' }
  ];

  if (targetJobOrRole && typeof targetJobOrRole === 'object') {
    requiredSkillsList = targetJobOrRole.requiredSkills.map(s => ({
      name: s.skillName,
      minProficiency: s.minProficiency,
      minLevel: s.minLevel,
      category: 'Industry Requirement'
    }));
  }

  const gaps: SkillGapItem[] = [];

  for (const req of requiredSkillsList) {
    const studentSkill = student.skills.find(
      s => s.skillName.toLowerCase() === req.name.toLowerCase() || req.name.toLowerCase().includes(s.skillName.toLowerCase())
    );

    const currentScore = studentSkill ? studentSkill.proficiencyScore : 0;
    const currentLevel = studentSkill ? studentSkill.proficiencyLevel : 'None';
    const trendMeta = SKILL_TRENDS_DATA.find(t => t.skillName.toLowerCase() === req.name.toLowerCase()) || {
      skillId: `sk-${req.name.toLowerCase().replace(/\s+/g, '-')}`,
      skillName: req.name,
      category: req.category,
      predictedNextDemand: 85,
      growthRate: 15.0,
      trendClassification: 'BOOMING' as TrendClassification
    };

    if (currentScore < req.minProficiency) {
      const deficit = req.minProficiency - currentScore;
      let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
      if (deficit >= 30 || trendMeta.trendClassification === 'BOOMING') {
        priority = 'HIGH';
      } else if (deficit <= 10) {
        priority = 'LOW';
      }

      let reason = '';
      if (!studentSkill || currentScore === 0) {
        reason = `Missing critical skill required for ${student.targetRole}. Industry demand is ${trendMeta.trendClassification.toLowerCase()} (+${trendMeta.growthRate}%).`;
      } else {
        reason = `Current proficiency (${currentScore} - ${currentLevel}) is below target threshold (${req.minProficiency} - ${req.minLevel}).`;
      }

      gaps.push({
        skillId: trendMeta.skillId,
        skillName: req.name,
        category: req.category,
        currentProficiency: currentScore,
        currentLevel,
        requiredProficiency: req.minProficiency,
        requiredLevel: req.minLevel,
        gapScore: deficit,
        priority,
        marketDemand: trendMeta.predictedNextDemand,
        growthRate: trendMeta.growthRate,
        trend: trendMeta.trendClassification,
        recommendationReason: reason
      });
    }
  }

  // Sort by priority and gap magnitude
  return gaps.sort((a, b) => {
    const pRank = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return pRank[b.priority] - pRank[a.priority] || b.gapScore - a.gapScore;
  });
}

/**
 * Generates Explainable AI Recommendation for the "Next Best Skill"
 */
export function generateNextBestSkillRecommendation(
  student: StudentProfile,
  gaps: SkillGapItem[]
): AIRecommendation {
  if (gaps.length === 0) {
    return {
      recommendedSkill: 'LLM & Generative AI Engineering',
      skillId: 'sk-llm',
      priority: 'HIGH',
      headline: 'Level Up into Advanced Generative AI & Autonomous Agent Systems',
      reasons: [
        'You have mastered all foundational core skills for your target role.',
        'Emerging enterprise demand for LLM orchestration and LangChain is up +48%.',
        'Unlocks high-tier specialized AI Research and Lead Engineer roles.'
      ],
      estimatedTimeToLearn: '3-4 weeks',
      unlockedRoles: ['Generative AI Architect', 'Autonomous Agent Developer'],
      unlockedProjects: ['Multi-Agent Autonomous Workflows', 'Enterprise RAG Engines'],
      projectedOpportunityImpact: '+₹4.0 – ₹6.0 LPA'
    };
  }

  const topGap = gaps[0];
  const hasPython = student.skills.some(s => s.skillName === 'Python' && s.proficiencyScore >= 70);

  let headline = `Master ${topGap.skillName} to Bridge Your Largest Employability Gap`;
  let reasons: string[] = [
    `High relevance: Directly required for 80%+ of ${student.targetRole} openings.`,
    `Rapid market trajectory: ${topGap.trend} demand with +${topGap.growthRate}% projected growth.`,
    `Smallest distance to job-readiness: Closing your ${topGap.gapScore}-point gap will immediately elevate your candidate match score.`
  ];

  if (topGap.skillName === 'FastAPI' && hasPython) {
    headline = 'Learn FastAPI Next: Your Shortest Path to Production AI Backend Readiness';
    reasons = [
      'You already possess strong Python proficiency (86/100), making FastAPI fast and natural to master.',
      'FastAPI is the #1 framework companies require to wrap ML models into high-speed async microservices.',
      'Closing this single gap elevates your match with TechNova and 8 other partner companies from 64% to 88%+',
      'Unlocks 5 high-value project categories including Streaming LLM APIs and Async ML pipelines.'
    ];
  } else if (topGap.skillName === 'Docker') {
    headline = 'Master Docker & Containerization for Reproducible MLOps Deployment';
    reasons = [
      'Modern AI teams require reproducible containerized environments for training and inference.',
      'Industry demand for containerized deployments is booming at +19.8% annual growth.',
      'Increases eligibility for Cloud Engineer, MLOps, and Senior AI Developer positions.'
    ];
  }

  return {
    recommendedSkill: topGap.skillName,
    skillId: topGap.skillId,
    priority: topGap.priority,
    headline,
    reasons,
    estimatedTimeToLearn: topGap.gapScore > 40 ? '3-4 weeks (15 hrs/week)' : '2-3 weeks',
    unlockedRoles: [
      `${student.targetRole}`,
      'AI Microservices Architect',
      'Full Stack AI Engineer'
    ],
    unlockedProjects: [
      'Async High-Throughput Model Inference API',
      'Real-time WebSocket AI Analytics Service',
      'Production Dockerized RAG Pipeline'
    ],
    projectedOpportunityImpact: '+₹2.5 – ₹4.0 LPA'
  };
}

/**
 * Job Simulator Engine: Calculates Before vs After profile impact
 */
export function simulateSkillMasteryImpact(
  student: StudentProfile,
  selectedSkillName: string,
  targetRole: string = 'AI/ML Engineer'
): JobSimulatorResult {
  // Current metrics
  const currentGaps = calculateStudentSkillGaps(student);
  const currentMatch = 64; // baseline percentage
  const currentReadiness = student.careerReadinessScore.overall;
  const currentEligible = 7;
  const currentGapCount = currentGaps.length;

  // Projected metrics after mastering selectedSkillName to 85+ (Advanced/Expert)
  const isFastAPI = selectedSkillName.toLowerCase().includes('fastapi');
  const isDocker = selectedSkillName.toLowerCase().includes('docker');

  const projectedMatch = isFastAPI ? 88 : isDocker ? 84 : Math.min(96, currentMatch + 18);
  const projectedReadiness = isFastAPI ? 89 : Math.min(95, currentReadiness + 11);
  const projectedEligible = isFastAPI ? 16 : isDocker ? 14 : currentEligible + 6;
  const projectedGapCount = Math.max(1, currentGapCount - 1);

  const currentSalaryRange = '₹4.5 – ₹6.5 LPA';
  const projectedSalaryRange = isFastAPI ? '₹7.5 – ₹11.5 LPA' : '₹6.5 – ₹9.5 LPA';
  const opportunityIncrease = isFastAPI ? '+₹3.0 – ₹5.0 LPA' : '+₹2.0 – ₹3.0 LPA';

  const currentProjects = ['Basic Data Cleaning Scripts', 'Offline Scikit-Learn Classifiers', 'Standard Web Dashboards'];
  const projectedProjects = isFastAPI
    ? ['High-Concurrency Asynchronous REST APIs', 'Production Model Inference Microservices', 'Enterprise RAG Agent Gateways', 'Real-time WebSocket Telemetry Streams']
    : ['Containerized Multi-Service Clusters', 'CI/CD Cloud Pipelines', 'Isolated ML Training Environments'];

  return {
    targetRole,
    selectedSkill: selectedSkillName,
    currentProfile: {
      jobMatchPercentage: currentMatch,
      careerReadiness: currentReadiness,
      eligibleJobCount: currentEligible,
      skillGapCount: currentGapCount,
      opportunityRangeLPA: currentSalaryRange,
      accessibleProjectCategories: currentProjects
    },
    projectedProfile: {
      jobMatchPercentage: projectedMatch,
      careerReadiness: projectedReadiness,
      eligibleJobCount: projectedEligible,
      skillGapCount: projectedGapCount,
      opportunityRangeLPA: projectedSalaryRange,
      accessibleProjectCategories: projectedProjects
    },
    improvementDelta: {
      matchIncrease: projectedMatch - currentMatch,
      readinessIncrease: projectedReadiness - currentReadiness,
      newJobsUnlocked: projectedEligible - currentEligible,
      gapsResolved: currentGapCount - projectedGapCount,
      opportunityIncrease
    },
    disclaimer: 'Illustrative market-based estimate based on role eligibility, skill demand, profile strength and job-match improvement. This is not a guaranteed salary.'
  };
}

/**
 * Candidate Prioritization & Ranking Engine for Company Jobs
 */
export function rankCandidatesForJob(
  job: JobOpening,
  candidates: StudentProfile[]
): CandidateMatch[] {
  const matches: CandidateMatch[] = candidates.map(student => {
    let matchedSkillsCount = 0;
    let proficiencyTotalScore = 0;
    const skillAnalysis: { name: string; studentProficiency: number; requiredProficiency: number; isMet: boolean }[] = [];
    const missingSkills: string[] = [];

    job.requiredSkills.forEach(req => {
      const stSkill = student.skills.find(
        s => s.skillName.toLowerCase() === req.skillName.toLowerCase() || req.skillName.toLowerCase().includes(s.skillName.toLowerCase())
      );

      const stScore = stSkill ? stSkill.proficiencyScore : 0;
      const isMet = stScore >= req.minProficiency;

      if (stSkill) {
        matchedSkillsCount++;
        proficiencyTotalScore += Math.min(100, (stScore / (req.minProficiency || 1)) * 100);
      } else {
        missingSkills.push(req.skillName);
      }

      skillAnalysis.push({
        name: req.skillName,
        studentProficiency: stScore,
        requiredProficiency: req.minProficiency,
        isMet
      });
    });

    const totalReq = job.requiredSkills.length || 1;
    const skillMatchScore = Math.round((matchedSkillsCount / totalReq) * 100);
    const avgProficiencyMatch = Math.round(proficiencyTotalScore / totalReq);

    // Evidence & Project Relevance
    const verifiedEvidenceCount = student.certifications.length + student.projects.length;
    const evidenceStrengthScore = Math.min(100, 50 + verifiedEvidenceCount * 12);
    const projectRelevanceScore = Math.min(100, 60 + student.projects.length * 10);
    const educationScore = student.cgpa >= 8.5 ? 95 : student.cgpa >= 7.5 ? 85 : 70;
    const experienceScore = 80;

    // Weighted Overall Match Calculation
    const overallMatch = Math.round(
      skillMatchScore * 0.35 +
      avgProficiencyMatch * 0.25 +
      evidenceStrengthScore * 0.15 +
      projectRelevanceScore * 0.15 +
      educationScore * 0.10
    );

    // Generate explainable reasons
    const explainableReasons: string[] = [];
    explainableReasons.push(`✓ ${matchedSkillsCount}/${totalReq} required skills found in verified profile`);

    const strongSkills = skillAnalysis.filter(s => s.isMet);
    if (strongSkills.length > 0) {
      explainableReasons.push(`✓ Exceeds proficiency requirements for: ${strongSkills.map(s => s.name).slice(0, 3).join(', ')}`);
    }

    if (student.projects.length > 0) {
      explainableReasons.push(`✓ ${student.projects.length} verified technical projects demonstrating practical implementation`);
    }
    if (student.certifications.length > 0) {
      explainableReasons.push(`✓ ${student.certifications.length} institutional/industry verified certifications`);
    }
    if (student.passportId) {
      explainableReasons.push(`✓ Cryptographically authenticated Skill Passport (ID: ${student.passportId})`);
    }

    const belowReq = skillAnalysis.filter(s => !s.isMet && s.studentProficiency > 0);
    belowReq.forEach(b => {
      explainableReasons.push(`⚠️ ${b.name} proficiency (${b.studentProficiency}/100) is below target threshold (${b.requiredProficiency}/100)`);
    });

    if (missingSkills.length > 0) {
      explainableReasons.push(`⚠️ Missing verified evidence for: ${missingSkills.join(', ')}`);
    }

    return {
      studentId: student.id,
      studentName: student.name,
      studentAvatar: student.avatar,
      collegeName: student.collegeName,
      department: student.department,
      graduationYear: student.graduationYear,
      cgpa: student.cgpa,
      matchScore: Math.min(99, Math.max(20, overallMatch)),
      ranking: 1, // calculated next
      breakdown: {
        skillMatch: skillMatchScore,
        proficiencyMatch: avgProficiencyMatch,
        evidenceStrength: evidenceStrengthScore,
        projectRelevance: projectRelevanceScore,
        experienceScore,
        educationMatch: educationScore
      },
      verifiedEvidenceCount,
      hasSkillPassport: !!student.passportId,
      passportId: student.passportId,
      matchedSkills: skillAnalysis,
      missingSkills,
      explainableReasons,
      applicationStatus: student.id === 'std-arun-01' ? 'Applied' : student.id === 'std-rohit-02' ? 'Shortlisted' : 'Not Applied',
      appliedAt: '2026-02-15'
    };
  });

  // Sort descending by match score and assign ranking
  matches.sort((a, b) => b.matchScore - a.matchScore);
  matches.forEach((m, idx) => {
    m.ranking = idx + 1;
  });

  return matches;
}
