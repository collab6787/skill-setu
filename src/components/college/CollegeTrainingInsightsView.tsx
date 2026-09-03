import React from 'react';
import {
  BookOpen,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  ArrowRight
} from 'lucide-react';

export const CollegeTrainingInsightsView: React.FC = () => {
  const trainingPrograms = [
    {
      title: 'Docker & Kubernetes in Higher Education',
      target: 'Faculty & Final Year Students',
      duration: '4-Week Intensive Cohort',
      mode: 'Hybrid Lab + Hands-on Terminal',
      enrolled: 240,
      skillsCovered: ['Containerization', 'Microservices', 'Kubernetes Helm'],
      status: 'Active • Week 2'
    },
    {
      title: 'Applied Generative AI & Vector Search Systems',
      target: 'CSE & AI/DS Faculty Development',
      duration: '2-Week Masterclass',
      mode: 'Online Hands-on Workshop',
      enrolled: 48,
      skillsCovered: ['RAG Architectures', 'ChromaDB', 'LLM Fine-Tuning'],
      status: 'Upcoming • Starts Next Monday'
    },
    {
      title: 'High-Throughput FastAPI & Distributed Systems',
      target: 'Pre-final Year Students (Class of 2027)',
      duration: '6-Week Bridge Course',
      mode: 'In-Campus Lab',
      enrolled: 380,
      skillsCovered: ['Async Python', 'Pydantic v2', 'PostgreSQL Connection Pooling'],
      status: 'Enrolling Now'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Institutional Upskilling
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Training Recommendations & Faculty Bootcamps
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Bridge flagged campus skill deficits through accredited faculty development programs and student intensive bootcamps.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Total Active Learners</span>
          <span className="text-3xl font-black text-emerald-400">668</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">Students & Faculty Enrolled</span>
        </div>
      </div>

      {/* Program Cards */}
      <div className="space-y-4">
        {trainingPrograms.map(p => (
          <div
            key={p.title}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {p.status}
                </span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {p.duration}
                </span>
                <span className="text-xs text-slate-500 font-medium">({p.mode})</span>
              </div>

              <h3 className="font-bold text-base text-slate-900">{p.title}</h3>
              <p className="text-xs text-slate-500">Audience: <strong className="text-slate-700">{p.target}</strong> • {p.enrolled} Participants</p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {p.skillsCovered.map(sk => (
                  <span
                    key={sk}
                    className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full md:w-auto shrink-0">
              <button className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer">
                Manage Enrollment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
