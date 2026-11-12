import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from './StoreContext';
import { useUI } from './UIContext';
import { api } from '../lib/storage';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => api.loadSession());
  const { state, update } = useStore();
  const { toast } = useUI();
  const navigate = useNavigate();

  const login = useCallback((email, password) => {
    const record = state.users.find((item) => item.email === email.trim() && item.password === password && item.status === 'active');
    if (!record) {
      toast('Wrong email or password, or the account is disabled.', 'error');
      return false;
    }
    const session = { name: record.name, role: record.role, id: record.id };
    setUser(session);
    api.saveSession(session);
    update(() => {}, { action: 'Login', module: 'Auth', user: session });
    navigate('/');
    return true;
  }, [state.users, toast, update, navigate]);

  const logout = useCallback(() => {
    update(() => {}, { action: 'Logout', module: 'Auth', user });
    api.clearSession();
    setUser(null);
    navigate('/login');
  }, [update, user, navigate]);

  const changePassword = useCallback((password) => {
    if (password.length < 6) {
      toast('At least 6 characters', 'error');
      return false;
    }
    update((draft) => {
      const record = draft.users.find((item) => item.id === user?.id);
      if (record) record.password = password;
    }, { action: 'Changed password', module: 'Auth', user });
    toast('Password changed');
    return true;
  }, [update, user, toast]);

  const value = useMemo(() => ({ user, login, logout, changePassword }), [user, login, logout, changePassword]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
