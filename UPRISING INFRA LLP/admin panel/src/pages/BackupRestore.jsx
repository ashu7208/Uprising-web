import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useUI } from '../context/UIContext';
import { download, fmt, now } from '../lib/format';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';

export default function BackupRestore() {
  const { state, commit } = useStore();
  const { user } = useAuth();
  const { toast } = useUI();
  const [confirm, setConfirm] = useState(null);
  const fileRef = useRef(null);
  const snapshot = () => {
    const { backups, ...data } = state;
    return JSON.stringify(data);
  };
  const createBackup = () => {
    const data = snapshot();
    commit(user, 'backup', 'edit', '', '', (draft) => {
      draft.backups.unshift({ id: draft.nid++, at: now(), by: user.name, data });
    }, 'Created backup');
    toast('Backup created');
  };
  const restoreData = (data, action) => {
    if (!data || !Array.isArray(data.home) || !data.settings || typeof data.settings !== 'object') {
      toast('Not a valid backup file', 'error');
      return;
    }
    commit(user, 'backup', 'edit', '', '', (draft) => {
      const currentBackups = draft.backups;
      const currentId = draft.nid;
      Object.keys(draft).forEach((key) => delete draft[key]);
      Object.assign(draft, data, { backups: currentBackups, nid: Math.max(data.nid || 2000, currentId) });
    }, action);
    toast('Backup restored');
    setConfirm(null);
  };
  const restoreHistory = (item) => setConfirm({ message: 'Restore this backup? Current content will be replaced.', action: () => {
    try { restoreData(JSON.parse(item.data), 'Restored backup'); } catch { toast('Not a valid backup file', 'error'); }
  } });
  const readFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onerror = () => toast('Not a valid backup file', 'error');
    reader.onload = () => setConfirm({ message: 'Restore from this file? Current content will be replaced.', action: () => {
      try { restoreData(JSON.parse(String(reader.result)), 'Restored from file'); } catch { toast('Not a valid backup file', 'error'); setConfirm(null); }
    } });
    reader.readAsText(file);
  };
  return <>
    <div className="card"><h3 style={{ marginTop: 0 }}>Backups</h3><p className="mut">A snapshot contains all content, enquiries, media and settings. (Prototype: stored in this browser; production: MySQL dump on the server, not publicly accessible.)</p>
      <button className="b" onClick={createBackup}>Create backup now</button>{' '}
      <button className="b2" onClick={() => fileRef.current?.click()}>Restore from file</button>
      <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={(event) => { readFile(event.target.files?.[0]); event.target.value = ''; }} />
    </div>
    <div className="card tw" style={{ marginTop: 16 }}>{state.backups.length ? <table><thead><tr><th>Created</th><th>By</th><th>Size</th><th></th></tr></thead><tbody>
      {state.backups.map((item) => <tr key={item.id}><td>{fmt(item.at)}</td><td>{item.by}</td><td>{(item.data.length / 1024).toFixed(0)} KB</td><td className="actions">
        <button className="b2" onClick={() => download(`uprising-backup-${item.at.slice(0, 10)}.json`, item.data, 'application/json')}>Download</button>{' '}
        <button className="bd" onClick={() => restoreHistory(item)}>Restore</button>
      </td></tr>)}
    </tbody></table> : <EmptyState>No backups yet.</EmptyState>}</div>
    {confirm && <ConfirmDialog message={confirm.message} onCancel={() => setConfirm(null)} onConfirm={confirm.action} />}
  </>;
}
