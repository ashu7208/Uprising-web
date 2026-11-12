import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useUI } from '../context/UIContext';
import { useDebounce } from '../hooks/useDebounce';
import { csv, fmt, now, download } from '../lib/format';
import { can } from '../lib/permissions';
import Badge from '../components/ui/Badge';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import EnquiryModal from '../components/forms/EnquiryModal';
import SimulateEnquiryModal from '../components/forms/SimulateEnquiryModal';

const STATUSES = ['New', 'Contacted', 'In Progress', 'Converted', 'Closed'];
const enquiryFields = [['name', 'Name', 'text'], ['phone', 'Phone', 'text'], ['email', 'Email', 'text'], ['service', 'Service required', 'select', ['Civil', 'Electrical', 'Water Treatment', 'Other']], ['message', 'Message', 'textarea']];
const emptyEnquiry = { name: '', phone: '', email: '', service: 'Civil', message: '' };

export default function Enquiries() {
  const { state, commit } = useStore();
  const { user } = useAuth();
  const { toast } = useUI();
  const [query, setQuery] = useState('');
  const search = useDebounce(query);
  const [service, setService] = useState('');
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({});
  const [note, setNote] = useState('');
  const [remove, setRemove] = useState(null);
  const [follow, setFollow] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const rows = useMemo(() => state.enquiries.filter((item) =>
    (!search || JSON.stringify(item).toLowerCase().includes(search.toLowerCase()))
    && (!service || item.service === service) && (!status || item.status === status)
    && (!from || item.at.slice(0, 10) >= from),
  ).sort((a, b) => b.at.localeCompare(a.at)), [state.enquiries, search, service, status, from]);

  const openEnquiry = (item) => {
    setSelected(item);
    setEditStatus(item.status);
    setFollow(item.follow || '');
    setNote('');
  };
  const updateStatus = (item, value) => commit(user, 'enquiries', 'edit', item.name, value, (draft) => {
    draft.enquiries.find((record) => record.id === item.id).status = value;
  }, 'Changed status');
  const submitEnquiry = () => {
    if (!form.name?.trim() || !form.phone?.trim() || !/^\S+@\S+\.\S+$/.test(form.email || '')) {
      toast('Name, phone and a valid email are required', 'error');
      return;
    }
    const success = commit(user, 'enquiries', 'edit', form.name, '', (draft) => {
      draft.enquiries.push({ id: draft.nid++, ...form, name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), status: 'New', at: now(), notes: [], follow: '' });
    }, 'Simulated website enquiry');
    if (success) {
      toast('Enquiry saved as New');
      setCreating(false);
      setForm({});
    }
  };
  const saveEnquiry = () => {
    const success = commit(user, 'enquiries', 'edit', selected.name, editStatus, (draft) => {
      const item = draft.enquiries.find((record) => record.id === selected.id);
      item.status = editStatus;
      item.follow = follow;
      if (note.trim()) item.notes.push({ by: user.name, at: now(), t: note.trim() });
    }, 'Updated enquiry');
    if (success) {
      setSelected(null);
      toast('Enquiry updated');
    }
  };
  const exportCsv = () => {
    download('enquiries.csv', csv([['Name', 'Phone', 'Email', 'Service', 'Message', 'Status', 'Received', 'Follow-up'], ...state.enquiries.map((item) => [item.name, item.phone, item.email, item.service, item.message, item.status, item.at, item.follow])]), 'text/csv');
    commit(user, 'enquiries', 'view', '', '', () => {}, 'Exported CSV');
  };
  const deleteEnquiry = () => {
    const success = commit(user, 'enquiries', 'delete', remove.name, '', (draft) => {
      draft.enquiries = draft.enquiries.filter((item) => item.id !== remove.id);
    }, 'Deleted enquiry');
    if (success) setRemove(null);
  };
  const services = ['Civil', 'Electrical', 'Water Treatment', 'Other'];

  return <>
    <div className="tb">
      <input placeholder="Search name, phone, email…" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search enquiries" />
      <select value={service} onChange={(event) => setService(event.target.value)} aria-label="Filter by service"><option value="">All services</option>{services.map((item) => <option key={item}>{item}</option>)}</select>
      <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status"><option value="">All status</option>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select>
      <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} title="From date" aria-label="From date" />
      <span className="sp" /><button className="b2" onClick={() => { setCreating(true); setForm({ ...emptyEnquiry }); }}>Simulate website enquiry</button><button className="b2" onClick={exportCsv}>Export CSV</button>
    </div>
    <div className="card tw">{rows.length ? <table><thead><tr><th>Customer</th><th>Service</th><th>Received</th><th>Status</th><th></th></tr></thead><tbody>
      {rows.map((item) => <tr key={item.id}><td><b>{item.name}</b>{item.status === 'New' && <> <span className="pill p-new">New</span></>}<br /><span className="mut sm">{item.phone} · {item.email}</span></td><td>{item.service}</td><td className="sm">{fmt(item.at)}</td><td>
        <select value={item.status} disabled={!can(user?.role, 'enquiries', 'edit')} onChange={(event) => updateStatus(item, event.target.value)} aria-label={`Status for ${item.name}`}>{STATUSES.map((option) => <option key={option}>{option}</option>)}</select>
      </td><td className="actions"><button className="b2" onClick={() => openEnquiry(item)}>Open</button> <button className="bg" disabled={!can(user?.role, 'enquiries', 'delete')} onClick={() => setRemove(item)}>Delete</button></td></tr>)}
    </tbody></table> : <EmptyState>No enquiries match.</EmptyState>}</div>
    {creating && <SimulateEnquiryModal fields={enquiryFields} value={form} onChange={setForm} onClose={() => setCreating(false)} onSubmit={submitEnquiry} />}
    {selected && <EnquiryModal record={selected} status={editStatus} setStatus={setEditStatus} follow={follow} setFollow={setFollow} note={note} setNote={setNote} onClose={() => setSelected(null)} onSave={saveEnquiry} disabled={!can(user?.role, 'enquiries', 'edit')} />}
    {remove && <ConfirmDialog message="Delete this enquiry permanently?" onCancel={() => setRemove(null)} onConfirm={deleteEnquiry} />}
  </>;
}
