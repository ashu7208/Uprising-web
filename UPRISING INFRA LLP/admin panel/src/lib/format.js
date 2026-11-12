export const now = () => new Date().toISOString();
export const fmt = (date) => date ? new Date(date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '-';
export const slug = (value) => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
export const lines = (text) => String(text || '').split('\n').map((line) => line.trim()).filter(Boolean);
export const csv = (rows) => rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');

export function download(name, content, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
