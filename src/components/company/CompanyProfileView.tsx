import React, { useState } from 'react';
import { User } from '../../types';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  Users,
  Award
} from 'lucide-react';

interface CompanyProfileViewProps {
  currentUser: User;
}

export const CompanyProfileView: React.FC<CompanyProfileViewProps> = ({ currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState('TechNova AI Labs');
  const [taLead, setTaLead] = useState(currentUser.name || 'Vikram Malhotra');
  const [email, setEmail] = useState(currentUser.email || 'recruiter@technova.io');
  const [headquarters, setHeadquarters] = useState('Bengaluru, Karnataka (Indiranagar Cyber Park)');
  const [companySize, setCompanySize] = useState('500–1,000 Employees');
  const [cinNumber, setCinNumber] = useState('U72900KA2021PTC148921');
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
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
            alt={companyName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-emerald-500/30 shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Corporate Employer
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {companyName}
            </h1>
            <p className="text-emerald-200/80 text-sm mt-0.5 font-medium">
              Enterprise Talent Suite • Corporate ID: {cinNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Cancel Editing' : 'Edit Company Info'}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Company profile credentials updated successfully!
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 crextio-card p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900">Enterprise Profile Details</h3>
            <span className="text-xs text-slate-400">Authenticated via Corporate Domain</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-500 font-bold block mb-1">Company Legal Entity</label>
              {isEditing ? (
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              ) : (
                <div className="font-extrabold text-slate-900 text-sm">{companyName}</div>
              )}
            </div>

            <div>
              <label className="text-slate-500 font-bold block mb-1">Head of Talent Acquisition</label>
              {isEditing ? (
                <input
                  type="text"
                  value={taLead}
                  onChange={e => setTaLead(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              ) : (
                <div className="font-extrabold text-slate-900 text-sm">{taLead}</div>
              )}
            </div>

            <div>
              <label className="text-slate-500 font-bold block mb-1">Official Hiring Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              ) : (
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {email}
                </div>
              )}
            </div>

            <div>
              <label className="text-slate-500 font-bold block mb-1">Company Scale</label>
              {isEditing ? (
                <input
                  type="text"
                  value={companySize}
                  onChange={e => setCompanySize(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              ) : (
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> {companySize}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-500 font-bold block mb-1">Global & Regional Headquarters</label>
              {isEditing ? (
                <input
                  type="text"
                  value={headquarters}
                  onChange={e => setHeadquarters(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              ) : (
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {headquarters}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Verification Status Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="crextio-card p-6 space-y-4 bg-gradient-to-br from-white to-emerald-50/50">
            <div className="flex items-center gap-2 text-emerald-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h4 className="font-black text-sm">Verified Recruiter Status</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              TechNova AI Labs holds active recruitment MoUs with top engineering universities across India, allowing fast-track skill verification.
            </p>
            <div className="space-y-2 pt-2 border-t border-emerald-200/60 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Active Campus MoUs:</span>
                <span className="font-bold text-slate-900">18 Universities</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verified Offers Extended:</span>
                <span className="font-bold text-emerald-700">112 Students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trust Index:</span>
                <span className="font-black text-emerald-700">99.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
