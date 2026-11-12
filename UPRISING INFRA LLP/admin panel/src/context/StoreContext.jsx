import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { request } from '../lib/backend';
import { api } from '../lib/storage';
import { now } from '../lib/format';
import { can } from '../lib/permissions';
import { useUI } from './UIContext';

const StoreContext = createContext(null);
export const useStore = () => useContext(StoreContext);

const collections = ['home', 'about', 'services', 'projects', 'clients', 'leadership', 'faqs', 'nav', 'seo', 'users', 'enquiries', 'media', 'logs', 'backups'];
const SAVED_WHOLE = ['home', 'about', 'services', 'projects', 'clients', 'leadership', 'faqs', 'nav', 'seo', 'settings', 'media', 'backups'];

const emptyState = () => ({
  nid: 2000, home: [], about: [], services: [], projects: [], clients: [], leadership: [], faqs: [],
  nav: [], seo: [], users: [], enquiries: [], media: [], logs: [], backups: [], settings: {},
});

function nextId(state) {
  const maximum = collections.flatMap((key) => state[key] || []).reduce((value, record) => Math.max(value, Number(record.id) || 0), 0);
  return Math.max(Number(state.nid) || 2000, maximum + 1);
}

const changed = (a, b) => JSON.stringify(a) !== JSON.stringify(b);
const byId = (list) => new Map((list || []).map((item) => [item.id, item]));

/** Sends the difference between two states to the backend. Returns true if the state should be reloaded. */
async function pushChanges(prev, next) {
  let reload = false;

  for (const name of SAVED_WHOLE) {
    if (changed(prev[name], next[name])) {
      await request(`/api/admin/content/${name}`, { method: 'PUT', body: { data: next[name] } });
    }
  }

  const knownLogs = new Set((prev.logs || []).map((log) => log.id));
  const newLogs = (next.logs || []).filter((log) => !knownLogs.has(log.id)).reverse();
  for (const log of newLogs) {
    await request('/api/admin/logs', { method: 'POST', body: { action: log.action, mod: log.mod, rec: log.rec, detail: log.detail } });
  }

  const oldEnquiries = byId(prev.enquiries);
  const newEnquiries = byId(next.enquiries);
  for (const [id, item] of newEnquiries) {
    if (!oldEnquiries.has(id)) {
      await request('/api/admin/enquiries', { method: 'POST', body: item });
      reload = true;
    } else if (changed(oldEnquiries.get(id), item)) {
      await request(`/api/admin/enquiries/${id}`, { method: 'PATCH', body: { status: item.status, notes: item.notes, follow: item.follow } });
    }
  }
  for (const id of oldEnquiries.keys()) {
    if (!newEnquiries.has(id)) await request(`/api/admin/enquiries/${id}`, { method: 'DELETE' });
  }

  const oldUsers = byId(prev.users);
  const newUsers = byId(next.users);
  for (const [id, user] of newUsers) {
    const body = { name: user.name, email: user.email, role: user.role, status: user.status, password: user.password || undefined };
    if (!oldUsers.has(id)) {
      await request('/api/admin/users', { method: 'POST', body });
      reload = true;
    } else if (changed(oldUsers.get(id), user)) {
      await request(`/api/admin/users/${id}`, { method: 'PUT', body });
      reload = true;
    }
  }
  for (const id of oldUsers.keys()) {
    if (!newUsers.has(id)) {
      await request(`/api/admin/users/${id}`, { method: 'DELETE' });
      reload = true;
    }
  }

  return reload;
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(emptyState);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState('');
  const synced = useRef(null);
  const queue = useRef(Promise.resolve());
  const { toast } = useUI();

  const load = useCallback(async () => {
    const data = await request('/api/admin/state');
    const full = { ...emptyState(), ...data };
    full.nid = nextId(full);
    synced.current = full;
    setState(full);
    setReady(true);
    setLoadError('');
  }, []);

  const retry = useCallback(() => {
    setLoadError('');
    load().catch((error) => setLoadError(error.message));
  }, [load]);

  const reset = useCallback(() => {
    synced.current = null;
    setState(emptyState());
    setReady(false);
  }, []);

  // Load once on start if someone is already signed in
  useEffect(() => {
    if (!api.loadSession()?.token) return;
    load().catch((error) => setLoadError(error.message));
  }, [load]);

  // Save every change to the backend, one after another
  useEffect(() => {
    const previous = synced.current;
    if (!ready || !previous || previous === state) return;
    synced.current = state;
    queue.current = queue.current.then(async () => {
      try {
        if (await pushChanges(previous, state)) await load();
      } catch (error) {
        toast(error.message, 'error');
        try { await load(); } catch { /* ignore */ }
      }
    });
  }, [state, ready, load, toast]);

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

  const value = useMemo(
    () => ({ state, update, commit, ready, loadError, reload: load, retry, reset }),
    [state, update, commit, ready, loadError, load, retry, reset],
  );
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}