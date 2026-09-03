import React, { useState } from 'react';
import { StudentProfile, JobOpening } from '../types';
import {
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  MapPin,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface StudentCompanyMatchingViewProps {
  student: StudentProfile;
  jobs: JobOpening[];
  onOpenJobs?: () => void;
  onOpenPassport?: () => void;
}

export const StudentCompanyMatchingView: React.FC<StudentCompanyMatchingViewProps> = ({
  student,
  jobs,
  onOpenJobs,
  onOpenPassport
}) => {
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  const handleApply = (jobId: string) => {
    setAppliedJobs(prev => new Set(prev).add(jobId));
  };

  const matchedCompanies = [
    {
      companyId: 'comp-technova',
      companyName: 'TechNova AI Labs',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
      matchScore: 94,
      role: 'AI Solutions Engineer',
      location: 'Bengaluru / Hybrid',
      package: '₹10 – ₹14 LPA',
      matchedSkills: ['Python (95%)', 'FastAPI (88%)', 'Scikit-Learn (82%)'],
      missingSkills: ['Docker (Beginner)'],
      cultureFit: 'High • Fast-paced AI engineering team',
      jobId: 'job-technova-01'
    },
    {
      companyId: 'comp-cloudscale',
      companyName: 'CloudScale Networks',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=128',
      matchScore: 88,
      role: 'Backend Systems Developer',
      location: 'Hyderabad / On-site',
      package: '₹9 – ₹12.5 LPA',
      matchedSkills: ['Python (95%)', 'FastAPI (88%)', 'PostgreSQL (80%)'],
      missingSkills: ['Kubernetes'],
      cultureFit: 'High • Distributed systems focus',
      jobId: 'job-cloudscale-02'
    },
    {
      companyId: 'comp-cybershield',
      companyName: 'CyberShield Systems',
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=128',
      matchScore: 79,
      role: 'Security & Python Automation Specialist',
      location: 'Chennai / Remote',
      package: '₹8.5 – ₹11 LPA',
      matchedSkills: ['Python (95%)', 'Network Protocols (75%)'],
      missingSkills: ['Zero-Trust Architecture'],
      cultureFit: 'Medium • Rigorous audit environment',
      jobId: 'job-cybershield-03'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <Building2 className="w-3.5 h-3.5" /> AI Recruiter Matching
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Matched Companies for You
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            3 verified enterprise recruiters currently match your profile and are actively scouting Skill Passport holders.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Top Recruiter Match</span>
          <span className="text-3xl font-black text-emerald-400">94%</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">TechNova AI Labs</span>
        </div>
      </div>

      {/* Matching Companies Cards */}
      <div className="space-y-4">
        {matchedCompanies.map(comp => {
          const isApplied = appliedJobs.has(comp.jobId);

          return (
            <div
              key={comp.companyId}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={comp.logo}
                  alt={comp.companyName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-slate-900">{comp.companyName}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                      {comp.matchScore}% Match
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {comp.location}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-700">{comp.role}</p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                    <span className="font-bold text-emerald-700">{comp.package}</span>
                    <span>•</span>
                    <span>Culture: {comp.cultureFit}</span>
                  </div>

                  {/* Skills Alignment */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs">
                    <span className="text-slate-400 font-semibold">Matched:</span>
                    {comp.matchedSkills.map(s => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-medium text-[11px]"
                      >
                        ✓ {s}
                      </span>
                    ))}
                    <span className="text-slate-400 font-semibold ml-2">Missing:</span>
                    {comp.missingSkills.map(s => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 font-medium text-[11px]"
                      >
                        ! {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
                <button
                  onClick={() => handleApply(comp.jobId)}
                  disabled={isApplied}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                    isApplied
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isApplied ? 'Application Sent ✓' : '1-Click Apply with Passport'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
