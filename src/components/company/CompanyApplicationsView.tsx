import React, { useState } from 'react';
import { JobOpening, StudentProfile } from '../../types';
import {
  Briefcase,
  Search,
  CheckCircle2,
  Clock,
  UserCheck,
  Award,
  Filter,
  FileBadge,
  Calendar,
  ChevronRight,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface CompanyApplicationsViewProps {
  jobs: JobOpening[];
  candidates: StudentProfile[];
  onOpenPassport?: (passportId: string) => void;
}

interface ApplicationItem {
  id: string;
  jobId: string;
  jobTitle: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  collegeName: string;
  matchScore: number;
  appliedDate: string;
  status: 'Applied' | 'Reviewing' | 'Shortlisted' | 'Interview Scheduled' | 'Offered' | 'Rejected';
  notes: string;
}

export const CompanyApplicationsView: React.FC<CompanyApplicationsViewProps> = ({
  jobs = [],
  candidates = [],
  onOpenPassport
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Local application state for interactive status changes
  const [applications, setApplications] = useState<ApplicationItem[]>([
    {
      id: 'app-01',
      jobId: jobs[0]?.id || 'job-01',
      jobTitle: jobs[0]?.title || 'Senior AI & Backend Systems Engineer',
      studentId: candidates[0]?.id || 'std-arun-01',
      studentName: candidates[0]?.name || 'Arun Kumar',
      studentAvatar: candidates[0]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      collegeName: candidates[0]?.collegeName || 'Anna University - CEG Campus',
      matchScore: 94,
      appliedDate: '2 days ago',
      status: 'Shortlisted',
      notes: 'Strong Python microservices evidence and verified Kaggle top 5% rank.'
    },
    {
      id: 'app-02',
      jobId: jobs[0]?.id || 'job-01',
      jobTitle: jobs[0]?.title || 'Senior AI & Backend Systems Engineer',
      studentId: candidates[1]?.id || 'std-rohit-02',
      studentName: candidates[1]?.name || 'Rohit Verma',
      studentAvatar: candidates[1]?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      collegeName: candidates[1]?.collegeName || 'IIT Madras',
      matchScore: 88,
      appliedDate: '3 days ago',
      status: 'Interview Scheduled',
      notes: 'Scheduled for System Design Round on Friday 3:00 PM.'
    },
    {
      id: 'app-03',
      jobId: jobs[1]?.id || 'job-02',
      jobTitle: jobs[1]?.title || 'Cloud Native Infrastructure Engineer',
      studentId: candidates[2]?.id || 'std-priya-03',
      studentName: candidates[2]?.name || 'Priya Sundaram',
      studentAvatar: candidates[2]?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
      collegeName: candidates[2]?.collegeName || 'PSG Tech Coimbatore',
      matchScore: 91,
      appliedDate: '4 days ago',
      status: 'Reviewing',
      notes: 'Reviewed Docker & Terraform certifications; passport verified.'
    },
    {
      id: 'app-04',
      jobId: jobs[1]?.id || 'job-02',
      jobTitle: jobs[1]?.title || 'Cloud Native Infrastructure Engineer',
      studentId: 'std-ananya-04',
      studentName: 'Ananya Deshmukh',
      studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
      collegeName: 'NIT Trichy',
      matchScore: 82,
      appliedDate: '5 days ago',
      status: 'Applied',
      notes: 'Application submitted with full peer attestation proofs.'
    }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStatusChange = (appId: string, newStatus: ApplicationItem['status']) => {
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: newStatus } : app))
    );
    const app = applications.find(a => a.id === appId);
    showToast(`Updated ${app?.studentName || 'Candidate'} to "${newStatus}"`);
  };

  const handleBatchShortlist = () => {
    let count = 0;
    setApplications(prev =>
      prev.map(app => {
        if (app.matchScore >= 85 && app.status !== 'Shortlisted' && app.status !== 'Offered') {
          count++;
          return { ...app, status: 'Shortlisted' };
        }
        return app;
      })
    );
    showToast(count > 0 ? `Batch shortlisted ${count} candidates with ≥85% match!` : 'All top candidates already shortlisted!');
  };

  const handleSaveNote = (appId: string) => {
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, notes: tempNote } : app))
    );
    setEditingNoteId(null);
    showToast('Recruiter evaluation note saved!');
  };

  const filteredApps = applications.filter(app => {
    const matchesJob = selectedJobId === 'ALL' || app.jobId === selectedJobId;
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.collegeName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesJob && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Action Feedback Toast */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-md animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
        </div>
      )}

      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <Briefcase className="w-3.5 h-3.5" /> Candidate Applications Pipeline
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Job Applications & Candidate Submissions
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Review incoming applications across active openings. All candidate credentials are tied to authenticated Skill Passports.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleBatchShortlist}
            className="w-full sm:w-auto px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-lg cursor-pointer shrink-0"
          >
            <UserCheck className="w-4 h-4" />
            Batch Shortlist Top Matches (≥85%)
          </button>
          <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
            <span className="text-xs text-emerald-300/80 font-semibold block">Total Applications</span>
            <span className="text-3xl font-black text-emerald-400">{applications.length}</span>
            <span className="text-[11px] text-emerald-300/60 block mt-0.5">Across {jobs.length} Open Roles</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by candidate name, role, or college..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedJobId}
            onChange={e => setSelectedJobId(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Job Openings</option>
            {(jobs || []).map(j => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Offered">Offered</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApps.map(app => (
          <div
            key={app.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-emerald-300 transition-all shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="flex items-start sm:items-center gap-4">
              <img
                src={app.studentAvatar}
                alt={app.studentName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-100 shrink-0"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <h4 className="font-black text-base text-slate-900">{app.studentName}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                    {app.matchScore}% Match
                  </span>
                  <span className="text-xs text-slate-400">• Applied {app.appliedDate}</span>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  Applying for <span className="font-bold text-slate-900">{app.jobTitle}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {app.collegeName}
                </div>
                {app.notes && editingNoteId !== app.id && (
                  <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{app.notes}</span>
                    </div>
                    <button
                      onClick={() => {
                        setEditingNoteId(app.id);
                        setTempNote(app.notes);
                      }}
                      className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                )}
                {editingNoteId === app.id && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={tempNote}
                      onChange={e => setTempNote(e.target.value)}
                      placeholder="Add recruiter feedback note..."
                      className="text-xs px-2.5 py-1 rounded-lg border border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 flex-1"
                    />
                    <button
                      onClick={() => handleSaveNote(app.id)}
                      className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-emerald-500"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingNoteId(null)}
                      className="px-2 py-1 text-slate-500 hover:text-slate-700 text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {!app.notes && editingNoteId !== app.id && (
                  <button
                    onClick={() => {
                      setEditingNoteId(app.id);
                      setTempNote('');
                    }}
                    className="mt-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3" /> + Add Recruiter Note
                  </button>
                )}
              </div>
            </div>

            {/* Actions & Status Dropdown */}
            <div className="flex items-center flex-wrap gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-between lg:justify-end">
              <select
                value={app.status}
                onChange={e => handleStatusChange(app.id, e.target.value as any)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold border cursor-pointer focus:outline-none ${
                  app.status === 'Shortlisted'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : app.status === 'Interview Scheduled'
                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                    : app.status === 'Offered'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <option value="Applied">Applied</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offered">Offered</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button
                onClick={() => handleStatusChange(app.id, 'Interview Scheduled')}
                className="px-3 py-1.5 bg-[#07241d] hover:bg-[#0a382e] text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Fast-track to technical interview round"
              >
                <Calendar className="w-3.5 h-3.5" />
                Schedule Interview
              </button>

              <button
                onClick={() => onOpenPassport && onOpenPassport(app.studentId)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <FileBadge className="w-3.5 h-3.5" />
                Inspect Passport
              </button>
            </div>
          </div>
        ))}

        {filteredApps.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 font-medium text-sm">No applications found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
