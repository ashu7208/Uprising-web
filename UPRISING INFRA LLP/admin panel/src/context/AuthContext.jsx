import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from './StoreContext';
import { useUI } from './UIContext';
import { api } from '../lib/storage';
import { request } from '../lib/backend';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => api.loadSession()?.user || null);
  const { reload, reset } = useStore();
  const { toast } = useUI();
  const navigate = useNavigate();

  const login = useCallback(async (email, password) => {
    try {
      const { token, user: profile } = await request('/api/auth/login', {
        method: 'POST', body: { email: email.trim(), password }, auth: false,
      });
      api.saveSession({ token, user: profile });
      await reload();
      setUser(profile);
      navigate('/');
      return true;
    } catch (error) {
      api.clearSession();
      toast(error.message, 'error');
      return false;
    }
  }, [reload, toast, navigate]);

  const logout = useCallback(async () => {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } catch { /* sign out anyway */ }
    api.clearSession();
    reset();
    setUser(null);
    navigate('/login');
  }, [reset, navigate]);

  const changePassword = useCallback((password) => {
    if (password.length < 8) {
      toast('At least 8 characters', 'error');
      return false;
    }
    request('/api/auth/change-password', { method: 'POST', body: { password } })
      .then(() => toast('Password changed'))
      .catch((error) => toast(error.message, 'error'));
    return true;
  }, [toast]);

  const value = useMemo(() => ({ user, login, logout, changePassword }), [user, login, logout, changePassword]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}