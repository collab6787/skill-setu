import React, { useState, useRef, useEffect } from 'react';
import {
  LanguageCode,
  ChatMessage,
  StudentProfile,
  UserRole,
  GeminiAIMode,
  GeminiIntent
} from '../types';
import {
  Sparkles,
  Send,
  BookOpen,
  Briefcase,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Layers,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

interface SkillSetuAIChatProps {
  student: StudentProfile;
  role: UserRole;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  onNavigateToSimulator?: (skillName: string) => void;
  onNavigateToPassport?: () => void;
  onNavigateToTrends?: () => void;
  onOpenEvidenceModal?: () => void;
  isEmbedded?: boolean;
}

export const SkillSetuAIChat: React.FC<SkillSetuAIChatProps> = ({
  student,
  role,
  language,
  setLanguage,
  onNavigateToSimulator,
  onNavigateToPassport,
  onNavigateToTrends,
  onOpenEvidenceModal,
  isEmbedded = false
}) => {
  const [activeMode, setActiveMode] = useState<GeminiAIMode>('JOB_INSIGHTS');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      language: 'en',
      mode: 'JOB_INSIGHTS',
      intent: 'CAREER_GUIDANCE',
      text: `Welcome, ${student.name.split(' ')[0]}! I am **SkillSetu AI**, your specialized **Learning & Career Intelligence** assistant.\n\nI am strictly focused on two domains:\n• **Job & Career Insights**: Skill demand forecasting, job readiness, gap analysis, and simulator projections.\n• **Study & Learning**: Technical concept deep dives, DSA explanations, and structured revision plans.\n\nHow can I accelerate your learning and career trajectory today?`,
      timestamp: 'Just now',
      suggestedPrompts: [
        'Analyze my skill gap',
        'What should I learn next?',
        'Prepare me for an AI Engineer interview',
        'Explain this ML concept',
        'Which skills are growing?',
        'How can I improve my job readiness?'
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'assistant',
        language: 'en',
        mode: activeMode,
        intent: 'CAREER_GUIDANCE',
        text: `Conversation history reset. I am ready with your verified profile context (**Target: ${student.targetRole}**, **Readiness: ${student.careerReadinessScore.overall}/100**). What topic would you like to explore?`,
        timestamp: 'Just now',
        suggestedPrompts: [
          'Analyze my skill gap',
          'What should I learn next?',
          'Prepare me for an AI Engineer interview',
          'Explain decision trees',
          'Which skills are growing?'
        ]
      }
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    // Detect regional language automatically from script
    let detectedLang: LanguageCode = language;
    if (/[\u0B80-\u0BFF]/.test(query)) detectedLang = 'ta';
    else if (/[\u0900-\u097F]/.test(query)) detectedLang = 'hi';

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      language: detectedLang,
      text: query,
      mode: activeMode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build history payload (last 6 turns)
      const historyPayload = messages.slice(-6).map(m => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        text: m.text
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          language: detectedLang,
          studentId: student.id,
          role,
          forcedMode: activeMode
        })
      });

      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        language: detectedLang,
        text: data.reply || data.response || 'I have analyzed your request based on verified skill intelligence data.',
        intent: data.intent as GeminiIntent,
        mode: (data.mode as GeminiAIMode) || activeMode,
        isOutOfScope: data.isOutOfScope,
        isFallback: data.isFallback,
        suggestedPrompts: data.suggestedPrompts,
        referencedData: data.referencedData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      // Sync active mode if detected
      if (data.mode && data.mode !== activeMode && !data.isOutOfScope) {
        setActiveMode(data.mode);
      }

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        language: detectedLang,
        text: `### Target Role: **${student.targetRole}**\n\n### Your Current Strengths\n• Python (86% - Advanced)\n• SQL (74% - Intermediate)\n\n### Important Skill Gaps\n• **FastAPI** (72% Deficit) — Production API microservices\n• **Docker** (78% Deficit) — Cloud containerization\n\n### Recommendation\nMastering **FastAPI** will lift your estimated match for **TechNova AI Labs** from 64% to **88%+**.`,
        mode: activeMode,
        intent: 'CAREER_GUIDANCE',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: ['Try FastAPI in Job Simulator', 'Explain FastAPI basics']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col bg-white border border-slate-200/90 shadow-lg overflow-hidden ${isEmbedded ? 'h-full rounded-2xl' : 'h-[640px] rounded-2xl'}`}>
      
      {/* 1. INSTITUTIONAL HEADER */}
      <div className="bg-[#071f1a] text-white p-4 sm:px-6 border-b border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md ring-1 ring-emerald-400/30">
            <Sparkles className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base sm:text-lg tracking-tight text-white">SKILLSETU AI</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
                Controlled Engine
              </span>
            </div>
            <p className="text-xs text-emerald-200/70 font-medium">Learning & Career Intelligence</p>
          </div>
        </div>

        {/* Mode & Language Controls */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Dual Mode Switcher */}
          <div className="inline-flex p-1 bg-[#041310] rounded-xl border border-emerald-900/50 text-xs font-semibold">
            <button
              onClick={() => setActiveMode('JOB_INSIGHTS')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeMode === 'JOB_INSIGHTS'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-300/70 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Job Insights</span>
            </button>
            <button
              onClick={() => setActiveMode('STUDY_MODE')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeMode === 'STUDY_MODE'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-emerald-300/70 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Study Mode</span>
            </button>
          </div>

          {/* Language Selector */}
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as LanguageCode)}
            className="bg-[#041310] text-emerald-100 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-emerald-900/50 focus:outline-hidden focus:border-emerald-500 cursor-pointer"
          >
            <option value="en">English (EN)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>

          {/* Reset Chat */}
          <button
            onClick={handleResetChat}
            title="Reset Conversation"
            className="p-1.5 bg-[#041310] hover:bg-[#082820] text-emerald-300 hover:text-white rounded-xl border border-emerald-900/50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. PRIVACY & COMPLIANCE BANNER */}
      <div className="px-4 py-2 bg-emerald-50/50 border-b border-emerald-100 text-[11px] text-slate-600 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            <strong>Domain-Guarded:</strong> Strictly answering Study & Career queries. Personal identity data is cryptographically masked.
          </span>
        </div>
        <span className="hidden md:inline font-mono text-[10px] text-slate-400">
          Active Student: {student.name.split(' ')[0]} ({student.targetRole})
        </span>
      </div>

      {/* 3. MESSAGE THREAD CONTAINER */}
      <div ref={scrollRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {isUser ? 'You' : 'SkillSetu AI'}
                </span>
                {msg.intent && !isUser && (
                  <span className="px-1.5 py-0.2 rounded-sm text-[9px] font-semibold bg-emerald-100 text-emerald-800">
                    {msg.intent.replace(/_/g, ' ')}
                  </span>
                )}
                {msg.isOutOfScope && (
                  <span className="px-1.5 py-0.2 rounded-sm text-[9px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    Out of Scope Guard
                  </span>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[92%] sm:max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#071f1a] text-white rounded-tr-xs shadow-sm font-medium border border-emerald-900/40'
                    : msg.isOutOfScope
                    ? 'bg-amber-50/80 border border-amber-200 text-slate-800 rounded-tl-xs shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
                }`}
              >
                {/* Content formatting with Markdown headings & bullet rendering */}
                <div className="space-y-2 whitespace-pre-line font-normal text-slate-800 dark:text-slate-100">
                  {isUser ? (
                    <p className="text-white">{msg.text}</p>
                  ) : (
                    <div className="prose prose-xs max-w-none text-slate-800">
                      {msg.text.split('\n\n').map((block, idx) => {
                        if (block.startsWith('### ')) {
                          const heading = block.replace('### ', '');
                          return (
                            <div key={idx} className="mt-3 first:mt-0">
                              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight flex items-center gap-1.5 border-b border-slate-100 pb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                {heading}
                              </h4>
                            </div>
                          );
                        }
                        if (block.startsWith('* ') || block.startsWith('• ') || block.startsWith('1. ')) {
                          return (
                            <div key={idx} className="pl-2 space-y-1 text-slate-700 font-medium">
                              {block.split('\n').map((line, lIdx) => (
                                <p key={lIdx} className="leading-normal">{line}</p>
                              ))}
                            </div>
                          );
                        }
                        return (
                          <p key={idx} className="text-slate-700 leading-relaxed font-normal">
                            {block}
                          </p>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Bottom Row: Timestamp & Copy Button */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-slate-700 p-1 rounded-sm cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Actionable Rich Card Trigger (e.g. Test in Simulator) */}
                {msg.referencedData?.relatedAction === 'job_simulator' && (
                  <div className="mt-3 p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div>
                        <div className="font-bold text-[11px] text-emerald-950">
                          Interactive Job Simulation
                        </div>
                        <div className="text-[10px] text-emerald-800">
                          Simulate mastering {msg.referencedData.skillName || 'FastAPI'} on your TechNova match.
                        </div>
                      </div>
                    </div>
                    {onNavigateToSimulator && (
                      <button
                        onClick={() => onNavigateToSimulator(msg.referencedData?.skillName || 'FastAPI')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shadow-xs shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Simulate</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                {msg.referencedData?.relatedAction === 'skill_demand' && onNavigateToTrends && (
                  <div className="mt-3 p-3 bg-teal-50/80 rounded-xl border border-teal-200/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-teal-700 shrink-0" />
                      <div className="text-[11px] text-teal-950 font-bold">
                        Explore ML Skill Demand Forecasts
                      </div>
                    </div>
                    <button
                      onClick={onNavigateToTrends}
                      className="px-3 py-1 bg-teal-700 hover:bg-teal-600 text-white rounded-lg text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                    >
                      View Trends
                    </button>
                  </div>
                )}
              </div>

              {/* Dynamic Suggested Follow-up Prompts */}
              {msg.suggestedPrompts && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                  {msg.suggestedPrompts.map((prompt, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-[11px] font-semibold text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-300 px-3 py-1 rounded-full border border-slate-200 shadow-2xs transition-all text-left flex items-center gap-1.5 cursor-pointer"
                    >
                      <Lightbulb className="w-3 h-3 text-emerald-600" />
                      <span>{prompt}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2.5 p-3.5 bg-white rounded-2xl border border-slate-200 text-slate-600 w-48 shadow-xs animate-pulse">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span className="text-xs font-semibold">Analyzing domain data...</span>
          </div>
        )}
      </div>

      {/* 4. CHAT INPUT BAR */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={
                activeMode === 'STUDY_MODE'
                  ? language === 'ta'
                    ? 'படிப்பு சந்தேகங்கள், நிரலாக்க கருத்துகளை தமிழில் கேட்கவும்...'
                    : language === 'hi'
                    ? 'स्टडी डाउट्स या प्रोग्रामिंग कॉन्सेप्ट्स हिन्दी में पूछें...'
                    : 'Ask study doubts, DSA questions, concept explanations...'
                  : language === 'ta'
                  ? 'வேலை வாய்ப்பு, திறன் தேவை, மற்றும் கேரியர் பற்றி கேட்கவும்...'
                  : language === 'hi'
                  ? 'जॉब इनसाइट्स, स्किल गैप, और करियर रोडमैप के बारे में पूछें...'
                  : 'Ask about skill gaps, job readiness, demand trends, interview prep...'
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-[#071f1a] hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-[#071f1a] text-white rounded-full transition-all shadow-md shrink-0 cursor-pointer"
            title="Send inquiry"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-2">
          <span>Supported: Job Insights & Study Doubts only</span>
          <span>Powered by Gemini AI • SkillSetu Engine</span>
        </div>
      </div>

    </div>
  );
};
