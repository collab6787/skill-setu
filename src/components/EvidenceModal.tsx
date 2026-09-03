import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, UploadCloud, X, Loader2 } from 'lucide-react';

interface EvidenceModalProps {
  initialSkillName?: string;
  onClose: () => void;
  onSubmit: (data: {
    skillName: string;
    type: 'CERTIFICATION' | 'PROJECT' | 'ASSESSMENT';
    title: string;
    description: string;
    issuer: string;
    url: string;
  }) => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  initialSkillName = 'FastAPI',
  onClose,
  onSubmit
}) => {
  const [skillName, setSkillName] = useState(initialSkillName);
  const [type, setType] = useState<'CERTIFICATION' | 'PROJECT' | 'ASSESSMENT'>('PROJECT');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [issuer, setIssuer] = useState('GitHub / Academic Capstone Committee');
  const [url, setUrl] = useState('https://github.com/demo-arun/fastapi-production-microservice');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialSkillName) {
      setSkillName(initialSkillName);
    }
  }, [initialSkillName]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        skillName,
        type,
        title: title.trim(),
        description: description.trim(),
        issuer: issuer.trim(),
        url: url.trim()
      });
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 id="evidence-modal-title" className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            Add Verified Technical Skill Evidence
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          SkillSetu calculates evidence-weighted proficiency. Submitting verified projects and credentials directly elevates your Career Readiness score.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Target Skill</label>
              <select
                value={skillName}
                onChange={e => setSkillName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs"
              >
                <option value="FastAPI">FastAPI</option>
                <option value="Docker">Docker</option>
                <option value="Kubernetes">Kubernetes</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Python">Python</option>
                <option value="Pandas & NumPy">Pandas & NumPy</option>
                <option value="PostgreSQL / SQL">PostgreSQL / SQL</option>
                <option value="React.js">React.js</option>
                <option value="LLM & Generative AI">LLM & Generative AI</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Evidence Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs"
              >
                <option value="PROJECT">Institutional / GitHub Project</option>
                <option value="CERTIFICATION">Industry Certification</option>
                <option value="ASSESSMENT">Standardized Assessment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Evidence Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Asynchronous Model Inference API with FastAPI & Redis"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Description & Demonstrated Features</label>
            <textarea
              rows={2}
              placeholder="Implemented async endpoints handling 500 req/sec with automatic Pydantic validation..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Issuing / Verifying Body</label>
              <input
                type="text"
                value={issuer}
                onChange={e => setIssuer(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Verification URL / Repo</label>
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/60 text-[11px] text-emerald-950 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Institutional Registrar & Hackathon Evaluation Protocol will auto-verify this record.</span>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting Evidence...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify & Update Score</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
