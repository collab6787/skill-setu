import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  Users,
  ChevronRight,
  Plus,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Star,
  Sparkles
} from 'lucide-react';

interface CompanyInterviewPipelineViewProps {
  candidates: StudentProfile[];
  onOpenPassport?: (passportId: string) => void;
}

interface PipelineCandidate {
  id: string;
  studentId?: string;
  name: string;
  role: string;
  college: string;
  stage: 'Screening' | 'Technical' | 'SystemDesign' | 'FinalOffer';
  avatar: string;
  score: number;
  scheduledTime?: string;
  meetUrl?: string;
  offerDispatched?: boolean;
}

export const CompanyInterviewPipelineView: React.FC<CompanyInterviewPipelineViewProps> = ({
  candidates = [],
  onOpenPassport
}) => {
  const [pipeline, setPipeline] = useState<PipelineCandidate[]>([
    {
      id: 'pipe-1',
      studentId: candidates[0]?.id || 'std-arun-01',
      name: candidates[0]?.name || 'Arun Kumar',
      role: 'Senior AI & Backend Systems Engineer',
      college: candidates[0]?.collegeName || 'Anna University - CEG Campus',
      stage: 'SystemDesign',
      avatar: candidates[0]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      score: 94,
      scheduledTime: 'Tomorrow, 3:30 PM IST',
      meetUrl: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: 'pipe-2',
      studentId: candidates[1]?.id || 'std-rohit-02',
      name: candidates[1]?.name || 'Rohit Verma',
      role: 'Senior AI & Backend Systems Engineer',
      college: candidates[1]?.collegeName || 'IIT Madras',
      stage: 'Technical',
      avatar: candidates[1]?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      score: 88,
      scheduledTime: 'Friday, 11:00 AM IST',
      meetUrl: 'https://meet.google.com/xyz-uvwx-rst'
    },
    {
      id: 'pipe-3',
      studentId: candidates[2]?.id || 'std-priya-03',
      name: candidates[2]?.name || 'Priya Sundaram',
      role: 'Cloud Native Infrastructure Engineer',
      college: candidates[2]?.collegeName || 'PSG Tech Coimbatore',
      stage: 'FinalOffer',
      avatar: candidates[2]?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
      score: 92,
      scheduledTime: 'Offer Letter Dispatched',
      meetUrl: '',
      offerDispatched: true
    },
    {
      id: 'pipe-4',
      studentId: 'std-ananya-04',
      name: 'Deepak Selvam',
      role: 'Distributed Systems Engineer',
      college: 'SSN College of Engineering',
      stage: 'Screening',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
      score: 81,
      scheduledTime: 'Awaiting Recruiter Review'
    }
  ]);

  const [activeSchedulingId, setActiveSchedulingId] = useState<string | null>(null);
  const [newTime, setNewTime] = useState('Tomorrow, 4:00 PM IST');
  const [newLink, setNewLink] = useState('https://meet.google.com/setu-eval-demo');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCandidateToAdd, setSelectedCandidateToAdd] = useState<string>(candidates[0]?.id || '');
  const [targetStageToAdd, setTargetStageToAdd] = useState<PipelineCandidate['stage']>('Screening');

  // Offer Letter Modal State
  const [activeOfferCandidate, setActiveOfferCandidate] = useState<PipelineCandidate | null>(null);
  const [offerSalary, setOfferSalary] = useState('₹12.5 LPA');
  const [offerJoinDate, setOfferJoinDate] = useState('July 15, 2026');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAdvanceStage = (id: string) => {
    setPipeline(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const stages: PipelineCandidate['stage'][] = ['Screening', 'Technical', 'SystemDesign', 'FinalOffer'];
        const currentIndex = stages.indexOf(c.stage);
        if (currentIndex < stages.length - 1) {
          const nextStage = stages[currentIndex + 1];
          showToast(`${c.name} advanced to ${nextStage}!`);
          return { ...c, stage: nextStage };
        }
        return c;
      })
    );
  };

  const handleSaveSchedule = (id: string) => {
    setPipeline(prev =>
      prev.map(c => (c.id === id ? { ...c, scheduledTime: newTime, meetUrl: newLink } : c))
    );
    const candidate = pipeline.find(c => c.id === id);
    showToast(`Evaluation round scheduled with ${candidate?.name || 'candidate'}!`);
    setActiveSchedulingId(null);
  };

  const handleAddCandidateToPipeline = () => {
    const cand = candidates.find(c => c.id === selectedCandidateToAdd);
    if (!cand) return;

    if (pipeline.some(p => p.studentId === cand.id || p.name === cand.name)) {
      showToast(`${cand.name} is already in the interview pipeline!`);
      setShowAddModal(false);
      return;
    }

    const newCandidate: PipelineCandidate = {
      id: `pipe-${Date.now()}`,
      studentId: cand.id,
      name: cand.name,
      role: 'Software Engineer',
      college: cand.collegeName,
      stage: targetStageToAdd,
      avatar: cand.avatar,
      score: cand.careerReadinessScore?.overall || 85,
      scheduledTime: 'Pending Schedule'
    };

    setPipeline(prev => [...prev, newCandidate]);
    showToast(`Added ${cand.name} to ${targetStageToAdd} round!`);
    setShowAddModal(false);
  };

  const handleDispatchOffer = (candidate: PipelineCandidate) => {
    setPipeline(prev =>
      prev.map(c => (c.id === candidate.id ? { ...c, offerDispatched: true, scheduledTime: `Offer: ${offerSalary}` } : c))
    );
    showToast(`Cryptographically verified offer (${offerSalary}) dispatched to ${candidate.name}!`);
    setActiveOfferCandidate(null);
  };

  const stages = [
    { key: 'Screening', label: '1. Skill Screen & Attestation', color: 'border-slate-300' },
    { key: 'Technical', label: '2. Live Code & Algorithmic Task', color: 'border-blue-400' },
    { key: 'SystemDesign', label: '3. Architecture & Verification', color: 'border-amber-400' },
    { key: 'FinalOffer', label: '4. Offer Extended', color: 'border-emerald-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
            <Calendar className="w-3.5 h-3.5" /> Synchronous Hiring Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Interview Pipeline & Live Evaluations
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Manage stage progression, schedule technical evaluations with Google Meet links, and dispatch cryptographically verified offer letters.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-lg cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Candidate to Pipeline
          </button>
          <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
            <span className="text-xs text-emerald-300/80 font-semibold block">In Active Pipeline</span>
            <span className="text-3xl font-black text-emerald-400">{pipeline.length}</span>
            <span className="text-[11px] text-emerald-300/60 block mt-0.5">Shortlisted Candidates</span>
          </div>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map(st => {
          const itemsInStage = pipeline.filter(c => c.stage === st.key);
          return (
            <div key={st.key} className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 flex flex-col min-h-[420px]">
              <div className={`flex items-center justify-between pb-3 border-b-2 ${st.color} mb-3`}>
                <span className="font-extrabold text-xs text-slate-800 uppercase tracking-tight">{st.label}</span>
                <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                  {itemsInStage.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {itemsInStage.map(c => (
                  <div
                    key={c.id}
                    className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all space-y-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{c.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{c.college}</p>
                      </div>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                        {c.score}%
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-700 font-medium bg-slate-50 px-2 py-1 rounded-md border border-slate-100 flex items-center justify-between">
                      <span className="truncate">{c.role}</span>
                      <button
                        onClick={() => onOpenPassport && onOpenPassport(c.studentId || c.id)}
                        className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold ml-1 flex items-center gap-0.5 cursor-pointer shrink-0"
                        title="Audit Candidate Passport"
                      >
                        <ShieldCheck className="w-3 h-3" /> Passport
                      </button>
                    </div>

                    {c.scheduledTime && (
                      <div className="text-[10px] text-slate-600 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{c.scheduledTime}</span>
                      </div>
                    )}

                    {c.meetUrl && (
                      <a
                        href={c.meetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Video className="w-3 h-3 text-blue-500" />
                        Join Google Meet Room
                      </a>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs gap-1">
                      <button
                        onClick={() => setActiveSchedulingId(c.id)}
                        className="text-[10px] text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                      >
                        Reschedule
                      </button>

                      {c.stage !== 'FinalOffer' ? (
                        <button
                          onClick={() => handleAdvanceStage(c.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          Next Stage
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveOfferCandidate(c)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                            c.offerDispatched
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {c.offerDispatched ? 'View Offer' : 'Dispatch Offer'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {itemsInStage.length === 0 && (
                  <div className="h-32 flex items-center justify-center text-slate-400 text-xs italic border border-dashed border-slate-200 rounded-xl">
                    No candidates in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Modal */}
      {activeSchedulingId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" /> Schedule Interview Round
            </h3>
            <p className="text-xs text-slate-500">
              Set interview time and meeting link for candidate evaluation.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Time & Date</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Meeting Link (Google Meet / Zoom)</label>
                <input
                  type="text"
                  value={newLink}
                  onChange={e => setNewLink(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveSchedulingId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveSchedule(activeSchedulingId)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Candidate to Pipeline Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" /> Add Candidate to Live Pipeline
            </h3>
            <p className="text-xs text-slate-500">
              Select any candidate from your verified talent pool to schedule synchronous evaluation.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Candidate</label>
                <select
                  value={selectedCandidateToAdd}
                  onChange={e => setSelectedCandidateToAdd(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  {(candidates || []).map(cand => (
                    <option key={cand.id} value={cand.id}>
                      {cand.name} • {cand.collegeName.split(' - ')[0]} (Score: {cand.careerReadinessScore?.overall || 85}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Initial Stage</label>
                <select
                  value={targetStageToAdd}
                  onChange={e => setTargetStageToAdd(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="Screening">1. Skill Screen & Attestation</option>
                  <option value="Technical">2. Live Code & Algorithmic Task</option>
                  <option value="SystemDesign">3. Architecture & Verification</option>
                  <option value="FinalOffer">4. Offer Extended</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCandidateToPipeline}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Add to Pipeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Letter Dispatch Modal */}
      {activeOfferCandidate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                  <Sparkles className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Official Cryptographic Offer Letter
                  </h3>
                  <p className="text-xs text-slate-500">
                    Candidate: <strong className="text-slate-800">{activeOfferCandidate.name}</strong> • {activeOfferCandidate.college}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveOfferCandidate(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 space-y-2 text-xs text-emerald-950">
              <div className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Tamper-Proof Smart Employment Contract
              </div>
              <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                This offer letter is digitally signed and tied to the candidate's verified Skill Passport DID. Once accepted, attestation tokens are synchronized with the campus placement cell.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Annual Compensation (CTC)</label>
                <input
                  type="text"
                  value={offerSalary}
                  onChange={e => setOfferSalary(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Joining Date</label>
                <input
                  type="text"
                  value={offerJoinDate}
                  onChange={e => setOfferJoinDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-1 font-mono">
              <div>CONTRACT_ID: 0x9f88...7e21</div>
              <div>VERIFICATION_STATUS: 100% PRE-AUTHENTICATED</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveOfferCandidate(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleDispatchOffer(activeOfferCandidate)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                Dispatch & Sign Offer Letter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
