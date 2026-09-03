import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Send,
  GraduationCap
} from 'lucide-react';

interface CollegeStudentCohortsViewProps {
  students: StudentProfile[];
}

export const CollegeStudentCohortsView: React.FC<CollegeStudentCohortsViewProps> = ({
  students = []
}) => {
  const [selectedCohort, setSelectedCohort] = useState('2026');
  const [interventionSent, setInterventionSent] = useState<string | null>(null);

  const cohorts = [
    { year: '2026', label: 'Final Year (Class of 2026)', size: 1700, avgReadiness: 82, atRiskCount: 142 },
    { year: '2027', label: 'Pre-Final Year (Class of 2027)', size: 1850, avgReadiness: 68, atRiskCount: 310 },
    { year: '2028', label: 'Sophomore Batch (Class of 2028)', size: 1920, avgReadiness: 54, atRiskCount: 480 }
  ];

  const atRiskStudents = (students || []).filter(s => (s.careerReadinessScore?.overall || 0) < 75);

  const handleSendIntervention = (studentId: string, name: string) => {
    setInterventionSent(name);
    setTimeout(() => setInterventionSent(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <Users className="w-3.5 h-3.5" /> Batch Progression & Interventions
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Student Cohort Analytics & Support
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Track student skill trajectory across graduation years and identify students who require remediation prior to campus recruitment drives.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-amber-300 font-bold block">Flagged for Intervention</span>
          <span className="text-3xl font-black text-amber-400">{atRiskStudents.length || 142}</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">&lt;75% Career Readiness</span>
        </div>
      </div>

      {interventionSent && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Skill remediation plan successfully assigned to {interventionSent}!
        </div>
      )}

      {/* Cohort Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cohorts.map(c => {
          const isSelected = selectedCohort === c.year;

          return (
            <div
              key={c.year}
              onClick={() => setSelectedCohort(c.year)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-white border-emerald-500 ring-2 ring-emerald-400/30 shadow-md'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{c.label}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                  {c.size} Students
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900">{c.avgReadiness}% Readiness</div>
              <div className="text-xs text-amber-700 font-medium mt-1">
                {c.atRiskCount} students need remediation
              </div>
            </div>
          );
        })}
      </div>

      {/* Students Requiring Attention Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Students Requiring Immediate Attention
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Students below the 75% Day-1 placement readiness cutoff</p>
          </div>
          <span className="text-xs text-amber-800 font-bold bg-amber-100 px-3 py-1 rounded-full">
            Action Recommended
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Current Score</th>
                <th className="py-3 px-4">Primary Deficit Skill</th>
                <th className="py-3 px-4 text-right">Intervention Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {atRiskStudents.map(st => (
                <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{st.name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{st.department}</td>
                  <td className="py-3.5 px-4 font-black text-amber-600">{st.careerReadinessScore.overall}%</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">Docker & Asynchronous APIs</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleSendIntervention(st.id, st.name)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Assign Bootcamp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
