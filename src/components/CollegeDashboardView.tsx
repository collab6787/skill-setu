import React, { useState } from 'react';
import { CollegeStats, HeatmapDataRow, StudentProfile } from '../types';
import {
  Layers,
  Users,
  GraduationCap,
  TrendingUp,
  Award,
  UploadCloud,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  ArrowUpRight,
  Flame,
  ArrowDownRight
} from 'lucide-react';

interface CollegeDashboardViewProps {
  stats: CollegeStats;
  heatmap: HeatmapDataRow[];
  students: StudentProfile[];
}

export const CollegeDashboardView: React.FC<CollegeDashboardViewProps> = ({
  stats,
  heatmap,
  students
}) => {
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvUploaded, setCsvUploaded] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('ALL');

  const departments = ['Computer Science', 'AI & Data Science', 'Information Tech', 'Electronics (ECE)', 'Electrical (EEE)'];

  const getHeatmapColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500 text-white font-bold';
    if (score >= 65) return 'bg-emerald-100 text-emerald-900 font-semibold';
    if (score >= 50) return 'bg-amber-100 text-amber-900 font-semibold';
    if (score >= 35) return 'bg-orange-100 text-orange-900 font-semibold';
    return 'bg-rose-100 text-rose-900 font-bold';
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="crextio-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-emerald-600" />
              College Intelligence Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
              Institutional AI & Skill Mapping
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {stats.name} • 42 Active Industry MoUs & Verified Student Skill Tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCsvModal(true)}
            className="px-4 py-2 bg-[#071f1a] hover:bg-[#0a2922] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all border border-emerald-900/40 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-emerald-400" />
            Bulk Import Students (CSV)
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="crextio-card p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Enrolled</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.totalStudents}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +12% from last batch
          </div>
        </div>

        <div className="crextio-card p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Placement Rate</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{stats.placementRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{stats.placedStudentsCount} Placed • Avg ₹{stats.averagePackageLPA} LPA</div>
        </div>

        <div className="crextio-card p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Job Ready Students</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{stats.studentsJobReady}</div>
          <div className="text-[11px] text-slate-500 mt-1">{stats.verifiedSkillPercentage}% with verified passport</div>
        </div>

        <div className="crextio-card p-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Skill Proficiency</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{stats.averageSkillScore}/100</div>
          <div className="text-[11px] text-slate-500 mt-1">Institutional Benchmark: 70</div>
        </div>
      </div>

      {/* Department vs Skill Heatmap Matrix (Section 26) */}
      <div className="crextio-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Department vs Skill Proficiency Heatmap
            </h3>
            <p className="text-xs text-slate-500">Cross-branch average competency scores mapped against industry requirements</p>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-semibold text-slate-400">Scale:</span>
            <span className="px-2 py-0.5 rounded-sm bg-rose-100 text-rose-800 font-bold">&lt;35 Critical</span>
            <span className="px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800 font-bold">35-64 Intermediate</span>
            <span className="px-2 py-0.5 rounded-sm bg-emerald-600 text-white font-bold">80+ Advanced</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-3 font-extrabold text-slate-700">Skill Domain</th>
                <th className="py-3 px-3 font-bold text-slate-500">Category</th>
                {departments.map(d => (
                  <th key={d} className="py-3 px-3 font-extrabold text-slate-700 text-center">{d}</th>
                ))}
                <th className="py-3 px-3 font-extrabold text-emerald-800 text-center">Campus Avg</th>
                <th className="py-3 px-3 font-extrabold text-slate-700 text-center">Industry Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {heatmap.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-extrabold text-slate-900">{row.skill}</td>
                  <td className="py-3 px-3 text-slate-500">{row.category}</td>
                  {departments.map(d => {
                    const score = row.departments[d] || 0;
                    return (
                      <td key={d} className="py-3 px-2 text-center">
                        <span className={`inline-block w-12 py-1 rounded-lg text-center ${getHeatmapColor(score)}`}>
                          {score}
                        </span>
                      </td>
                    );
                  })}
                  <td className="py-3 px-2 text-center font-extrabold text-emerald-950 bg-emerald-50/50">
                    {row.overallAverage}
                  </td>
                  <td className="py-3 px-2 text-center font-bold text-slate-500">
                    {row.industryBenchmark}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Columns: Booming vs Declining Pulse & Critical Institutional Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Booming vs Declining Skills (Section 27) */}
        <div className="crextio-card p-6">
          <h3 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            Industry Skill Pulse (ML Forecasted)
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80">
              <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider block mb-1.5">
                🔥 Fast-Growing Booming Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {stats.boomingSkills.map(s => (
                  <span key={s} className="px-2.5 py-1 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-extrabold uppercase text-slate-600 tracking-wider block mb-1.5">
                📉 Declining / Saturated Skills (Phase Out Curriculum)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {stats.decliningSkills.map(s => (
                  <span key={s} className="px-2.5 py-1 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-600">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Critical Institutional Skill Gaps */}
        <div className="crextio-card p-6">
          <h3 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Priority Faculty Training Recommendations
          </h3>

          <div className="space-y-2.5">
            {stats.criticalSkillGaps.map((gap, i) => (
              <div key={i} className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200/60 flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-slate-900">{gap.skill}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Campus Deficit: -{gap.deficit}% vs Industry Target ({gap.industryDemand})</div>
                </div>

                <button
                  onClick={() => alert(`Curriculum upgrade sprint generated for ${gap.skill}`)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Schedule Bootcamp
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CSV Bulk Import Modal (Section 59) */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                Bulk Student CSV Data Import
              </h3>
              <button onClick={() => setShowCsvModal(false)} className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Upload institutional CSV export (Student ID, Name, Department, Year, Skills, CGPA, Placed Status). Automated profile and skill passport validation will be initialized.
            </p>

            <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl text-center bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer mb-4">
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-700">Click or Drag & Drop student_data_batch_2026.csv</div>
              <div className="text-[10px] text-slate-400 mt-1">Supports CSV, XLSX up to 10MB</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 text-xs mb-4">
              <span className="font-bold text-slate-700 block mb-1">Previewing 3 Sample Records:</span>
              <div className="font-mono text-[11px] text-slate-600 space-y-0.5">
                <div>✓ 2026CS101, Arun Kumar, CSE, 2026, [Python, ML, SQL], 8.72</div>
                <div>✓ 2026CS102, Rohit Kumar, CSE, 2026, [Python, FastAPI, Docker], 9.15</div>
                <div>✓ 2026AI104, Ananya Iyer, AI&DS, 2026, [Pandas, Scikit, ML], 9.32</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCsvModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCsvUploaded(true);
                  setShowCsvModal(false);
                  alert('Successfully imported and validated 30 student records with automated Skill Passport generation!');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Commit & Import 30 Records
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
