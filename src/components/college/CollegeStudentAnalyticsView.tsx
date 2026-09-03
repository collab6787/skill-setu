import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  ShieldCheck,
  Award,
  ArrowUpDown,
  Filter,
  Download
} from 'lucide-react';

interface CollegeStudentAnalyticsViewProps {
  students: StudentProfile[];
  onSelectStudent?: (studentId: string) => void;
}

export const CollegeStudentAnalyticsView: React.FC<CollegeStudentAnalyticsViewProps> = ({
  students = [],
  onSelectStudent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [readinessFilter, setReadinessFilter] = useState<'ALL' | 'JOB_READY' | 'NEEDS_ATTENTION'>('ALL');

  const filtered = (students || []).filter(st => {
    const matchesSearch =
      (st.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (st.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (st.skills || []).some(s => s.skillName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDept === 'ALL' || (st.department || '').includes(selectedDept);

    const matchesReadiness =
      readinessFilter === 'ALL' ||
      (readinessFilter === 'JOB_READY' && (st.careerReadinessScore?.overall || 0) >= 75) ||
      (readinessFilter === 'NEEDS_ATTENTION' && (st.careerReadinessScore?.overall || 0) < 75);

    return matchesSearch && matchesDept && matchesReadiness;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <Users className="w-3.5 h-3.5" /> Institutional Cohort Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Student Analytics & Performance Directory
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Monitor verified skill acquisition, career readiness indexes, and job eligibility across all college departments.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Total Enrolled Cohort</span>
          <span className="text-3xl font-black text-emerald-400">2,480</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">1,894 Verified Passports</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student by name, skill (e.g. Python), or department..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Science">Computer Science (CSE)</option>
            <option value="AI & Data Science">AI & Data Science</option>
            <option value="Information Tech">Information Tech (IT)</option>
            <option value="Electronics">Electronics (ECE)</option>
          </select>

          <select
            value={readinessFilter}
            onChange={e => setReadinessFilter(e.target.value as any)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700"
          >
            <option value="ALL">All Readiness Levels</option>
            <option value="JOB_READY">Job Ready (≥75%)</option>
            <option value="NEEDS_ATTENTION">Requires Attention (&lt;75%)</option>
          </select>
        </div>
      </div>

      {/* Students Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Department & Degree</th>
                <th className="py-3.5 px-4">Academic CGPA</th>
                <th className="py-3.5 px-4">Career Readiness</th>
                <th className="py-3.5 px-4">Verified Skills</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(st => {
                const isReady = st.careerReadinessScore.overall >= 75;

                return (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{st.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{st.passportId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{st.department}</div>
                      <div className="text-[11px] text-slate-400">Class of {st.graduationYear}</div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {st.cgpa} / 10.0
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isReady ? 'bg-emerald-600' : 'bg-amber-500'}`}
                            style={{ width: `${st.careerReadinessScore.overall}%` }}
                          />
                        </div>
                        <span className="font-black text-slate-900">{st.careerReadinessScore.overall}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {st.skills.slice(0, 3).map(s => (
                          <span
                            key={s.skillId}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700"
                          >
                            {s.skillName}
                          </span>
                        ))}
                        {st.skills.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-medium">+{st.skills.length - 3}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isReady
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {isReady ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        {isReady ? 'Day-1 Ready' : 'Training Needed'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
