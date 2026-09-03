import React, { useMemo } from 'react';
import { DepartmentHeatmap, HeatmapDataRow, StudentProfile } from '../../types';
import { Building, Award, BarChart3, TrendingUp, Layers } from 'lucide-react';

interface CollegeDepartmentAnalyticsViewProps {
  heatmap?: DepartmentHeatmap[] | HeatmapDataRow[] | any[];
  students?: StudentProfile[];
}

export const CollegeDepartmentAnalyticsView: React.FC<CollegeDepartmentAnalyticsViewProps> = ({
  heatmap = [],
  students = []
}) => {
  // Normalize incoming data whether it's DepartmentHeatmap[] or HeatmapDataRow[]
  const normalizedDepartments: DepartmentHeatmap[] = useMemo(() => {
    if (!Array.isArray(heatmap) || heatmap.length === 0) {
      return [
        {
          department: 'Computer Science (CSE)',
          studentCount: 480,
          overallReadiness: 88,
          skills: [
            { name: 'Python', proficiency: 82 },
            { name: 'FastAPI Microservices', proficiency: 76 },
            { name: 'Docker & Kubernetes', proficiency: 71 },
            { name: 'PostgreSQL', proficiency: 84 }
          ]
        },
        {
          department: 'AI & Data Science (AI/DS)',
          studentCount: 240,
          overallReadiness: 92,
          skills: [
            { name: 'Python', proficiency: 90 },
            { name: 'PyTorch & Transformers', proficiency: 86 },
            { name: 'Vector Databases', proficiency: 78 },
            { name: 'MLOps Pipeline', proficiency: 74 }
          ]
        },
        {
          department: 'Information Technology (IT)',
          studentCount: 320,
          overallReadiness: 85,
          skills: [
            { name: 'Full-Stack React', proficiency: 85 },
            { name: 'Node.js & Express', proficiency: 82 },
            { name: 'Cloud AWS/GCP', proficiency: 77 },
            { name: 'System Design', proficiency: 72 }
          ]
        },
        {
          department: 'Electronics & Communication (ECE)',
          studentCount: 380,
          overallReadiness: 76,
          skills: [
            { name: 'Embedded C/C++', proficiency: 81 },
            { name: 'Edge AI Inferencing', proficiency: 68 },
            { name: 'IoT Protocols (MQTT)', proficiency: 75 },
            { name: 'Microcontrollers', proficiency: 84 }
          ]
        }
      ];
    }

    // Check if items already have a skills array
    if (heatmap[0] && Array.isArray((heatmap[0] as any).skills)) {
      return heatmap as DepartmentHeatmap[];
    }

    // Otherwise, heatmap is HeatmapDataRow[]: transform into departments
    const deptList = [
      { name: 'Computer Science', label: 'Computer Science (CSE)', count: 480 },
      { name: 'AI & Data Science', label: 'AI & Data Science', count: 240 },
      { name: 'Information Tech', label: 'Information Technology (IT)', count: 320 },
      { name: 'Electronics (ECE)', label: 'Electronics (ECE)', count: 380 }
    ];

    const rows = heatmap as HeatmapDataRow[];
    return deptList.map(dept => {
      const skills = rows.map(r => ({
        name: r.skill || 'Skill',
        proficiency: (r.departments && r.departments[dept.name]) ?? Math.round(r.overallAverage || 70)
      }));
      const avg = skills.length
        ? Math.round(skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length)
        : 78;

      return {
        department: dept.label,
        studentCount: dept.count,
        overallReadiness: avg,
        skills: skills.slice(0, 6)
      };
    });
  }, [heatmap]);

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <Building className="w-3.5 h-3.5" /> Multi-Department Matrix
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Department Skill Proficiency Matrix
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Cross-departmental comparison of curriculum competencies, faculty-to-student verified skill ratios, and recruiter feedback.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Tracked Departments</span>
          <span className="text-3xl font-black text-emerald-400">{normalizedDepartments.length || 4}</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">Accredited Engineering Branches</span>
        </div>
      </div>

      {/* Heatmap Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(normalizedDepartments || []).map(dept => (
          <div
            key={dept.department}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">{dept.department}</h3>
                <span className="text-xs text-slate-500">{dept.studentCount} Students Enrolled</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Avg Readiness</span>
                <span className="text-xl font-black text-emerald-700">{dept.overallReadiness}%</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 mb-2 block">Skill Proficiency Heatmap:</span>
              <div className="space-y-2">
                {(dept.skills || []).map(sk => (
                  <div key={sk.name} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{sk.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            sk.proficiency >= 80 ? 'bg-emerald-600' : sk.proficiency >= 60 ? 'bg-teal-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${sk.proficiency}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800 w-8 text-right">{sk.proficiency}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
