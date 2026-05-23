import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { toast } from 'react-toastify';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  session: any;
  organizationId: string | null;
  organizations: any[];
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setActiveOrganization: (orgId: string) => Promise<void>;
  isDoctor: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isReceptionist: boolean;
}

const STAFF_ROLES = ['OWNER', 'ADMIN', 'DOCTOR', 'RECEPTIONIST'];
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredUser = (): User | null => {
  const raw = localStorage.getItem('tabibi_admin_user');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem('tabibi_admin_user');
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser());
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [organizationId, setOrganizationId] = useState<string | null>(localStorage.getItem('organizationId'));
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const normalizedRole = role?.toUpperCase() || null;
  const isAuthenticated = !!localStorage.getItem('tabibi_admin_token') && !!user && !!normalizedRole && STAFF_ROLES.includes(normalizedRole);
  const isDoctor = normalizedRole === 'DOCTOR';
  const isAdmin = normalizedRole === 'ADMIN' || normalizedRole === 'OWNER';
  const isOwner = normalizedRole === 'OWNER';
  const isReceptionist = normalizedRole === 'RECEPTIONIST';

  const clearAuth = () => {
    setUser(null);
    setRole(null);
    setOrganizationId(null);
    setOrganizations([]);
    localStorage.removeItem('tabibi_admin_token');
    localStorage.removeItem('tabibi_admin_user');
    localStorage.removeItem('organizationId');
    localStorage.removeItem('role');
  };

  useEffect(() => {
    const hydrate = async () => {
      const token = localStorage.getItem('tabibi_admin_token');
      if (!token) {
        clearAuth();
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/members/me');
        const memberData = response.data?.data || response.data;
        const fetchedRole = memberData?.role ? memberData.role.toUpperCase() : null;

        if (!fetchedRole || !STAFF_ROLES.includes(fetchedRole)) {
          clearAuth();
          setIsLoading(false);
          return;
        }

        setRole(fetchedRole);
        localStorage.setItem('role', fetchedRole);

        if (memberData.organizationId) {
          setOrganizationId(memberData.organizationId);
          localStorage.setItem('organizationId', memberData.organizationId);
        }

        if (memberData.organization) {
          setOrganizations([memberData.organization]);
        }

        setUser(readStoredUser());
      } catch (error) {
        console.error('Failed to hydrate admin session:', error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    hydrate();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${backendUrl}/api/legacy-auth/sign-in/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      if (!response.ok || result?.success === false || !result?.token) {
        toast.error(result?.message || 'Invalid credentials');
        return false;
      }

      const userRole = result.role?.toUpperCase();
      if (!STAFF_ROLES.includes(userRole)) {
        toast.error('This account does not have access to the admin portal');
        return false;
      }

      localStorage.setItem('tabibi_admin_token', result.token);
      localStorage.setItem('tabibi_admin_user', JSON.stringify(result.user));
      localStorage.setItem('role', userRole);
      if (result.organizationId) {
        localStorage.setItem('organizationId', result.organizationId);
      }

      setUser(result.user);
      setRole(userRole);
      setOrganizationId(result.organizationId || null);
      setOrganizations(result.organization ? [result.organization] : []);

      toast.success('Login successful!');

      const redirectPath = userRole === 'RECEPTIONIST'
        ? '/reception-appointments'
        : userRole === 'DOCTOR'
          ? '/doctor-dashboard'
          : '/admin-dashboard';

      window.location.href = redirectPath;
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
      return false;
    }
  };

  const logout = async () => {
    clearAuth();
    window.location.href = '/login';
  };

  const setActiveOrganization = async (orgId: string) => {
    setOrganizationId(orgId);
    localStorage.setItem('organizationId', orgId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: localStorage.getItem('tabibi_admin_token') ? { token: localStorage.getItem('tabibi_admin_token') } : null,
        organizationId,
        organizations,
        role: normalizedRole,
        isAuthenticated,
        isLoading,
        login,
        logout,
        setActiveOrganization,
        isDoctor,
        isAdmin,
        isOwner,
        isReceptionist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
