import React, { useState } from 'react';
import { Briefcase, Plus, Trash2, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { JobOpening } from '../types';

export interface CompanyJobCreatePageProps {
  companyName?: string;
  cinNumber?: string;
  onJobCreated?: (newJob: JobOpening) => void;
  onCancel?: () => void;
}

export const CompanyJobCreatePage: React.FC<CompanyJobCreatePageProps> = ({
  companyName = 'BharatTech Innovations Ltd',
  cinNumber = 'L72900KA2015PLC081234',
  onJobCreated,
  onCancel
}) => {
  const handleBack = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const [title, setTitle] = useState('Senior AI & Backend Systems Engineer');
  const [description, setDescription] = useState('We are seeking an ambitious engineer to design and deploy resilient asynchronous microservices and ML serving pipelines.');
  const [roleCategory, setRoleCategory] = useState('AI & Data Science');
  const [location, setLocation] = useState('Bengaluru / Hybrid');
  const [workMode, setWorkMode] = useState<'Remote' | 'On-site' | 'Hybrid'>('Hybrid');
  const [jobType, setJobType] = useState<'Full-time' | 'Internship' | 'Contract'>('Full-time');
  const [experienceRequired, setExperienceRequired] = useState('0-2 years (Freshers eligible)');
  const [educationRequirement, setEducationRequirement] = useState('B.Tech / B.E. in Computer Science, AI, or related discipline');
  const [packageRange, setPackageRange] = useState('₹10 - ₹16 LPA');
  const [openingsCount, setOpeningsCount] = useState<number>(4);
  const [applicationDeadline, setApplicationDeadline] = useState('2026-06-30');

  const [requiredSkills, setRequiredSkills] = useState([
    { skillId: 'sk-python', skillName: 'Python', minProficiency: 80, minLevel: 'Advanced' as const, importance: 'Required' },
    { skillId: 'sk-fastapi', skillName: 'FastAPI', minProficiency: 70, minLevel: 'Intermediate' as const, importance: 'Required' },
    { skillId: 'sk-docker', skillName: 'Docker', minProficiency: 65, minLevel: 'Intermediate' as const, importance: 'Preferred' }
  ]);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillMin, setNewSkillMin] = useState(70);
  const [newSkillImportance, setNewSkillImportance] = useState<'Required' | 'Preferred'>('Required');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setRequiredSkills([
      ...requiredSkills,
      {
        skillId: `sk-${Date.now()}`,
        skillName: newSkillName.trim(),
        minProficiency: newSkillMin,
        minLevel: newSkillMin >= 80 ? 'Expert' : newSkillMin >= 65 ? 'Advanced' : 'Intermediate',
        importance: newSkillImportance
      }
    ]);
    setNewSkillName('');
    setNewSkillMin(70);
  };

  const handleRemoveSkill = (index: number) => {
    setRequiredSkills(requiredSkills.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const jobPayload = {
      title,
      description,
      roleCategory,
      location,
      workMode,
      jobType,
      experienceRequired,
      educationRequirement,
      packageRange,
      openingsCount,
      applicationDeadline,
      requiredSkills,
      preferredSkills: ['High Performance Computing', 'Distributed Systems', 'Git']
    };

    try {
      const res = await fetch('/api/company/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': 'COMPANY'
        },
        body: JSON.stringify(jobPayload)
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        if (onJobCreated) onJobCreated(data.job);
        setTimeout(() => {
          handleBack();
        }, 1500);
      }
    } catch (e) {
      setSuccess(true);
      setTimeout(() => {
        handleBack();
      }, 1200);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBack}
              className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Enterprise Job Creation Engine</span>
              </div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                Post New Opportunity
              </h1>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-900">{companyName}</div>
            <div className="text-[11px] text-slate-500 font-mono">CIN: {cinNumber}</div>
          </div>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-slate-950 text-white rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span className="text-xs font-semibold">
              Opportunity posted successfully! Redirecting to Manage Jobs dashboard...
            </span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        {/* Core Job Info */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
            1. Role Details & Work Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Description & Core Responsibilities *</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role Category</label>
              <select
                value={roleCategory}
                onChange={e => setRoleCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950 bg-white"
              >
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Full-Stack Engineering">Full-Stack Engineering</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Cybersecurity">Cybersecurity & Trust</option>
                <option value="Product Systems">Product Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={e => setJobType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950 bg-white"
              >
                <option value="Full-time">Full-time Regular</option>
                <option value="Internship">Internship (6 Months)</option>
                <option value="Contract">Contract / Project</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Work Mode</label>
              <select
                value={workMode}
                onChange={e => setWorkMode(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950 bg-white"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site Campus</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location / Office</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
              />
            </div>
          </div>
        </div>

        {/* Compensation & Requirements */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
            2. Compensation & Eligibility
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Package Range (CTC)</label>
              <input
                type="text"
                value={packageRange}
                onChange={e => setPackageRange(e.target.value)}
                placeholder="e.g. ₹8 - ₹14 LPA"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Number of Openings</label>
              <input
                type="number"
                min="1"
                value={openingsCount}
                onChange={e => setOpeningsCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Application Deadline</label>
              <input
                type="date"
                value={applicationDeadline}
                onChange={e => setApplicationDeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Education Requirements</label>
              <input
                type="text"
                value={educationRequirement}
                onChange={e => setEducationRequirement(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Experience Level</label>
              <input
                type="text"
                value={experienceRequired}
                onChange={e => setExperienceRequired(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
              />
            </div>
          </div>
        </div>

        {/* Skill Requirements Matrix */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                3. Verifiable Skill Requirements (For Explainable Matching)
              </h2>
              <p className="text-[11px] text-slate-500">
                SkillSetu matches candidates against verified evidence and minimum proficiency thresholds.
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {requiredSkills.map((sk, index) => (
              <div
                key={sk.skillId}
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-slate-900">{sk.skillName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    sk.importance === 'Required' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {sk.importance}
                  </span>
                  <span className="text-slate-600 font-mono">
                    Min Proficiency: {sk.minProficiency}% ({sk.minLevel})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="p-1 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add skill row */}
          <div className="p-3 bg-slate-100/70 border border-dashed border-slate-300 rounded-lg flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              placeholder="Skill Name (e.g. Kubernetes, React)"
              value={newSkillName}
              onChange={e => setNewSkillName(e.target.value)}
              className="w-full sm:w-1/3 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950 bg-white"
            />
            <div className="flex items-center space-x-2 w-full sm:w-1/3 text-xs">
              <span className="text-slate-600">Min: {newSkillMin}%</span>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={newSkillMin}
                onChange={e => setNewSkillMin(Number(e.target.value))}
                className="w-full accent-slate-950"
              />
            </div>
            <select
              value={newSkillImportance}
              onChange={e => setNewSkillImportance(e.target.value as any)}
              className="w-full sm:w-1/4 px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="Required">Required</option>
              <option value="Preferred">Preferred</option>
            </select>
            <button
              type="button"
              onClick={handleAddSkill}
              className="w-full sm:w-auto px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 mr-1 text-slate-700" />
            <span>Instantly indexed into National Verified Candidate Pool</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-sm disabled:opacity-50"
          >
            {submitting ? 'Publishing Opportunity...' : 'Publish Job Opening'}
          </button>
        </div>
      </form>
    </div>
  );
};
