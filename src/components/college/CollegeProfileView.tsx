import React, { useState } from 'react';
import { User } from '../../types';
import {
  GraduationCap,
  Award,
  Building,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface CollegeProfileViewProps {
  currentUser: User;
}

export const CollegeProfileView: React.FC<CollegeProfileViewProps> = ({ currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [collegeName, setCollegeName] = useState(currentUser.name || 'Anna University - CEG Campus');
  const [deanName, setDeanName] = useState('Prof. K. Ramanathan, Ph.D.');
  const [contactEmail, setContactEmail] = useState(currentUser.email || 'placements@annauniv.edu');
  const [nirfRank, setNirfRank] = useState('Rank #8 (Engineering Category)');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-[#07241d] to-[#0a382e] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=256'}
            alt="College Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{collegeName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                Institutional Portal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-900/60 text-teal-200 border border-teal-700/60 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-300" /> NAAC A++
              </span>
            </div>

            <p className="text-emerald-200/80 text-sm mt-1">
              Affiliated with National Academic Depository & AICTE Model Curriculum Framework
            </p>
            <p className="text-xs text-emerald-300/70 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Sardar Patel Road, Guindy, Chennai, Tamil Nadu
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Edit3 className="w-4 h-4" /> {isEditing ? 'Cancel' : 'Edit Institutional Details'}
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Institutional profile information successfully updated!
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in duration-200">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-emerald-600" /> Edit University Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Institution Name</label>
              <input
                type="text"
                value={collegeName}
                onChange={e => setCollegeName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Placement Dean / Officer</label>
              <input
                type="text"
                value={deanName}
                onChange={e => setDeanName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NIRF National Rank</label>
              <input
                type="text"
                value={nirfRank}
                onChange={e => setNirfRank(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
            >
              Save Profile
            </button>
          </div>
        </div>
      )}

      {/* College Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" /> Accreditations & Recognitions
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-500 font-medium">NAAC Grade:</span>
              <span className="font-bold text-emerald-800">A++ (CGPA 3.82)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-500 font-medium">NIRF Ranking:</span>
              <span className="font-bold text-slate-900">{nirfRank}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-500 font-medium">NBA Accreditation:</span>
              <span className="font-bold text-teal-800">Tier-1 Washington Accord</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-600" /> Placement Cell Contact
          </h3>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block">Placement Director</span>
              <span className="font-bold text-slate-900 text-sm">{deanName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Official Mail</span>
              <span className="font-bold text-slate-800">{contactEmail}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Phone Desk</span>
              <span className="font-bold text-slate-800">+91 (44) 2235-8000</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> SkillSetu Protocol Status
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Institutional cryptographic node is actively verifying student assessments and publishing verifiable credentials.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-mono text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Node Health: 100% OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
