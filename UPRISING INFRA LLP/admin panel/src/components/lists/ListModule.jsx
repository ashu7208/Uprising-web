import { useMemo, useState } from 'react';
import { LISTS, ST } from '../../data/config';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useUI } from '../../context/UIContext';
import { can } from '../../lib/permissions';
import { useDebounce } from '../../hooks/useDebounce';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import ConfirmDialog from '../ui/ConfirmDialog';
import RecordModal from './RecordModal';

export default function ListModule({ module }) {
  const config = LISTS[module];
  const { state, commit } = useStore();
  const { user } = useAuth();
  const { toast } = useUI();
  const [query, setQuery] = useState('');
  const search = useDebounce(query);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const rowsAll = state[module];
  const permissionModule = config.mod || module;
  const newRecord = () => Object.fromEntries(config.f.map(([name, , type, options]) => [
    name,
    type === 'select' ? options?.[0] ?? '' : type === 'bool' ? false : '',
  ]));
  const categories = config.flt ? [...new Set(rowsAll.map((record) => record[config.flt]))] : [];
  const filtered = useMemo(() => rowsAll.filter((record) => {
    const matchesText = !search || JSON.stringify(record).toLowerCase().includes(search.toLowerCase());
    const matchesFilter = !filter || record.status === filter || record[config.flt] === filter;
    return matchesText && matchesFilter;
  }), [rowsAll, search, filter, config.flt]);
  const pages = Math.max(1, Math.ceil(filtered.length / 8));
  const shown = filtered.slice((page - 1) * 8, page * 8);
  const mediaFor = (record) => state.media.find((item) => item.id === (record.image || record.logo || record.photo));

  const save = () => {
    const first = config.f[0][0];
    if (!form.value[first]) {
      toast(`Please fill in ${config.f[0][1]}`, 'error');
      return;
    }
    if (module === 'users' && !/^\S+@\S+\.\S+$/.test(form.value.email)) {
      toast('Enter a valid email', 'error');
      return;
    }
    if (module === 'users' && form.value.password.length < 6) {
      toast('Password must be at least 6 characters', 'error');
      return;
    }
    const action = form.id ? 'Updated' : 'Created';
    const done = commit(user, permissionModule, 'edit', form.value[first], '', (draft) => {
      if (form.id) Object.assign(draft[module].find((item) => item.id === form.id), form.value);
      else draft[module].push({ id: draft.nid++, status: 'published', ...form.value });
    }, action);
    if (done) {
      toast('Saved');
      setForm(null);
    }
  };
  const move = (id, offset) => {
    const index = rowsAll.findIndex((record) => record.id === id);
    const target = index + offset;
    if (target < 0 || target >= rowsAll.length) return;
    const record = rowsAll[index];
    const label = record.title || record.name || record.q || record.label || record.email;
    commit(user, permissionModule, 'edit', label, '', (draft) => {
      const records = draft[module];
      [records[index], records[target]] = [records[target], records[index]];
    }, 'Reordered');
  };
  const remove = () => {
    const record = confirm;
    const label = record.title || record.name || record.q || record.label || record.email;
    const allowed = commit(user, permissionModule, 'delete', label, '', (draft) => {
      draft[module] = draft[module].filter((item) => item.id !== record.id);
    }, 'Deleted');
    if (allowed) setConfirm(null);
  };
  const statusOptions = module === 'nav' ? ['visible', 'hidden'] : module === 'users' ? ['active', 'disabled'] : ST;

  return <>
    <div className="tb">
      <input placeholder="Search…" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} aria-label="Search records" />
      <select aria-label="Filter records" value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1); }}>
        <option value="">All status</option>{statusOptions.map((option) => <option key={option}>{option}</option>)}
        {categories.map((option) => <option key={option}>{option}</option>)}
      </select>
      <span className="sp" />
      {!config.fixed && <button className="b" disabled={!can(user?.role, permissionModule, 'edit')} onClick={() => setForm({ id: null, value: newRecord() })}>+ Add {config.t.toLowerCase()}</button>}
    </div>
    <div className="card tw">
      {shown.length ? <table><thead><tr><th></th>{config.c.map((key) => <th key={key}>{key}</th>)}<th>Status</th><th></th></tr></thead><tbody>
        {shown.map((record) => {
          const image = mediaFor(record);
          return <tr key={record.id}><td>{image && <img className="thumb" src={image.src} alt={image.alt} />}</td>
            {config.c.map((key) => <td key={key}>{record[key]}</td>)}
            <td><Badge>{record.status || record.robots}</Badge>{record.featured ? ' ★' : ''}</td>
            <td className="actions"><button className="b2" onClick={() => setForm({ id: record.id, value: { ...record } })}>Edit</button>
              {!config.fixed && <><button className="bg" aria-label={`Move ${record.title || record.name || record.q} up`} onClick={() => move(record.id, -1)}>↑</button><button className="bg" aria-label={`Move ${record.title || record.name || record.q} down`} onClick={() => move(record.id, 1)}>↓</button>
                <button className="bg" disabled={!can(user?.role, permissionModule, 'delete')} onClick={() => setConfirm(record)}>Delete</button></>}
            </td></tr>;
        })}
      </tbody></table> : <EmptyState>Nothing found. Add your first item or change the filters.</EmptyState>}
    </div>
    <div className="tb pagination"><button className="b2" disabled={page < 2} onClick={() => setPage(page - 1)}>‹ Prev</button><span className="mut">Page {page} of {pages}</span><button className="b2" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next ›</button></div>
    {form && <RecordModal title={`${form.id ? 'Edit' : 'Add'} ${config.t.toLowerCase()}`} fields={config.f} value={form.value} onChange={(value) => setForm({ ...form, value })} onClose={() => setForm(null)} onSave={save} disabled={!can(user?.role, permissionModule, 'edit')} />}
    {confirm && <ConfirmDialog message="Delete this item permanently?" onCancel={() => setConfirm(null)} onConfirm={remove} />}
  </>;
}
