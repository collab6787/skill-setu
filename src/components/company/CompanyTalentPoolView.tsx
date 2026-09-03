import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import {
  Users,
  GraduationCap,
  Building,
  ShieldCheck,
  CheckCircle2,
  Award,
  Sparkles,
  MapPin,
  Calendar,
  ChevronRight,
  Download,
  X
} from 'lucide-react';

interface CompanyTalentPoolViewProps {
  candidates: StudentProfile[];
  onOpenPassport?: (studentId: string) => void;
}

export const CompanyTalentPoolView: React.FC<CompanyTalentPoolViewProps> = ({
  candidates = [],
  onOpenPassport
}) => {
  const [selectedCohort, setSelectedCohort] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [driveRequested, setDriveRequested] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const institutionalPools = [
    {
      id: 'pool-1',
      college: 'Anna University - CEG Campus',
      candidatesCount: 142,
      avgReadiness: 84,
      topSkills: 'Python, Microservices, PyTorch',
      location: 'Chennai, Tamil Nadu',
      placementOfficer: 'Dr. S. Ramanathan',
      accreditation: 'NAAC A++ • Tier 1 Institution'
    },
    {
      id: 'pool-2',
      college: 'IIT Madras Research Park',
      candidatesCount: 88,
      avgReadiness: 89,
      topSkills: 'Distributed Systems, CUDA, Go',
      location: 'Chennai, Tamil Nadu',
      placementOfficer: 'Prof. K. Venkatesh',
      accreditation: 'Institute of National Importance'
    },
    {
      id: 'pool-3',
      college: 'NIT Trichy Department of CSE',
      candidatesCount: 110,
      avgReadiness: 82,
      topSkills: 'FastAPI, Cloud, Kubernetes',
      location: 'Tiruchirappalli, Tamil Nadu',
      placementOfficer: 'Dr. P. Rajeswari',
      accreditation: 'Tier 1 Central Institution'
    },
    {
      id: 'pool-4',
      college: 'PSG College of Technology',
      candidatesCount: 96,
      avgReadiness: 80,
      topSkills: 'Full-Stack, Docker, Data Science',
      location: 'Coimbatore, Tamil Nadu',
      placementOfficer: 'Dr. M. Soundararajan',
      accreditation: 'Autonomous • NBA Accredited'
    }
  ];

  const handleRequestDrive = (college: string) => {
    setDriveRequested(prev => ({ ...prev, [college]: true }));
    showToast(`Campus Placement Drive request sent to ${college} Placement Cell!`);
  };

  const activePoolData = institutionalPools.find(p => p.college === selectedCohort);
  const cohortCandidates = candidates.filter(c =>
    selectedCohort ? c.collegeName.toLowerCase().includes(selectedCohort.toLowerCase().split(' ')[0]) : false
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between shadow-md animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
        </div>
      )}

      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <Users className="w-3.5 h-3.5" /> Multi-University Talent Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Pre-Vetted Campus Talent Pools
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Direct access to authenticated engineering cohorts across top accredited universities with verified Skill Passports.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Total Pre-Vetted Talent</span>
          <span className="text-3xl font-black text-emerald-400">436</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">Ready for Immediate Onboarding</span>
        </div>
      </div>

      {/* Institutional Cohort Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {institutionalPools.map(pool => {
          const isRequested = driveRequested[pool.college];
          return (
            <div
              key={pool.college}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {pool.candidatesCount} Verified Candidates
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Avg Readiness: <strong className="text-emerald-700">{pool.avgReadiness}%</strong>
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-black shrink-0">
                    <Building className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{pool.college}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" /> {pool.location} • {pool.accreditation}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  Dominant Competencies: <strong className="text-slate-800">{pool.topSkills}</strong>
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleRequestDrive(pool.college)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isRequested
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  {isRequested ? 'Drive Requested ✓' : 'Request Campus Drive'}
                </button>

                <button
                  onClick={() => setSelectedCohort(pool.college)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1"
                >
                  Explore Cohort
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cohort Details Modal */}
      {selectedCohort && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{selectedCohort}</h3>
                  <p className="text-xs text-slate-500">
                    Placement Officer: {activePoolData?.placementOfficer} • {activePoolData?.location}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCohort(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 block">Accredited Engineering Batch</span>
                <span className="text-xs text-emerald-700">100% of candidates hold cryptographically verified credentials</span>
              </div>
              <button
                onClick={() => {
                  showToast(`Exported ${selectedCohort} verified cohort roster (CSV)!`);
                }}
                className="px-3 py-1.5 bg-white text-emerald-800 border border-emerald-300 font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-emerald-50 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Export Roster
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                Top Verified Candidates in this University Pool
              </h4>

              {(cohortCandidates.length > 0 ? cohortCandidates : candidates.slice(0, 3)).map(cand => (
                <div
                  key={cand.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 hover:border-emerald-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cand.avatar}
                      alt={cand.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                        {cand.name}
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {cand.degree} • Readiness: <strong className="text-emerald-700">{cand.careerReadinessScore?.overall || 85}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCohort(null);
                        onOpenPassport && onOpenPassport(cand.id);
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      Audit Passport
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setSelectedCohort(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Cohort View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
