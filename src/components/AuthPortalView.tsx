import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { GraduationCap, Landmark, Building2, ShieldCheck, ArrowLeft, Key, Check } from 'lucide-react';

interface AuthPortalViewProps {
  initialRole?: UserRole;
  initialMode?: 'login' | 'register';
}

export const AuthPortalView: React.FC<AuthPortalViewProps> = ({
  initialRole = 'STUDENT',
  initialMode = 'login'
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, switchRole } = useAuth();

  // Determine role from props or URL pathname
  let detectedRole: UserRole = (initialRole as UserRole) || 'STUDENT';
  if (location.pathname.includes('/student')) detectedRole = 'STUDENT';
  else if (location.pathname.includes('/college')) detectedRole = 'COLLEGE';
  else if (location.pathname.includes('/company')) detectedRole = 'COMPANY';

  const [role, setRole] = useState<UserRole>(detectedRole);
  const [mode, setMode] = useState<'login' | 'register'>(
    location.pathname.includes('/register') ? 'register' : initialMode
  );

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('');

  // Student specific
  const [institution, setInstitution] = useState('Indian Institute of Technology (IIT), Madras');
  const [degree, setDegree] = useState('B.Tech in Artificial Intelligence & Data Science');
  const [department, setDepartment] = useState('Computer Science & Engineering');

  // College specific
  const [institutionName, setInstitutionName] = useState('National Institute of Technology, Trichy');
  const [aisheCode, setAisheCode] = useState('C-41289');
  const [contactPerson, setContactPerson] = useState('Prof. K. Ramanathan (Director of Training & Placements)');

  // Company specific
  const [companyName, setCompanyName] = useState('TechNova AI Labs');
  const [cinNumber, setCinNumber] = useState('U72200KA2021PTC148921');
  const [industrySector, setIndustrySector] = useState('Artificial Intelligence & Enterprise Cloud');
  const [talentHead, setTalentHead] = useState('Vikram Malhotra (VP of Talent Acquisition)');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuickFill = (targetRole: UserRole) => {
    setRole(targetRole);
    if (targetRole === 'STUDENT') {
      setEmail('student@skillsetu.demo');
      setPassword('demo123');
    } else if (targetRole === 'COLLEGE') {
      setEmail('college@skillsetu.demo');
      setPassword('demo123');
    } else if (targetRole === 'COMPANY') {
      setEmail('company@skillsetu.demo');
      setPassword('demo123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const targetEmail = email.trim() || `${role.toLowerCase()}@skillsetu.demo`;
        const res = await login(targetEmail, password, role);
        if (res.success) {
          navigate(res.redirectUrl || `/${role.toLowerCase()}/dashboard`);
        } else {
          setError(res.error || 'Authentication failed. Please check credentials.');
        }
      } else {
        const payload: any = {
          email: email.trim(),
          password,
          role,
          name: name || (role === 'STUDENT' ? 'New Student' : role === 'COLLEGE' ? 'College Administrator' : 'Talent Lead'),
          institutionName: role === 'COLLEGE' ? institutionName : institution,
          companyName: role === 'COMPANY' ? companyName : undefined,
          department,
          degree
        };
        const res = await register(payload);
        if (res.success) {
          navigate(res.redirectUrl || `/${role.toLowerCase()}/dashboard`);
        } else {
          setError(res.error || 'Registration failed.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  const roleMeta = {
    STUDENT: {
      title: 'Student Portal',
      desc: 'Access your Digital Career Record, Skill Passport, and Verified Endorsements.',
      icon: GraduationCap,
      defaultEmail: 'student@skillsetu.demo'
    },
    COLLEGE: {
      title: 'College Intelligence Portal',
      desc: 'Institutional Skill Heatmap, NAAC Accreditation Analytics, and Cohort Tracking.',
      icon: Landmark,
      defaultEmail: 'college@skillsetu.demo'
    },
    COMPANY: {
      title: 'Company Recruitment Portal',
      desc: 'Verified Talent Intelligence, Job Requirement Mapping, and Explainable Matching.',
      icon: Building2,
      defaultEmail: 'company@skillsetu.demo'
    }
  };

  const MetaIcon = roleMeta[role].icon;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top back navigation */}
      <div className="max-w-md w-full mx-auto mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Choose Portal
        </button>
        <div className="flex items-center space-x-1 text-xs text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-800" />
          <span>Govt. RBAC Authenticated</span>
        </div>
      </div>

      <div className="max-w-md w-full mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1">
          {(['STUDENT', 'COLLEGE', 'COMPANY'] as UserRole[]).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r);
                setError(null);
              }}
              className={`text-xs font-bold py-2 rounded-lg transition-all ${
                role === r
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Portal Header */}
        <div className="p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-sm">
              <MetaIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">
                {roleMeta[role].title}
              </h2>
              <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                {role} ACCOUNT
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {roleMeta[role].desc}
          </p>

          {/* Mode Tabs: Login vs Register */}
          <div className="flex border-b border-slate-200 mt-5">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-colors ${
                mode === 'login'
                  ? 'border-slate-950 text-slate-950'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-colors ${
                mode === 'register'
                  ? 'border-slate-950 text-slate-950'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          {/* Registration specific fields */}
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {role === 'STUDENT' ? 'Full Name' : role === 'COLLEGE' ? 'Authorized Officer Name' : 'Talent Acquisition Lead Name'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={role === 'STUDENT' ? 'e.g. Arun Kumar' : role === 'COLLEGE' ? 'Prof. K. Ramanathan' : 'Vikram Malhotra'}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
                />
              </div>

              {role === 'STUDENT' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">College / University</label>
                    <input
                      type="text"
                      value={institution}
                      onChange={e => setInstitution(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Degree</label>
                      <input
                        type="text"
                        value={degree}
                        onChange={e => setDegree(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                      <input
                        type="text"
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
                      />
                    </div>
                  </div>
                </>
              )}

              {role === 'COLLEGE' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Institution Name</label>
                    <input
                      type="text"
                      value={institutionName}
                      onChange={e => setInstitutionName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">AISHE Code / Affiliation</label>
                    <input
                      type="text"
                      value={aisheCode}
                      onChange={e => setAisheCode(e.target.value)}
                      placeholder="e.g. C-41289"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
                    />
                  </div>
                </>
              )}

              {role === 'COMPANY' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CIN / Registration Number</label>
                    <input
                      type="text"
                      value={cinNumber}
                      onChange={e => setCinNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Email & Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={roleMeta[role].defaultEmail}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              {mode === 'login' && (
                <span className="text-[11px] text-slate-400">Default demo: demo123</span>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-950"
            />
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : mode === 'login' ? `Sign In to ${role} Portal` : `Complete ${role} Registration`}
          </button>

          {/* Quick 1-click Demo Fill */}
          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleQuickFill(role)}
              className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-lg font-medium flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-slate-900" />
              <span>Auto-Fill Demo Credentials ({roleMeta[role].defaultEmail})</span>
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-md w-full mx-auto text-center text-xs text-slate-400 mt-6">
        Protected by SkillSetu National Skill Record Protocol • AISHE / SIH 2026
      </div>
    </div>
  );
};
