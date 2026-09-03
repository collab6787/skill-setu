import React from 'react';
import { LanguageCode, StudentProfile, UserRole } from '../types';
import { SkillSetuAIChat } from './SkillSetuAIChat';
import { X } from 'lucide-react';

interface RegionalChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  student: StudentProfile;
  role: UserRole;
  onNavigateToSimulator: (skillName: string) => void;
  onNavigateToPassport?: () => void;
  onNavigateToTrends?: () => void;
  onOpenEvidenceModal?: () => void;
}

export const RegionalChatbotDrawer: React.FC<RegionalChatbotDrawerProps> = ({
  isOpen,
  onClose,
  language,
  setLanguage,
  student,
  role,
  onNavigateToSimulator,
  onNavigateToPassport,
  onNavigateToTrends,
  onOpenEvidenceModal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 relative">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full border border-slate-700 transition-colors shadow-lg"
          title="Close AI Assistant"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Embedded Controlled Gemini AI Component */}
        <div className="flex-1 h-full">
          <SkillSetuAIChat
            student={student}
            role={role}
            language={language}
            setLanguage={setLanguage}
            onNavigateToSimulator={skill => {
              onNavigateToSimulator(skill);
              onClose();
            }}
            onNavigateToPassport={() => {
              onNavigateToPassport?.();
              onClose();
            }}
            onNavigateToTrends={() => {
              onNavigateToTrends?.();
              onClose();
            }}
            onOpenEvidenceModal={() => {
              onOpenEvidenceModal?.();
              onClose();
            }}
            isEmbedded={true}
          />
        </div>

      </div>
    </div>
  );
};
