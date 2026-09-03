import React from 'react';
import {
  Building2,
  Users,
  Briefcase,
  Star,
  ExternalLink,
  Plus,
  CheckCircle2,
  Handshake
} from 'lucide-react';

export const CollegeCompaniesView: React.FC = () => {
  const partners = [
    {
      name: 'TechNova AI Labs',
      industry: 'Enterprise AI & Machine Learning',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
      offersExtended: 38,
      avgPackage: '₹11.2 LPA',
      mouStatus: 'Active MoU (2024–2027)',
      recruiterRating: 4.9,
      verifiedHires: 'All 38 via Skill Passport'
    },
    {
      name: 'CloudScale Networks',
      industry: 'Cloud Infrastructure & High-Scale Systems',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=128',
      offersExtended: 46,
      avgPackage: '₹9.8 LPA',
      mouStatus: 'Active MoU (2023–2026)',
      recruiterRating: 4.8,
      verifiedHires: 'Direct On-Campus Drive'
    },
    {
      name: 'CyberShield Systems',
      industry: 'Cyber Defense & Automated Auditing',
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=128',
      offersExtended: 24,
      avgPackage: '₹10.5 LPA',
      mouStatus: 'Active MoU (2025–2028)',
      recruiterRating: 4.7,
      verifiedHires: 'Passports Audited 100%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
            <Handshake className="w-3.5 h-3.5" /> Corporate Placement Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Hiring Partners & Corporate Relations
          </h1>
          <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
            Manage industry partnerships, on-campus recruitment drives, and verified candidate talent pipelines.
          </p>
        </div>

        <div className="bg-[#092922] p-4 rounded-2xl border border-emerald-800/70 text-center shrink-0 w-full sm:w-auto">
          <span className="text-xs text-emerald-300/80 font-semibold block">Active Corporate Partners</span>
          <span className="text-3xl font-black text-emerald-400">42</span>
          <span className="text-[11px] text-emerald-300/60 block mt-0.5">Formal Industry MoUs</span>
        </div>
      </div>

      {/* Partner Grid */}
      <div className="space-y-4">
        {partners.map(p => (
          <div
            key={p.name}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <img
                src={p.logo}
                alt={p.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base text-slate-900">{p.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                    {p.mouStatus}
                  </span>
                  <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" /> {p.recruiterRating}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{p.industry}</p>

                <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                  <span className="font-bold text-emerald-700">{p.offersExtended} Offers Extended</span>
                  <span>•</span>
                  <span>Avg Package: <strong>{p.avgPackage}</strong></span>
                  <span>•</span>
                  <span className="text-teal-700 font-medium">{p.verifiedHires}</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto shrink-0 flex gap-2">
              <button className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer">
                View Drive Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
