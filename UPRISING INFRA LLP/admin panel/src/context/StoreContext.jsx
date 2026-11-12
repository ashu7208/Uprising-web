import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { seed } from '../data/seed';
import { api } from '../lib/storage';
import { now } from '../lib/format';
import { can } from '../lib/permissions';
import { useUI } from './UIContext';

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);
const collections = ['home', 'about', 'services', 'projects', 'clients', 'leadership', 'faqs', 'nav', 'seo', 'users', 'enquiries', 'media', 'logs', 'backups'];

function nextId(state) {
  const maximum = collections.flatMap((key) => state[key] || []).reduce((value, record) => Math.max(value, Number(record.id) || 0), 0);
  return Math.max(Number(state.nid) || 2000, maximum + 1);
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => api.load() || seed());
  const { toast } = useUI();

  useEffect(() => {
    try {
      api.save(state);
    } catch (error) {
      console.error('Unable to persist admin data.', error);
      toast('Storage is full. Delete some media.', 'error');
    }
  }, [state, toast]);

  const update = useCallback((mutate, event = {}) => {
    setState((current) => {
      const next = structuredClone(current);
      next.nid = nextId(next);
      mutate(next);
      next.nid = nextId(next);
      if (event.action) {
        next.logs.unshift({
          id: next.nid++, user: event.user?.name || 'System', action: event.action,
          mod: event.module || '', rec: event.record || '', detail: event.detail || '', at: now(),
        });
        next.logs = next.logs.slice(0, 300);
      }
      return next;
    });
  }, []);

  const commit = useCallback((user, module, permission, record, detail, mutate, action = permission) => {
    if (!can(user?.role, module, permission)) {
      toast('Not allowed', 'error');
      return false;
    }
    update(mutate, { action, module, record, detail, user });
    return true;
  }, [toast, update]);

  const value = useMemo(() => ({ state, update, commit }), [state, update, commit]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
