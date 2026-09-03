import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, CollegeProfile, CompanyProfile, StudentProfile } from '../types';
import { DEMO_USER_ACCOUNTS, DEMO_COLLEGE_PROFILE, DEMO_COMPANY_PROFILE, STAR_STUDENT_ARUN } from '../data/seedData';

export type UserRole = 'STUDENT' | 'COLLEGE' | 'COMPANY';

interface AuthContextType {
  currentUser: UserAccount | null;
  activeRole: UserRole;
  token: string | null;
  studentProfile: StudentProfile;
  collegeProfile: CollegeProfile;
  companyProfile: CompanyProfile;
  login: (email: string, password?: string, targetRole?: UserRole) => Promise<{ success: boolean; redirectUrl: string; error?: string }>;
  register: (payload: { email: string; password?: string; role: UserRole; name: string; institutionName?: string; companyName?: string; department?: string; degree?: string }) => Promise<{ success: boolean; redirectUrl: string; error?: string }>;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  updateCollegeProfile: (profile: Partial<CollegeProfile>) => void;
  updateCompanyProfile: (profile: Partial<CompanyProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('skillsetu_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEMO_USER_ACCOUNTS[0]; // Default: Arun Kumar (Student)
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('skillsetu_role') as UserRole;
    if (savedRole && ['STUDENT', 'COLLEGE', 'COMPANY'].includes(savedRole)) {
      return savedRole;
    }
    return currentUser?.role || 'STUDENT';
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('skillsetu_token') || `JWT-DEMO-${currentUser.id}`;
  });

  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('skillsetu_student_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return STAR_STUDENT_ARUN;
  });

  const [collegeProfile, setCollegeProfile] = useState<CollegeProfile>(() => {
    const saved = localStorage.getItem('skillsetu_college_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEMO_COLLEGE_PROFILE;
  });

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(() => {
    const saved = localStorage.getItem('skillsetu_company_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEMO_COMPANY_PROFILE;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('skillsetu_user', JSON.stringify(currentUser));
      localStorage.setItem('skillsetu_role', currentUser.role);
      setActiveRole(currentUser.role);
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('skillsetu_token', token);
    }
  }, [token]);

  const login = async (email: string, password = 'demo123', targetRole?: UserRole) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: targetRole })
      });
      const data = await res.json();
      if (data.success) {
        const found = DEMO_USER_ACCOUNTS.find(u => u.id === data.user.id) || {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.role as UserRole,
          status: 'ACTIVE' as const,
          created_at: new Date().toISOString()
        };
        setCurrentUser(found);
        setActiveRole(data.role as UserRole);
        setToken(data.token);
        return { success: true, redirectUrl: data.redirectUrl };
      }
      return { success: false, redirectUrl: '', error: data.error || 'Login failed' };
    } catch (err: any) {
      // Offline fallback
      let fallbackUser = DEMO_USER_ACCOUNTS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!fallbackUser && targetRole) {
        fallbackUser = DEMO_USER_ACCOUNTS.find(u => u.role === targetRole);
      }
      if (!fallbackUser) {
        fallbackUser = DEMO_USER_ACCOUNTS[0];
      }
      setCurrentUser(fallbackUser);
      setActiveRole(fallbackUser.role);
      const url = `/${fallbackUser.role.toLowerCase()}/dashboard`;
      return { success: true, redirectUrl: url };
    }
  };

  const register = async (payload: {
    email: string;
    password?: string;
    role: UserRole;
    name: string;
    institutionName?: string;
    companyName?: string;
    department?: string;
    degree?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        const newUser: UserAccount = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: payload.role,
          status: 'ACTIVE',
          created_at: new Date().toISOString()
        };
        setCurrentUser(newUser);
        setActiveRole(payload.role);
        setToken(data.token);
        return { success: true, redirectUrl: data.redirectUrl };
      }
      return { success: false, redirectUrl: '', error: data.error || 'Registration failed' };
    } catch (err: any) {
      const fallbackUser = DEMO_USER_ACCOUNTS.find(u => u.role === payload.role) || DEMO_USER_ACCOUNTS[0];
      setCurrentUser(fallbackUser);
      setActiveRole(payload.role);
      return { success: true, redirectUrl: `/${payload.role.toLowerCase()}/dashboard` };
    }
  };

  const switchRole = (role: UserRole) => {
    const matchedAccount = DEMO_USER_ACCOUNTS.find(u => u.role === role) || {
      id: `acc-${role.toLowerCase()}-switch`,
      email: `${role.toLowerCase()}@skillsetu.demo`,
      name: role === 'STUDENT' ? 'Arun Kumar' : role === 'COLLEGE' ? 'Prof. K. Ramanathan' : 'Vikram Malhotra',
      role,
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    };
    setCurrentUser(matchedAccount);
    setActiveRole(role);
    setToken(`JWT-DEMO-${matchedAccount.id}-${Date.now()}`);
    localStorage.setItem('skillsetu_role', role);
  };

  const logout = () => {
    localStorage.removeItem('skillsetu_user');
    localStorage.removeItem('skillsetu_token');
    localStorage.removeItem('skillsetu_role');
    setCurrentUser(null);
  };

  const updateStudentProfile = (updated: Partial<StudentProfile>) => {
    setStudentProfile(prev => {
      const next = { ...prev, ...updated };
      localStorage.setItem('skillsetu_student_profile', JSON.stringify(next));
      return next;
    });
  };

  const updateCollegeProfile = (updated: Partial<CollegeProfile>) => {
    setCollegeProfile(prev => {
      const next = { ...prev, ...updated };
      localStorage.setItem('skillsetu_college_profile', JSON.stringify(next));
      return next;
    });
  };

  const updateCompanyProfile = (updated: Partial<CompanyProfile>) => {
    setCompanyProfile(prev => {
      const next = { ...prev, ...updated };
      localStorage.setItem('skillsetu_company_profile', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        token,
        studentProfile,
        collegeProfile,
        companyProfile,
        login,
        register,
        switchRole,
        logout,
        updateStudentProfile,
        updateCollegeProfile,
        updateCompanyProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
