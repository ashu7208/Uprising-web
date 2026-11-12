const DATA_KEY = 'uprising_admin_proto_v1';
export const SESSION_KEY = 'uprising_admin_user';

export const api = {
  load() {
    try {
      const value = localStorage.getItem(DATA_KEY);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Unable to load admin data from local storage.', error);
      return null;
    }
  },
  save(data) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  },
  loadSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    } catch (error) {
      console.error('Unable to load admin session.', error);
      return null;
    }
  },
  saveSession(user) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },
  clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  },
};
