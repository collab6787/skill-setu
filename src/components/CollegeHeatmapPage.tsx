import React, { useState } from 'react';
import { DEMO_HEATMAP_DATA } from '../data/seedData';
import { Layers, Filter, Download, Info, AlertTriangle, CheckCircle2, Search } from 'lucide-react';

export const CollegeHeatmapPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minProficiency, setMinProficiency] = useState<number>(0);

  const departments = [
    { key: 'CSE', label: 'Computer Science (CSE)' },
    { key: 'AI_DS', label: 'AI & Data Science' },
    { key: 'IT', label: 'Information Technology' },
    { key: 'ECE', label: 'Electronics (ECE)' }
  ];

  const filteredHeatmap = DEMO_HEATMAP_DATA.filter(row => {
    if (searchQuery && !row.skill.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedSkillCategory !== 'ALL' && row.category !== selectedSkillCategory) {
      return false;
    }
    if (minProficiency > 0 && row.overallAverage < minProficiency) {
      return false;
    }
    return true;
  });

  const getHeatmapCellClass = (score: number) => {
    if (score >= 80) return 'bg-slate-900 text-white font-bold';
    if (score >= 65) return 'bg-slate-300 text-slate-900 font-semibold';
    if (score >= 50) return 'bg-slate-200 text-slate-800 font-medium';
    return 'bg-slate-100 text-slate-500 font-normal';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-mono font-semibold uppercase tracking-wider mb-2 border border-slate-200">
              <Layers className="w-3.5 h-3.5" />
              <span>Departmental Matrix Intelligence</span>
            </div>
            <h1 className="text-2xl font-black text-slate-950 tracking-tight">
              Institutional Skill Heatmap
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Cross-departmental proficiency distribution across industry-standard technical competencies. Evaluates 2,480 enrolled candidates.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Matrix (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Search Skill</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="e.g. Python, Docker..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Department View</label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
            >
              <option value="ALL">All Departments (Comparative)</option>
              {departments.map(d => (
                <option key={d.key} value={d.key}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
            <select
              value={selectedSkillCategory}
              onChange={e => setSelectedSkillCategory(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
            >
              <option value="ALL">All Skill Domains</option>
              <option value="Programming">Programming & Algorithms</option>
              <option value="Backend">Backend & Microservices</option>
              <option value="AI & ML">AI, ML & Data Science</option>
              <option value="Cloud">Cloud & DevOps</option>
              <option value="Database">Databases & Storage</option>
            </select>
          </div>

          {/* Min Proficiency Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Minimum Threshold: {minProficiency > 0 ? `${minProficiency}%` : 'None'}
            </label>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minProficiency}
              onChange={e => setMinProficiency(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer mt-1"
            />
          </div>
        </div>
      </div>

      {/* Heatmap Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 sticky left-0 bg-slate-100 z-10">Skill Competency</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Enrolled Students</th>
                {selectedDept === 'ALL' ? (
                  departments.map(d => (
                    <th key={d.key} className="py-3 px-3 text-center">{d.key}</th>
                  ))
                ) : (
                  <th className="py-3 px-3 text-center">
                    {departments.find(d => d.key === selectedDept)?.label}
                  </th>
                )}
                <th className="py-3 px-4 text-center">College Average</th>
                <th className="py-3 px-3 text-center">Industry Benchmark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredHeatmap.map(row => (
                <tr key={row.skillId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-950 sticky left-0 bg-white z-10 border-r border-slate-100">
                    <div>{row.skill}</div>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {row.skillId}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] border border-slate-200">
                      {row.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono">
                    {row.studentCount} candidates
                  </td>

                  {selectedDept === 'ALL' ? (
                    departments.map(d => {
                      const score = row.departments[d.key] || 0;
                      return (
                        <td key={d.key} className="py-2.5 px-3 text-center">
                          <div className={`mx-auto w-12 py-1.5 rounded text-xs font-mono transition-transform hover:scale-105 ${getHeatmapCellClass(score)}`}>
                            {score}%
                          </div>
                        </td>
                      );
                    })
                  ) : (
                    <td className="py-2.5 px-3 text-center">
                      <div className={`mx-auto w-16 py-1.5 rounded text-xs font-mono ${getHeatmapCellClass(row.departments[selectedDept] || 0)}`}>
                        {row.departments[selectedDept] || 0}%
                      </div>
                    </td>
                  )}

                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded border border-slate-300">
                      {row.overallAverage}%
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      {row.overallAverage >= row.industryBenchmark ? (
                        <span className="inline-flex items-center text-xs font-semibold text-slate-900">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-slate-900" />
                          Meets (Target: {row.industryBenchmark}%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-semibold text-slate-600">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1 text-slate-600" />
                          Deficit (-{row.industryBenchmark - row.overallAverage}%)
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-slate-900">Proficiency Bands:</span>
            <div className="flex items-center space-x-1.5">
              <div className="w-3.5 h-3.5 rounded bg-slate-900" />
              <span>Expert (&ge;80%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-3.5 h-3.5 rounded bg-slate-300 border border-slate-400" />
              <span>Advanced (65-79%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-3.5 h-3.5 rounded bg-slate-200 border border-slate-300" />
              <span>Intermediate (50-64%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300" />
              <span>Foundational (&lt;50%)</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Synced with National Academic Depository (NAD)
          </div>
        </div>
      </div>
    </div>
  );
};
