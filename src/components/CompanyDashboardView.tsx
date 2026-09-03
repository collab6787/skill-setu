import React, { useState } from 'react';
import { JobOpening, CandidateMatch, StudentProfile } from '../types';
import { rankCandidatesForJob } from '../services/mlEngine';
import {
  Building2,
  Plus,
  Search,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';

interface CompanyDashboardViewProps {
  jobs: JobOpening[];
  candidates: StudentProfile[];
  onOpenPassport: (passportId: string) => void;
  onPostNewJob: (jobData: any) => void;
  onOpenFullJobEditor?: () => void;
}

export const CompanyDashboardView: React.FC<CompanyDashboardViewProps> = ({
  jobs,
  candidates,
  onOpenPassport,
  onPostNewJob,
  onOpenFullJobEditor
}) => {
  const [activeJobId, setActiveJobId] = useState<string>(jobs[0]?.id || '');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateMatch | null>(null);
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [candidateSearch, setCandidateSearch] = useState('');
  const [shortlistedMap, setShortlistedMap] = useState<Record<string, string>>({
    'std-rohit-02': 'Shortlisted'
  });

  // Sync activeJobId if jobs array changes and activeJobId is not found
  React.useEffect(() => {
    if (jobs.length > 0 && !jobs.some(j => j.id === activeJobId)) {
      setActiveJobId(jobs[0].id);
    }
  }, [jobs, activeJobId]);

  // New Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newRoleCategory, setNewRoleCategory] = useState('AI & Data Science');
  const [newLocation, setNewLocation] = useState('Bengaluru / Hybrid');
  const [newPackage, setNewPackage] = useState('₹8.0 – ₹12.0 LPA');
  const [newOpenings, setNewOpenings] = useState(3);
  const [newSkills, setNewSkills] = useState('Python, FastAPI, Machine Learning, Docker');

  const activeJob = jobs.find(j => j.id === activeJobId) || jobs[0];
  const allRanked = activeJob ? rankCandidatesForJob(activeJob, candidates) : [];
  const rankedCandidates = allRanked.filter(c => {
    if (!candidateSearch) return true;
    const q = candidateSearch.toLowerCase();
    return (
      c.studentName.toLowerCase().includes(q) ||
      c.collegeName.toLowerCase().includes(q)
    );
  });

  const showNotification = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  const handleShortlist = (studentId: string, status: string) => {
    setShortlistedMap(prev => ({ ...prev, [studentId]: status }));
    const cand = candidates.find(c => c.id === studentId);
    showNotification(`${cand ? cand.name : 'Candidate'} updated to "${status}"`);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const parsedSkills = newSkills.split(',').map(s => {
      const name = s.trim();
      return {
        skillId: `sk-${name.toLowerCase().replace(/\s+/g, '-')}`,
        skillName: name,
        minProficiency: 70,
        minLevel: 'Advanced' as const
      };
    });

    const newJobPayload = {
      title: newTitle,
      roleCategory: newRoleCategory,
      location: newLocation,
      packageRange: newPackage,
      openingsCount: newOpenings,
      requiredSkills: parsedSkills,
      workMode: 'Hybrid'
    };

    onPostNewJob(newJobPayload);
    showNotification(`New opening "${newTitle}" created and candidate rankings refreshed!`);

    setShowNewJobModal(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Dynamic Toast Feedback */}
      {feedbackToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-md transition-all animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedbackToast}</span>
          </div>
          <button
            onClick={() => setFeedbackToast(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="crextio-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-emerald-600" />
              Company Talent Intelligence & Candidate Prioritization
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
              Explainable AI Matching
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            TechNova AI Labs Talent Suite • Dynamic matching based on verified skill passports and cryptographic evidence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenFullJobEditor && (
            <button
              onClick={onOpenFullJobEditor}
              className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              Full Job Editor
            </button>
          )}
          <button
            onClick={() => setShowNewJobModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Post New Job Opening
          </button>
        </div>
      </div>

      {/* Job Selector Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none">
        {jobs.map(job => {
          const isActive = job.id === activeJobId;
          return (
            <button
              key={job.id}
              onClick={() => setActiveJobId(job.id)}
              className={`p-3.5 rounded-2xl text-left transition-all shrink-0 min-w-[240px] border cursor-pointer ${
                isActive
                  ? 'bg-[#071f1a] text-white border-emerald-800 shadow-md'
                  : 'bg-white/90 text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold truncate max-w-[170px]">{job.title}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {job.workMode}
                </span>
              </div>
              <div className={`text-[11px] ${isActive ? 'text-emerald-200/80' : 'text-slate-500'}`}>
                {job.packageRange} • {job.openingsCount} Openings
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Candidate Matching Table (Col 8) + Explainable Breakdown Drawer (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Ranked Candidate List (Col 8) */}
        <div className="lg:col-span-8 crextio-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                AI Prioritized Candidates for {activeJob.title}
              </h3>
              <p className="text-xs text-slate-500">
                Ranked dynamically by weighted skill, proficiency, evidence, and project relevance algorithms.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter candidates..."
                  value={candidateSearch}
                  onChange={e => setCandidateSearch(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-36 sm:w-44"
                />
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
                {rankedCandidates.length} Matched
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Candidate</th>
                  <th className="py-2.5 px-3 text-center">AI Match</th>
                  <th className="py-2.5 px-3">Evidence</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rankedCandidates.map(c => {
                  const status = shortlistedMap[c.studentId] || c.applicationStatus || 'Applied';
                  return (
                    <tr
                      key={c.studentId}
                      className="hover:bg-emerald-50/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedCandidate(c)}
                    >
                      <td className="py-3.5 px-3 font-extrabold text-slate-900">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          c.ranking === 1 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-700'
                        }`}>
                          #{c.ranking}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={c.studentAvatar}
                            alt={c.studentName}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <div>
                            <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                              {c.studentName}
                              {c.hasSkillPassport && (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" title="Verified Skill Passport" />
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">{c.collegeName.split('(')[0]} (CGPA: {c.cgpa})</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black ${
                          c.matchScore >= 85 ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : c.matchScore >= 60 ? 'bg-teal-100 text-teal-900 border border-teal-200' : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          {c.matchScore}%
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-slate-600">
                        <div className="font-semibold text-[11px]">{c.verifiedEvidenceCount} items</div>
                        <div className="text-[10px] text-emerald-700 font-medium">Passport Verified</div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : status === 'Interview Scheduled' ? 'bg-[#071f1a] text-emerald-300 border border-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {status}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCandidate(c);
                          }}
                          className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition-colors border border-emerald-200/60 cursor-pointer"
                        >
                          Audit Match
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explainable Match Diagnostic Drawer (Col 4) (Section 24) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedCandidate ? (
            <div className="crextio-card p-6 border-emerald-200 bg-white shadow-lg animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Why is {selectedCandidate.studentName} Ranked #{selectedCandidate.ranking}?
                </h4>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Overall Score Badge */}
              <div className="p-3 bg-emerald-50/90 rounded-2xl border border-emerald-200 text-center mb-4">
                <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Overall Match Index</div>
                <div className="text-3xl font-black text-emerald-950 mt-0.5">{selectedCandidate.matchScore}%</div>
                <div className="text-[10px] text-slate-500 mt-1">Weighted against {activeJob.requiredSkills.length} required competencies</div>
              </div>

              {/* Explainable Reasons Checklist (Section 24) */}
              <div className="space-y-2 mb-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Algorithm Score Breakdown
                </span>
                {selectedCandidate.explainableReasons.map((reason, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-xl text-xs leading-tight ${
                      reason.startsWith('✓') ? 'bg-emerald-50/80 text-emerald-900 font-medium border border-emerald-100' : 'bg-amber-50/80 text-amber-900 border border-amber-100'
                    }`}
                  >
                    {reason}
                  </div>
                ))}
              </div>

              {/* Action Pipeline Buttons */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onOpenPassport(selectedCandidate.studentId)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Audit Full Skill Passport
                </button>
                <button
                  onClick={() => handleShortlist(selectedCandidate.studentId, 'Shortlisted')}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer"
                >
                  Shortlist for TechNova AI Labs
                </button>
                <button
                  onClick={() => handleShortlist(selectedCandidate.studentId, 'Interview Scheduled')}
                  className="w-full py-2 bg-[#071f1a] hover:bg-[#0a2922] text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Schedule Technical Interview
                </button>
              </div>
            </div>
          ) : (
            <div className="crextio-card p-6 text-center text-slate-500 flex flex-col items-center justify-center min-h-[300px]">
              <Sparkles className="w-10 h-10 text-emerald-500 mb-2 opacity-60" />
              <h4 className="font-extrabold text-slate-800 text-sm">Explainable Match Inspector</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Click any candidate row to inspect real-time algorithm weighting and verification evidence.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Post a Job Modal (Section 21) */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                Post a New Opening (TechNova AI Labs)
              </h3>
              <button onClick={() => setShowNewJobModal(false)} className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Microservices Developer"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Role Category</label>
                  <select
                    value={newRoleCategory}
                    onChange={e => setNewRoleCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Backend & APIs">Backend & APIs</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Full Stack">Full Stack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Openings Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newOpenings}
                    onChange={e => setNewOpenings(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Location / Work Mode</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Package Range</label>
                  <input
                    type="text"
                    value={newPackage}
                    onChange={e => setNewPackage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={e => setNewSkills(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  placeholder="e.g. Python, FastAPI, Docker, SQL"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Candidates will be automatically scored and ranked across this skill vector.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-sm cursor-pointer"
                >
                  Publish & Rank Candidates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
