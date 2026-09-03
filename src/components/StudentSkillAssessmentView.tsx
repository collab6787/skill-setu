import React, { useState } from 'react';
import { StudentProfile } from '../types';
import {
  Award,
  CheckCircle2,
  Clock,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

interface StudentSkillAssessmentViewProps {
  student: StudentProfile;
  onSimulateSkillBoost?: (skillName: string, delta: number) => void;
  onOpenSimulator?: (skillName: string) => void;
}

interface AssessmentItem {
  id: string;
  title: string;
  skill: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionsCount: number;
  durationMinutes: number;
  bestScore?: number;
  status: 'COMPLETED' | 'AVAILABLE' | 'RECOMMENDED';
  questions: {
    q: string;
    options: string[];
    answer: number;
  }[];
}

const SAMPLE_ASSESSMENTS: AssessmentItem[] = [
  {
    id: 'as-01',
    title: 'Python Advanced & Asynchronous Coroutines',
    skill: 'Python',
    difficulty: 'Advanced',
    questionsCount: 3,
    durationMinutes: 10,
    bestScore: 92,
    status: 'COMPLETED',
    questions: [
      {
        q: 'What is the primary difference between asyncio.gather() and asyncio.wait()?',
        options: [
          'asyncio.gather returns results in order; asyncio.wait returns completed/pending sets',
          'asyncio.wait is blocking while gather is asynchronous',
          'asyncio.gather only works on Windows operating systems',
          'There is no functional difference'
        ],
        answer: 0
      },
      {
        q: 'Which Python GIL characteristic enables multi-threading IO-bound gains?',
        options: [
          'Thread execution automatically halts CPU instructions',
          'GIL is released during blocking syscalls and socket I/O',
          'Bytecode interprets without GIL on modern CPython',
          'Threads run in isolated memory heaps'
        ],
        answer: 1
      },
      {
        q: 'What does a generator function return when invoked?',
        options: ['A generator iterator object', 'The finalized list of values', 'NoneType', 'A coroutine task wrapper'],
        answer: 0
      }
    ]
  },
  {
    id: 'as-02',
    title: 'FastAPI Microservice High-Throughput Architecture',
    skill: 'FastAPI',
    difficulty: 'Advanced',
    questionsCount: 3,
    durationMinutes: 12,
    bestScore: 88,
    status: 'COMPLETED',
    questions: [
      {
        q: 'In FastAPI, why define normal "def" instead of "async def" for CPU-heavy tasks?',
        options: [
          'FastAPI automatically runs regular def endpoints in an external threadpool',
          'Regular def prevents memory leaks in Python 3.12',
          'async def cannot use SQL database clients',
          'Regular def bypasses Pydantic schema validation'
        ],
        answer: 0
      },
      {
        q: 'How does Dependency Injection (Depends) manage database session lifecycles?',
        options: [
          'It creates a permanent singleton connection for all requests',
          'It utilizes generator yields to guarantee cleanup after request response',
          'It calls garbage collector every 2 seconds',
          'It converts SQLite into PostgreSQL'
        ],
        answer: 1
      },
      {
        q: 'Which ASGI web server is standard for FastAPI production deployments?',
        options: ['Uvicorn / Gunicorn', 'Apache Tomcat', 'Nginx FastCGI', 'Node PM2'],
        answer: 0
      }
    ]
  },
  {
    id: 'as-03',
    title: 'Docker Containerization & Kubernetes Orchestration',
    skill: 'Docker',
    difficulty: 'Intermediate',
    questionsCount: 3,
    durationMinutes: 15,
    status: 'RECOMMENDED',
    questions: [
      {
        q: 'What is the primary benefit of multi-stage Docker builds?',
        options: [
          'Drastically reduced final image size by discarding build tools',
          'Ability to run both Linux and Windows in one container',
          'Automatic Kubernetes pod auto-scaling',
          'Bypassing root permissions on the host system'
        ],
        answer: 0
      },
      {
        q: 'What is the difference between ENTRYPOINT and CMD in a Dockerfile?',
        options: [
          'ENTRYPOINT sets default binary; CMD provides default arguments that can be overridden',
          'ENTRYPOINT only works for Python applications',
          'CMD compiles the binary at container start time',
          'They are exact aliases with no semantic differences'
        ],
        answer: 0
      },
      {
        q: 'Which Kubernetes resource manages rolling updates and replica sets?',
        options: ['Deployment', 'ConfigMap', 'Ingress Controller', 'PersistentVolumeClaim'],
        answer: 0
      }
    ]
  }
];

export const StudentSkillAssessmentView: React.FC<StudentSkillAssessmentViewProps> = ({
  student,
  onSimulateSkillBoost,
  onOpenSimulator
}) => {
  const [activeQuiz, setActiveQuiz] = useState<AssessmentItem | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const startQuiz = (assessment: AssessmentItem) => {
    setActiveQuiz(assessment);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setLastScore(null);
  };

  const submitQuiz = () => {
    if (!activeQuiz) return;
    let correct = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correct++;
      }
    });
    const percentage = Math.round((correct / activeQuiz.questions.length) * 100);
    setLastScore(percentage);
    setQuizSubmitted(true);

    if (onSimulateSkillBoost && percentage >= 60) {
      onSimulateSkillBoost(activeQuiz.skill, 10);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI Diagnostic Assessments
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Skill Assessment Center
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Take official skill diagnostics to benchmark your proficiency against industry standard tests.
            Scores above 75% automatically generate verifiable credentials on your Skill Passport.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Average Assessment Score</span>
          <span className="text-3xl font-black text-emerald-400">90%</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">Top 5% in AI Engineering</span>
        </div>
      </div>

      {/* Active Quiz Modal/Panel */}
      {activeQuiz && (
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500 shadow-xl space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active Assessment</span>
              <h3 className="text-lg font-black text-slate-900">{activeQuiz.title}</h3>
            </div>
            <button
              onClick={() => setActiveQuiz(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              Close
            </button>
          </div>

          {!quizSubmitted ? (
            <div className="space-y-6">
              {activeQuiz.questions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <p className="font-bold text-sm text-slate-900">
                    <span className="text-emerald-600 mr-1.5">Q{idx + 1}.</span> {q.q}
                  </p>
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => (
                      <label
                        key={optIdx}
                        className={`flex items-center gap-3 p-3 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                          selectedAnswers[idx] === optIdx
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${idx}`}
                          checked={selectedAnswers[idx] === optIdx}
                          onChange={() => setSelectedAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(selectedAnswers).length < activeQuiz.questions.length}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                >
                  Submit Assessment
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">Assessment Complete!</h4>
                <p className="text-xs text-slate-500 mt-1">Your response has been verified and recorded.</p>
              </div>
              <div className="inline-block px-5 py-2.5 bg-emerald-50 border border-emerald-300 rounded-2xl">
                <span className="text-xs text-slate-600 block font-semibold">Your Score</span>
                <span className="text-3xl font-black text-emerald-700">{lastScore}%</span>
              </div>
              <p className="text-xs text-emerald-800 font-bold">
                ✓ Skill proficiency score boosted by +10 points on your Skill Passport!
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List of Assessments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SAMPLE_ASSESSMENTS.map(as => (
          <div
            key={as.id}
            className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
              as.status === 'RECOMMENDED'
                ? 'border-emerald-400 ring-2 ring-emerald-400/20 shadow-md'
                : 'border-slate-200/80 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    as.status === 'COMPLETED'
                      ? 'bg-teal-100 text-teal-800'
                      : as.status === 'RECOMMENDED'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {as.status === 'RECOMMENDED' ? '★ Recommended Next' : as.status}
                </span>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {as.durationMinutes} mins
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 leading-snug">{as.title}</h3>
              <p className="text-xs text-slate-500 mt-1">Skill domain: <strong className="text-slate-700">{as.skill}</strong></p>

              {as.bestScore && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Verified Best Score</span>
                  <span className="font-black text-emerald-700">{as.bestScore}%</span>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => startQuiz(as)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {as.status === 'COMPLETED' ? 'Retake Test' : 'Start Assessment'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
