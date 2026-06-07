import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../lib/api';
interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  roles: string[];
  permissions: string[];
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);
  const fetchUser = async () => {
    try {
      const response = await authApi.me();
      setUser(response.data.data);
      localStorage.setItem('permissions', JSON.stringify(response.data.data.permissions || []));
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };
  const login = async (token: string) => {
    localStorage.setItem('accessToken', token);
    await fetchUser();
  };
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('permissions');
    setUser(null);
  };
  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission) || false;
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission }}>
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
