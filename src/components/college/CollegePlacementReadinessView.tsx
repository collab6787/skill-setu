import React from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Briefcase,
  Users,
  Target
} from 'lucide-react';

export const CollegePlacementReadinessView: React.FC = () => {
  const departmentBreakdown = [
    { name: 'AI & Data Science', readiness: 94, students: 240, placed: 182, status: 'Super Ready' },
    { name: 'Computer Science (CSE)', readiness: 89, students: 480, placed: 360, status: 'Ready' },
    { name: 'Information Technology (IT)', readiness: 85, students: 320, placed: 220, status: 'Ready' },
    { name: 'Electronics (ECE)', readiness: 72, students: 380, placed: 190, status: 'Moderate' },
    { name: 'Mechanical & Mechatronics', readiness: 64, students: 280, placed: 110, status: 'Intervention Needed' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Campus Placement Projection
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Placement Readiness Index
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Predictive placement modeling based on verified credentials and past recruiter assessment thresholds.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Semester Growth</span>
          <span className="text-3xl font-black text-emerald-400">+12%</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">Driven by Python & Cloud initiatives</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Overall Campus Index</span>
          <div className="text-3xl font-black text-slate-900 mt-1">82.4%</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">Tier-1 Recruiter Ready</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Eligible Final Years</span>
          <div className="text-3xl font-black text-slate-900 mt-1">1,700</div>
          <span className="text-xs text-slate-500 mt-1 block">Across 5 departments</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Verified Offers</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">1,062</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">Avg Package ₹8.4 LPA</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Day-1 Conversion</span>
          <div className="text-3xl font-black text-slate-900 mt-1">88%</div>
          <span className="text-xs text-slate-500 mt-1 block">Based on Skill Passport audits</span>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">Department Readiness Breakdown</h3>
          <span className="text-xs text-slate-500 font-medium">Batch of 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Students Enrolled</th>
                <th className="py-3 px-4">Offers Received</th>
                <th className="py-3 px-4">Readiness Score</th>
                <th className="py-3 px-4 text-right">Eligibility Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentBreakdown.map(dept => (
                <tr key={dept.name} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">{dept.name}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{dept.students}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-800">{dept.placed}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${dept.readiness}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-900">{dept.readiness}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {dept.status}
                    </span>
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
