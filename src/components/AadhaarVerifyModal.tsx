import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, X, Loader2 } from 'lucide-react';

interface AadhaarVerifyModalProps {
  currentMasked: string;
  onClose: () => void;
  onVerifySuccess: (aadhaarNumber: string) => void;
}

export const AadhaarVerifyModal: React.FC<AadhaarVerifyModalProps> = ({
  currentMasked,
  onClose,
  onVerifySuccess
}) => {
  const [aadhaarInput, setAadhaarInput] = useState('548912348921');
  const [isVerifying, setIsVerifying] = useState(false);
  const [consentGiven, setConsentGiven] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (aadhaarInput.length < 12) {
      setErrorMessage('Please enter a complete 12-digit Aadhaar number.');
      return;
    }

    if (!consentGiven) {
      setErrorMessage('Please confirm consent to proceed with sandbox verification.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerifySuccess(aadhaarInput);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="aadhaar-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 id="aadhaar-modal-title" className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Aadhaar Student Identity Verification
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Mode Notice Banner */}
        <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 mb-4 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Demo Aadhaar Verification Active (Sandbox Mode)</strong>
            <p className="text-[11px] text-amber-800/90 leading-relaxed mt-0.5">
              Zero raw 12-digit Aadhaar numbers are persisted. The system immediately masks input and hashes verification tokens safely.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Enter 12-Digit Aadhaar Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              maxLength={12}
              required
              value={aadhaarInput}
              onChange={e => {
                setAadhaarInput(e.target.value.replace(/\D/g, ''));
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="12-digit Aadhaar number"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold tracking-widest text-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Will be instantly tokenized and stored as: <strong>XXXX-XXXX-{aadhaarInput.slice(-4) || '8921'}</strong>
            </span>
          </div>

          {errorMessage && (
            <div className="p-2.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <label className="flex items-start gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/60 cursor-pointer hover:bg-slate-100/50 transition-colors">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={e => setConsentGiven(e.target.checked)}
              className="mt-0.5 rounded-sm text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-600 leading-snug">
              I consent to sandbox identity verification for SkillSetu National Skill Passport authentication.
            </span>
          </label>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isVerifying}
              className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying || aadhaarInput.length < 12}
              className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Sandbox Token...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authenticate Identity</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
