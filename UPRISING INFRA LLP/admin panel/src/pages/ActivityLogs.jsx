import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useDebounce } from '../hooks/useDebounce';
import { fmt } from '../lib/format';
import EmptyState from '../components/ui/EmptyState';

export default function ActivityLogs() {
  const { state } = useStore();
  const [query, setQuery] = useState('');
  const search = useDebounce(query);
  const rows = state.logs.filter((item) => !search || JSON.stringify(item).toLowerCase().includes(search.toLowerCase()));
  return <>
    <div className="tb"><input placeholder="Search logs…" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search activity logs" /></div>
    <div className="card tw">{rows.length ? <table><thead><tr><th>When</th><th>User</th><th>Action</th><th>Module</th><th>Record / change</th></tr></thead><tbody>
      {rows.map((item) => <tr key={item.id}><td className="sm">{fmt(item.at)}</td><td>{item.user}</td><td>{item.action}</td><td>{item.mod}</td><td className="sm">{item.rec} <span className="mut">{item.detail}</span></td></tr>)}
    </tbody></table> : <EmptyState>No activity recorded yet.</EmptyState>}</div>
  </>;
}
