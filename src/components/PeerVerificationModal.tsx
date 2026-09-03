import React, { useState, useEffect } from 'react';
import { StudentProfile, PeerEndorsement } from '../types';
import {
  X,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Send,
  MessageSquare,
  BookOpen,
  Building,
  UserCheck
} from 'lucide-react';

interface PeerVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  classmates: {
    id: string;
    name: string;
    role: string;
    degree: string;
    avatar: string;
    college: string;
  }[];
  onSubmitRequest: (newEndorsement: PeerEndorsement) => void;
}

export const PeerVerificationModal: React.FC<PeerVerificationModalProps> = ({
  isOpen,
  onClose,
  student,
  classmates,
  onSubmitRequest
}) => {
  const defaultSkills = student.skills.map(s => s.skillName);
  
  const [selectedSkill, setSelectedSkill] = useState<string>(defaultSkills[0] || 'Python');
  const [customSkill, setCustomSkill] = useState<string>('');
  const [selectedClassmateId, setSelectedClassmateId] = useState<string>(classmates[0]?.id || '');
  const [customClassmateName, setCustomClassmateName] = useState<string>('');
  const [relationshipType, setRelationshipType] = useState<string>('Cap-stone Project Teammate');
  const [projectName, setProjectName] = useState<string>('Anomaly Detection & ML Analytics Project');
  const [requestMessage, setRequestMessage] = useState<string>(
    'Hi, could you please verify and endorse my competency in this skill based on our collaborative project work? It will be attested on my verified Skill Passport.'
  );
  const [simulateInstantApproval, setSimulateInstantApproval] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successState, setSuccessState] = useState(false);

  // Auto close modal after 5 seconds
  useEffect(() => {
    if (!successState) return;
    const timer = setTimeout(() => {
      setSuccessState(false);
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [successState, onClose]);

  if (!isOpen) return null;

  const activeSkill = selectedSkill === 'OTHER' ? customSkill : selectedSkill;
  const selectedClassmate = classmates.find(c => c.id === selectedClassmateId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSkill.trim()) return;

    setIsSubmitting(true);

    const endorserName = selectedClassmateId === 'CUSTOM' ? customClassmateName || 'Classmate' : (selectedClassmate?.name || 'Classmate');
    const endorserRole = selectedClassmateId === 'CUSTOM' ? 'Classmate • B.Tech Student' : (selectedClassmate?.role || 'Classmate');
    const endorserAvatar = selectedClassmateId === 'CUSTOM' 
      ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'
      : selectedClassmate?.avatar;

    const relationshipDisplay = projectName ? `${relationshipType} (${projectName})` : relationshipType;

    const newEndorsement: PeerEndorsement = {
      id: `end-${Date.now()}`,
      skillName: activeSkill,
      endorserId: selectedClassmateId !== 'CUSTOM' ? selectedClassmateId : undefined,
      endorserName,
      endorserRole,
      endorserAvatar,
      endorserCollege: student.collegeName,
      relationship: relationshipDisplay,
      comment: simulateInstantApproval
        ? `Verified: ${student.name} demonstrated exemplary hands-on proficiency in ${activeSkill} during our collaboration. Consistently delivered well-structured, modular solutions with high reliability.`
        : `Request sent to ${endorserName}: "${requestMessage}"`,
      date: new Date().toISOString().split('T')[0],
      status: simulateInstantApproval ? 'VERIFIED' : 'PENDING',
      endorsementConfidence: simulateInstantApproval ? 94 : 85,
      verificationHash: simulateInstantApproval ? `SHA256:PEER-${endorserName.toUpperCase().replace(/\s+/g, '')}-${Date.now().toString(36).toUpperCase()}` : undefined
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessState(true);
      onSubmitRequest(newEndorsement);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 bg-[#071f1a] text-white flex items-start justify-between border-b border-emerald-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Request Peer Verification
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Consensus Proof
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Request classmates to verify your competencies on your National Skill Passport
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Message Banner */}
        {successState ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-900">
              {simulateInstantApproval ? 'Peer Endorsement Verified & Added!' : 'Verification Request Dispatched!'}
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              {simulateInstantApproval
                ? 'Your classmate has confirmed the endorsement. It has been signed and anchored to your Digital Skill Passport.'
                : 'A notification has been sent to your classmate. Once verified, this credential will update on your public passport.'}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSuccessState(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Step 1: Select Skill */}
            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>1. Select Competency / Skill to Endorse</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {defaultSkills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => setSelectedSkill(skill)}
                    className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                      selectedSkill === skill
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="truncate">{skill}</div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedSkill('OTHER')}
                  className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                    selectedSkill === 'OTHER'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="truncate">+ Other Skill</div>
                </button>
              </div>

              {selectedSkill === 'OTHER' && (
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Enter skill name (e.g. PyTorch, Kubernetes, LangChain)..."
                  className="mt-2 w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              )}
            </div>

            {/* Step 2: Select Classmate */}
            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>2. Select Classmate / Teammate</span>
              </label>

              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {classmates.map(classmate => (
                  <div
                    key={classmate.id}
                    onClick={() => setSelectedClassmateId(classmate.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedClassmateId === classmate.id
                        ? 'bg-emerald-50/80 border-emerald-500 text-slate-900 ring-1 ring-emerald-400/40'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={classmate.avatar}
                        alt={classmate.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate">{classmate.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{classmate.role}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      Verified Peer
                    </span>
                  </div>
                ))}

                {/* Custom Peer */}
                <div
                  onClick={() => setSelectedClassmateId('CUSTOM')}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedClassmateId === 'CUSTOM'
                      ? 'bg-emerald-50/80 border-emerald-500 text-slate-900 ring-1 ring-emerald-400/40'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">+ Enter Custom Classmate / Peer ID</div>
                </div>
              </div>

              {selectedClassmateId === 'CUSTOM' && (
                <input
                  type="text"
                  value={customClassmateName}
                  onChange={(e) => setCustomClassmateName(e.target.value)}
                  placeholder="Enter Classmate Name & Department (e.g. Rahul Sharma, B.Tech CSE)..."
                  className="mt-2 w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              )}
            </div>

            {/* Step 3: Collaboration Context & Project */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Collaboration Relationship
                </label>
                <select
                  value={relationshipType}
                  onChange={(e) => setRelationshipType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
                >
                  <option value="Cap-stone Project Teammate">Cap-stone Project Teammate</option>
                  <option value="Hackathon Collaborator">Hackathon Collaborator</option>
                  <option value="Laboratory Coursework Partner">Laboratory Coursework Partner</option>
                  <option value="Academic Study Group Member">Academic Study Group Member</option>
                  <option value="Student Tech Society / Club Lead">Student Tech Society / Club Lead</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Project / Coursework Reference
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Smart India Hackathon Crop AI"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Step 4: Personal Message */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1">
                <MessageSquare className="w-3 h-3 text-slate-500" />
                <span>Verification Request Note</span>
              </label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
              />
            </div>

            {/* Instant Demo Simulator Checkbox */}
            <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/60 flex items-start gap-2.5 cursor-pointer" onClick={() => setSimulateInstantApproval(!simulateInstantApproval)}>
              <input
                type="checkbox"
                id="simulate-approval"
                checked={simulateInstantApproval}
                onChange={(e) => setSimulateInstantApproval(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="simulate-approval" className="text-[11px] text-emerald-950 font-medium cursor-pointer">
                <strong className="text-emerald-900 block font-bold">Simulate Instant Peer Confirmation (Demo Mode)</strong>
                Attest and cryptographically sign the endorsement immediately to showcase how verified endorsements appear in the passport.
              </label>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !activeSkill.trim()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Signing & Sending...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Endorsement Request</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
