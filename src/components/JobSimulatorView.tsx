import React, { useState, useEffect } from 'react';
import { StudentProfile, JobSimulatorResult } from '../types';
import { simulateSkillMasteryImpact } from '../services/mlEngine';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Layers,
  Award,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowUpRight
} from 'lucide-react';

interface JobSimulatorViewProps {
  student: StudentProfile;
  initialSkill?: string;
  onApplyUnlockedJob: () => void;
  onAddEvidence: () => void;
}

export const JobSimulatorView: React.FC<JobSimulatorViewProps> = ({
  student,
  initialSkill = 'FastAPI',
  onApplyUnlockedJob,
  onAddEvidence
}) => {
  const [selectedSkill, setSelectedSkill] = useState<string>(initialSkill);
  const [selectedRole, setSelectedRole] = useState<string>(student.targetRole || 'AI/ML Engineer');
  const [simulation, setSimulation] = useState<JobSimulatorResult>(
    simulateSkillMasteryImpact(student, initialSkill, selectedRole)
  );

  const availableSkills = ['FastAPI', 'Docker', 'Kubernetes', 'LLM & Generative AI Engineering', 'React.js', 'Machine Learning'];
  const availableRoles = ['AI/ML Engineer', 'Full Stack Developer', 'Data Scientist', 'Cloud & DevOps Engineer'];

  useEffect(() => {
    const res = simulateSkillMasteryImpact(student, selectedSkill, selectedRole);
    setSimulation(res);
  }, [selectedSkill, selectedRole, student]);

  const curr = simulation.currentProfile;
  const proj = simulation.projectedProfile;
  const delta = simulation.improvementDelta;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="crextio-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Zap className="w-6 h-6 text-emerald-600 fill-emerald-600" />
              AI Job Simulator Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
              Interactive What-If Matrix
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Simulate how mastering missing skills directly unlocks candidate match %, role eligibility, and market opportunity ranges.
          </p>
        </div>

        {/* Role & Skill Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Role</label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
            >
              {availableRoles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Skill to Master</label>
            <select
              value={selectedSkill}
              onChange={e => setSelectedSkill(e.target.value)}
              className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
            >
              {availableSkills.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Simulation Showcase (Before vs After) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CURRENT PROFILE (Col 5) */}
        <div className="lg:col-span-5 crextio-card p-6 border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Baseline Status</span>
              <h3 className="text-lg font-extrabold text-slate-800">Current Student Profile</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {student.name}
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/60">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Target Job Match</div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{curr.jobMatchPercentage}%</div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-slate-600 rounded-full" style={{ width: `${curr.jobMatchPercentage}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/60">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Career Readiness</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">{curr.careerReadiness}/100</div>
              </div>

              <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/60">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Eligible Roles</div>
                <div className="text-lg font-bold text-slate-800 mt-0.5">{curr.eligibleJobCount} Openings</div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/60">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Estimated Opportunity Range</div>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">{curr.opportunityRangeLPA}</div>
              <p className="text-[10px] text-slate-400 mt-1">Illustrative baseline market estimate</p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">Accessible Project Types:</span>
              <div className="space-y-1.5">
                {curr.accessibleProjectCategories.map((p, idx) => (
                  <div key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER DELTA CONNECTOR (Col 2 on XL or integrated) */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#071f1a] text-emerald-400 border border-emerald-800/80 flex items-center justify-center shadow-lg shadow-emerald-950/40">
            <Sparkles className="w-6 h-6 animate-pulse text-emerald-400" />
          </div>

          <div className="text-center">
            <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider block">Mastering</span>
            <span className="text-xs font-extrabold text-slate-900 px-2.5 py-1 bg-white rounded-full border border-slate-200 shadow-xs">
              + {selectedSkill}
            </span>
          </div>

          <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-center text-xs space-y-1 w-full">
            <div className="text-emerald-800 font-extrabold text-sm">+{delta.matchIncrease}% Match</div>
            <div className="text-emerald-700 font-bold text-[11px]">+{delta.newJobsUnlocked} Jobs Unlocked</div>
            <div className="text-[10px] text-slate-500 font-medium">{delta.opportunityIncrease}</div>
          </div>
        </div>

        {/* AFTER MASTERING (Col 5) */}
        <div className="lg:col-span-5 crextio-card p-6 border-emerald-200 bg-gradient-to-b from-white to-emerald-50/30 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Simulated Outcome</span>
              <h3 className="text-lg font-extrabold text-slate-900">After Mastering {selectedSkill}</h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-200">
              Top Ranked Tier
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 bg-[#071f1a] text-white rounded-2xl shadow-sm border border-emerald-800/60">
              <div className="text-[10px] text-emerald-300 uppercase font-bold">Projected Target Job Match</div>
              <div className="text-2xl font-black text-white mt-0.5">{proj.jobMatchPercentage}% (+{delta.matchIncrease}%)</div>
              <div className="w-full h-1.5 bg-emerald-950 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${proj.jobMatchPercentage}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-2xl border border-emerald-100 shadow-xs">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Projected Readiness</div>
                <div className="text-lg font-extrabold text-emerald-700 mt-0.5">{proj.careerReadiness}/100</div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-emerald-100 shadow-xs">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Eligible Openings</div>
                <div className="text-lg font-extrabold text-emerald-700 mt-0.5">{proj.eligibleJobCount} Positions</div>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-emerald-100 shadow-xs">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Projected Opportunity Range</div>
              <div className="text-base font-extrabold text-emerald-700 mt-0.5">{proj.opportunityRangeLPA}</div>
              <p className="text-[10px] text-emerald-700 font-semibold mt-1">Potential uplift: {delta.opportunityIncrease}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-800 block mb-2">Unlocked High-Value Project Types:</span>
              <div className="space-y-1.5">
                {proj.accessibleProjectCategories.map((p, idx) => (
                  <div key={idx} className="text-xs text-slate-800 font-medium flex items-center gap-2 bg-white/80 p-1.5 rounded-lg border border-emerald-100/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Compliance Disclaimer & Call-To-Action */}
      <div className="p-4 sm:p-5 bg-white/90 rounded-3xl border border-slate-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-2.5 text-slate-500">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span className="text-[11px] leading-relaxed">
            <strong>Compliance Note:</strong> {simulation.disclaimer}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={onAddEvidence}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Add Verified Evidence for {selectedSkill}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
