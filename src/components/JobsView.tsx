import React, { useState } from 'react';
import { JobOpening, StudentProfile } from '../types';
import {
  Briefcase,
  Search,
  Building2,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ShieldCheck,
  Send
} from 'lucide-react';

interface JobsViewProps {
  jobs: JobOpening[];
  student: StudentProfile;
  selectedJobId?: string;
  onSelectJob?: (jobId: string) => void;
  onApplyJob: (jobId: string) => void;
  onOpenPassport: () => void;
  onSimulateSkill: (skillName: string) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({
  jobs,
  student,
  selectedJobId,
  onSelectJob,
  onApplyJob,
  onOpenPassport,
  onSimulateSkill
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState('ALL');
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({
    'job-technova-01': true
  });
  const [selectedJob, setSelectedJob] = useState<JobOpening>(() => {
    if (selectedJobId) {
      const match = jobs.find(j => j.id === selectedJobId);
      if (match) return match;
    }
    return jobs[0];
  });

  // Keep selectedJob in sync with external selectedJobId (e.g. from notification dropdown)
  React.useEffect(() => {
    if (selectedJobId) {
      const match = jobs.find(j => j.id === selectedJobId);
      if (match) {
        setSelectedJob(match);
      }
    }
  }, [selectedJobId, jobs]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.roleCategory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = selectedWorkMode === 'ALL' || job.workMode === selectedWorkMode;
    return matchesSearch && matchesMode;
  });

  const handleApply = (jobId: string) => {
    setAppliedJobs(prev => ({ ...prev, [jobId]: true }));
    onApplyJob(jobId);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="crextio-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-emerald-600" />
              Verified Job & Internship Opportunities
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
              Live AI Match Scoring
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Browse verified openings from hiring partners. Your Skill Passport is automatically attached on application.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search title, company, skills..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 w-48 sm:w-60"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {['ALL', 'Hybrid', 'Remote', 'On-Site'].map(mode => (
            <button
              key={mode}
              onClick={() => setSelectedWorkMode(mode)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer ${
                selectedWorkMode === mode
                  ? 'bg-[#071f1a] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {mode === 'ALL' ? 'All Work Modes' : mode}
            </button>
          ))}
        </div>

        {(searchQuery || selectedWorkMode !== 'ALL') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedWorkMode('ALL');
            }}
            className="text-xs text-emerald-700 hover:underline font-bold px-2 py-1 cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Main Grid: Job Cards (Col 7) + Detailed Match & Requirements Drawer (Col 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Job Cards List (Col 7) */}
        <div className="lg:col-span-7 space-y-3.5">
          {filteredJobs.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
              <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-800 text-sm">No job openings found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching with a different skill, title, or work mode filter.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedWorkMode('ALL');
                }}
                className="mt-4 px-4 py-2 bg-[#071f1a] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredJobs.map(job => {
              const isApplied = appliedJobs[job.id];
              const isSelected = selectedJob?.id === job.id;
              const matchPercent = job.id.includes('technova') ? 64 : job.id.includes('razorpay') ? 72 : 70;

              return (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    onSelectJob?.(job.id);
                  }}
                  className={`p-5 rounded-3xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/15'
                      : 'crextio-card hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={job.companyLogo}
                        alt={job.companyName}
                        className="w-10 h-10 rounded-2xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900">{job.title}</h3>
                        <p className="text-xs font-semibold text-emerald-700">{job.companyName}</p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {matchPercent}% Match
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                      <span className="font-bold text-slate-700">{job.packageRange}</span>
                    </div>

                    {isApplied ? (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Applied with Passport
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(job.id);
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Quick Apply</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Job Detail & Skill Match Diagnostic (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedJob && (
            <div className="crextio-card p-6 border-emerald-200/80 bg-white shadow-lg sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Position Details</span>
                  <h3 className="font-extrabold text-base text-slate-900">{selectedJob.title}</h3>
                  <p className="text-xs text-emerald-700 font-semibold">{selectedJob.companyName}</p>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  {selectedJob.workMode}
                </span>
              </div>

              {/* Match Diagnostic Matrix */}
              <div className="mb-4">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Skill Requirement Diagnostic:
                </span>
                <div className="space-y-2">
                  {selectedJob.requiredSkills.map(req => {
                    const studentSkill = student.skills.find(
                      s => s.skillName.toLowerCase() === req.skillName.toLowerCase()
                    );
                    const isMet = studentSkill && studentSkill.proficiencyScore >= req.minProficiency;

                    return (
                      <div
                        key={req.skillId}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                          isMet ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isMet ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <div>
                            <span className="font-bold text-slate-900">{req.skillName}</span>
                            <span className="text-[10px] text-slate-500 block">Required: {req.minProficiency}/100</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">
                            You: {studentSkill ? studentSkill.proficiencyScore : 0}/100
                          </span>
                          {!isMet && (
                            <button
                              onClick={() => onSimulateSkill(req.skillName)}
                              className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                            >
                              Simulate
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Education & Experience */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1 mb-4">
                <div><strong>Eligibility:</strong> {selectedJob.educationRequirement}</div>
                <div><strong>Experience:</strong> {selectedJob.experienceRequired}</div>
                <div><strong>Compensation:</strong> {selectedJob.packageRange}</div>
              </div>

              {/* Apply Action */}
              <div className="space-y-2">
                {appliedJobs[selectedJob.id] ? (
                  <div className="w-full py-2.5 bg-emerald-100 text-emerald-900 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-1.5 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Application Submitted with Skill Passport
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(selectedJob.id)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-200" />
                    Apply with Verified Skill Passport
                  </button>
                )}

                <button
                  onClick={onOpenPassport}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  View Attached Skill Passport (QR ID: PASS-2026-ARUN-8921)
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
