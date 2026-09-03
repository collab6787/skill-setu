import React from 'react';
import { UserRole } from '../types';
import { ShieldAlert, ArrowLeft, LogOut, Lock } from 'lucide-react';

interface AccessRestrictedViewProps {
  requiredRole: string;
  currentRole?: string;
  onReturnToDashboard?: () => void;
  onLogout?: () => void;
}

export const AccessRestrictedView: React.FC<AccessRestrictedViewProps> = ({
  requiredRole,
  currentRole = 'STUDENT',
  onReturnToDashboard,
  onLogout
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-rose-200 rounded-3xl p-8 shadow-xl text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
          <ShieldAlert className="w-8 h-8 text-rose-600" />
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-mono font-bold uppercase tracking-wider mb-3 border border-rose-200">
          <Lock className="w-3 h-3" /> RBAC Policy Violation (HTTP 403)
        </div>

        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          Access Restricted
        </h2>

        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          You are currently signed in with an active <strong className="text-slate-900 font-bold uppercase">{currentRole}</strong> account.
          This resource is strictly restricted to authorized <strong className="text-slate-900 font-bold uppercase">{requiredRole}</strong> accounts in accordance with national tenant data isolation standards.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-left mb-6 font-mono text-slate-700 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Authenticated Role:</span>
            <span className="font-bold text-slate-900 uppercase">{currentRole}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Required Role:</span>
            <span className="font-bold text-rose-700 uppercase">{requiredRole}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Security Standard:</span>
            <span className="text-emerald-700 font-bold">Strict Role Isolation v2</span>
          </div>
        </div>

        <div className="space-y-3">
          {onReturnToDashboard && (
            <button
              onClick={onReturnToDashboard}
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to My {currentRole.toUpperCase()} Dashboard</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign Out to Log In as {requiredRole.toUpperCase()}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

