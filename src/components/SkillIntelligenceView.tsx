import React, { useState } from 'react';
import { SkillTrend } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  Flame,
  Search,
  ArrowUpRight,
  GitBranch,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Zap
} from 'lucide-react';
import { SalaryPotentialCalculator } from './SalaryPotentialCalculator';

interface SkillIntelligenceViewProps {
  skillTrends: SkillTrend[];
  onSelectForJobSimulator: (skillName: string) => void;
}

export const SkillIntelligenceView: React.FC<SkillIntelligenceViewProps> = ({
  skillTrends,
  onSelectForJobSimulator
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeSkill, setActiveSkill] = useState<SkillTrend>(skillTrends[0] || {} as SkillTrend);

  const categories = ['ALL', 'AI & Data', 'Backend & APIs', 'DevOps & Cloud', 'Databases', 'Frontend'];

  const filteredTrends = skillTrends.filter(st => {
    const matchesSearch = st.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          st.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || st.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const currentActiveSkill = filteredTrends.find(s => s.skillId === activeSkill?.skillId) || filteredTrends[0] || null;

  const getBadgeClass = (trend: string) => {
    switch (trend) {
      case 'BOOMING':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'GROWING':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'STABLE':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DECLINING':
        return 'bg-slate-100 text-slate-600 border-slate-300';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getSparklineColor = (trend: string) => {
    switch (trend) {
      case 'BOOMING':
        return '#e11d48'; // Rose-600
      case 'GROWING':
        return '#059669'; // Emerald-600
      case 'STABLE':
        return '#2563eb'; // Blue-600
      case 'DECLINING':
        return '#64748b'; // Slate-500
      default:
        return '#d97706'; // Amber-600
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner Header */}
      <div className="crextio-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              AI Skill Demand Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
              ML Forecaster Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Explainable regression time-series models trained on synthetic industry demand datasets (2023–2027 Projections).
          </p>
        </div>

        {/* Search & Category Pills & Salary Calculator Jump */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search skill or domain..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 w-44 sm:w-56"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('salary-potential-calculator');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100/80 active:scale-98 text-emerald-800 border border-emerald-200/80 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer focus:outline-hidden"
            title="Jump to Salary Potential Calculator"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>Salary Calculator</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#071f1a] text-white shadow-xs border border-emerald-800'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 active:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left List of Skills (Col 5) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 uppercase tracking-wider px-2">
            <span>Skill Demand Trajectories ({filteredTrends.length})</span>
            {(searchQuery || selectedCategory !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="text-[10px] lowercase text-emerald-700 hover:underline font-bold cursor-pointer"
              >
                clear filters
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredTrends.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-slate-800 text-xs">No matching skills found</p>
                <p className="text-[11px] text-slate-400 mt-1">Try adjusting your search query or category filter</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                  }}
                  className="mt-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredTrends.map(skill => {
                const isSelected = currentActiveSkill?.skillId === skill.skillId;
                return (
                  <div
                    key={skill.skillId}
                    onClick={() => setActiveSkill(skill)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                        : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{skill.skillName}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{skill.category}</span>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getBadgeClass(skill.trendClassification)}`}>
                        {skill.trendClassification === 'BOOMING' && '🔥 '}
                        {skill.trendClassification} (+{skill.growthRate}%)
                      </span>
                    </div>

                    {/* Mini Sparkline Chart representing Growth Rate Trend */}
                    <div className="my-2.5 p-2 bg-slate-50/70 rounded-xl border border-slate-100/90 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mb-1">
                          <span>Demand Growth Trajectory</span>
                          <span className="text-slate-700 font-bold flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3 text-emerald-600" />
                            +{skill.growthRate}%
                          </span>
                        </div>
                        <div className="h-8 w-full min-w-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={skill.historicalData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                              <defs>
                                <linearGradient id={`spark-${skill.skillId}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={getSparklineColor(skill.trendClassification)} stopOpacity={0.35} />
                                  <stop offset="100%" stopColor={getSparklineColor(skill.trendClassification)} stopOpacity={0.0} />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="year" hide />
                              <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#071f1a',
                                  borderRadius: '8px',
                                  border: '1px solid #064e3b',
                                  color: '#fff',
                                  fontSize: '10px',
                                  padding: '4px 8px',
                                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.15)'
                                }}
                                formatter={(val: any) => [`${val}/100`, 'Demand Score']}
                                labelFormatter={(label: any) => `Year ${label} ${label === 2027 ? '(ML Forecast)' : ''}`}
                              />
                              <Area
                                type="monotone"
                                dataKey="demandScore"
                                stroke={getSparklineColor(skill.trendClassification)}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 3, fill: getSparklineColor(skill.trendClassification), strokeWidth: 0 }}
                                isAnimationActive={false}
                                fill={`url(#spark-${skill.skillId})`}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                      <span className="font-medium">2027 Predicted: <strong className="text-slate-900">{skill.predictedNextDemand}/100</strong></span>
                      <span className="text-[11px] text-emerald-700 font-bold">{skill.jobCount} Active Openings</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Skill Detail & Recharts Visualizer (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {currentActiveSkill ? (
            <>
              {/* Detailed Trend Card */}
              <div className="crextio-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-extrabold text-slate-900">{currentActiveSkill.skillName}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeClass(currentActiveSkill.trendClassification)}`}>
                        {currentActiveSkill.trendClassification}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{currentActiveSkill.description}</p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('salary-potential-calculator');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100/90 active:scale-[0.98] text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs whitespace-nowrap transition-all focus:outline-hidden cursor-pointer"
                      title={`Calculate salary potential with ${currentActiveSkill.skillName}`}
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                      <span>Salary Calculator</span>
                    </button>

                    <button
                      onClick={() => onSelectForJobSimulator(currentActiveSkill.skillName)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm whitespace-nowrap transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Simulate in Job Engine</span>
                    </button>
                  </div>
                </div>

                {/* Demand Forecast Chart */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
                    <span>Demand Index (2023 - 2027 ML Forecast)</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Model Confidence: {currentActiveSkill.confidence}%</span>
                  </div>

                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={currentActiveSkill.historicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                        <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#071f1a', borderRadius: '12px', border: '1px solid #064e3b', color: '#fff', fontSize: '12px' }}
                          formatter={(val: any) => [`${val}/100 Demand Score`, 'Score']}
                          labelFormatter={(label: any) => `Year: ${label} ${label === 2027 ? '(ML Prediction)' : ''}`}
                        />
                        <Area type="monotone" dataKey="demandScore" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#demandGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Key Roles & Benchmarks */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Top Roles</div>
                    <div className="font-bold text-slate-800 mt-0.5">{currentActiveSkill.topRoles?.slice(0, 2).join(', ')}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Avg Campus Proficiency</div>
                    <div className="font-bold text-emerald-700 mt-0.5">{currentActiveSkill.averageProficiency}/100</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">5-Yr Growth Rate</div>
                    <div className="font-bold text-emerald-700 mt-0.5">+{currentActiveSkill.growthRate}%</div>
                  </div>
                </div>
              </div>

              {/* Skill Dependency Graph Card (Section 16) */}
              <div className="crextio-card p-6">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-3">
                  <GitBranch className="w-4 h-4 text-emerald-600" />
                  Skill Dependency & Unlock Graph
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Visual relationship showing prerequisite foundations and advanced enterprise capabilities unlocked by mastering {currentActiveSkill.skillName}.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#071f1a] text-white rounded-2xl border border-emerald-900/40">
                  {/* Prerequisites */}
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] font-bold text-emerald-200/70 uppercase tracking-wider block mb-1">Prerequisites</span>
                    <div className="flex flex-wrap gap-1">
                      {currentActiveSkill.dependencies?.map(d => (
                        <span key={d} className="px-2 py-0.5 bg-[#0d2d26] border border-emerald-800/60 rounded-md text-xs font-semibold text-emerald-100">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-extrabold text-sm shadow-md shadow-emerald-500/30">
                    ⚡ {currentActiveSkill.skillName}
                  </div>

                  {/* Unlocked Skills */}
                  <div className="text-center sm:text-right">
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-1">Unlocks Capabilities</span>
                    <div className="flex flex-wrap gap-1 justify-center sm:justify-end">
                      {currentActiveSkill.unlocks?.map(u => (
                        <span key={u} className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 rounded-md text-xs font-semibold text-emerald-200">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="crextio-card p-12 text-center flex flex-col items-center justify-center min-h-[360px] text-slate-400">
              <Sparkles className="w-10 h-10 text-slate-300 mb-3" />
              <h4 className="text-base font-bold text-slate-800">No Skill Selected</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Select a skill from the left list or adjust your filters to view demand forecasting and unlock graphs.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Salary Potential Calculator (Trend-Weighted Pay Scale Bar Chart Visualizer) */}
      <SalaryPotentialCalculator
        skillTrends={skillTrends}
        onSelectForJobSimulator={onSelectForJobSimulator}
        initialSelectedSkillNames={
          currentActiveSkill
            ? [currentActiveSkill.skillName, 'FastAPI', 'Docker']
            : ['Python', 'FastAPI', 'Docker']
        }
      />
    </div>
  );
};
