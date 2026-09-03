import React, { useState } from 'react';
import { StudentProfile } from '../types';
import {
  Compass,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  ChevronRight,
  Target
} from 'lucide-react';

interface StudentCareerRoadmapViewProps {
  student: StudentProfile;
  onOpenSimulator?: (skill: string) => void;
  onOpenEvidence?: () => void;
}

interface Milestone {
  id: string;
  phase: string;
  title: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
  description: string;
  skills: string[];
  estimatedWeeks: number;
  learningResources: { title: string; type: string }[];
}

const ROADMAP_STEPS: Milestone[] = [
  {
    id: 'm-01',
    phase: 'Phase 1 • Foundations',
    title: 'Modern Python & Async Architecture',
    status: 'COMPLETED',
    description: 'Data structures, algorithms, async programming, coroutines, and type hinting.',
    skills: ['Python', 'Data Structures', 'AsyncIO'],
    estimatedWeeks: 4,
    learningResources: [
      { title: 'Fluent Python 2nd Edition', type: 'Book' },
      { title: 'Python Async Coroutines Masterclass', type: 'Course' }
    ]
  },
  {
    id: 'm-02',
    phase: 'Phase 2 • Core Specialization',
    title: 'High-Throughput Microservices & Machine Learning',
    status: 'COMPLETED',
    description: 'FastAPI microservices, model serialization, Scikit-learn, PyTorch inference pipelines.',
    skills: ['FastAPI', 'Machine Learning', 'PyTorch'],
    estimatedWeeks: 6,
    learningResources: [
      { title: 'FastAPI in Production Architecture', type: 'Course' },
      { title: 'Full Stack Deep Learning', type: 'Hands-on Lab' }
    ]
  },
  {
    id: 'm-03',
    phase: 'Phase 3 • Next Recommended Step',
    title: 'Containerization, Docker & Cloud Infrastructure',
    status: 'IN_PROGRESS',
    description: 'Multi-stage Dockerfiles, Docker Compose, Kubernetes pods, AWS/GCP container deployment.',
    skills: ['Docker', 'Kubernetes', 'Cloud Deployment'],
    estimatedWeeks: 4,
    learningResources: [
      { title: 'Docker Mastery for Developers', type: 'Course' },
      { title: 'Production Container Orchestration Lab', type: 'Interactive Lab' }
    ]
  },
  {
    id: 'm-04',
    phase: 'Phase 4 • Industry Readiness',
    title: 'Real-Time Vector DBs & LLM Agent Orchestration',
    status: 'UPCOMING',
    description: 'Retrieval Augmented Generation (RAG), ChromaDB/Qdrant vector search, AI agent guardrails.',
    skills: ['LangChain', 'Vector DBs', 'RAG Pipelines'],
    estimatedWeeks: 5,
    learningResources: [
      { title: 'DeepLearning.AI Building Agentic RAG', type: 'Course' },
      { title: 'Enterprise Vector Search Patterns', type: 'Case Study' }
    ]
  }
];

export const StudentCareerRoadmapView: React.FC<StudentCareerRoadmapViewProps> = ({
  student,
  onOpenSimulator,
  onOpenEvidence
}) => {
  const [activeMilestone, setActiveMilestone] = useState<Milestone>(ROADMAP_STEPS[2]);

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <Compass className="w-3.5 h-3.5" /> Career Roadmap Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {student.targetRole} Roadmap
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            AI-curated progressive learning pathway engineered to bridge current verified skills to recruiter expectations.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Overall Progress</span>
          <span className="text-3xl font-black text-emerald-400">65%</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">2 of 4 Phases Completed</span>
        </div>
      </div>

      {/* Main Roadmap Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Timeline Steps */}
        <div className="lg:col-span-2 space-y-4">
          {ROADMAP_STEPS.map((step, idx) => {
            const isSelected = activeMilestone.id === step.id;

            return (
              <div
                key={step.id}
                onClick={() => setActiveMilestone(step)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-white border-emerald-500 ring-2 ring-emerald-400/30 shadow-md'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5">
                      {step.status === 'COMPLETED' ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : step.status === 'IN_PROGRESS' ? (
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center animate-pulse">
                          <Clock className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                          <Circle className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        {step.phase}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 mt-0.5">{step.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{step.description}</p>

                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        {step.skills.map(s => (
                          <span
                            key={s}
                            className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        step.status === 'COMPLETED'
                          ? 'bg-teal-100 text-teal-800'
                          : step.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {step.status === 'IN_PROGRESS' ? 'In Progress' : step.status}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1.5 font-medium">
                      ~{step.estimatedWeeks} weeks
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Milestone Details & Action */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Phase Breakdown
              </span>
              <Target className="w-4 h-4 text-emerald-600" />
            </div>

            <div>
              <h4 className="font-black text-base text-slate-900">{activeMilestone.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {activeMilestone.description}
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-800 mb-2">Curated Learning Content</h5>
              <div className="space-y-2">
                {activeMilestone.learningResources.map((res, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-700">{res.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
                      {res.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 space-y-2">
              {onOpenSimulator && (
                <button
                  onClick={() => onOpenSimulator(activeMilestone.skills[0] || 'Docker')}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> Practice in Job Simulator
                </button>
              )}
              {onOpenEvidence && (
                <button
                  onClick={onOpenEvidence}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4 text-slate-600" /> Submit Milestone Evidence
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
