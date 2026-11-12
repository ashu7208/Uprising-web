import { useSyncExternalStore } from 'react';

const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const CACHE_KEY = 'uprising_site_content_v1';

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
  } catch {
    return null;
  }
}

let snapshot = readCache();
const listeners = new Set();

function publish(data) {
  snapshot = data;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch { /* storage blocked or full */ }
  listeners.forEach((listener) => listener());
}

// Fetch once when the site loads. If it fails, the site keeps cached or built-in content.
if (API) {
  fetch(`${API}/api/public/content`)
    .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Bad response'))))
    .then(publish)
    .catch(() => {});
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useSiteContent = () => useSyncExternalStore(subscribe, () => snapshot);

export const findSection = (list, name) => (list || []).find((item) => item.name === name);
export const textLines = (text) => String(text || '').split('\n').map((line) => line.trim()).filter(Boolean);
export const textRows = (text) => textLines(text).map((line) => line.split('|').map((part) => part.trim()));