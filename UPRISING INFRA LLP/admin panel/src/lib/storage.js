export const SESSION_KEY = 'uprising_admin_session';

export const api = {
  // Content now lives in the backend. These stubs keep older imports from crashing.
  load() {
    return null;
  },
  save() {},
  loadSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    } catch (error) {
      console.error('Unable to load admin session.', error);
      return null;
    }
  },
  saveSession(session) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },
  clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  },
};