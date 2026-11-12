import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useUI } from '../../context/UIContext';
import { fmt } from '../../lib/format';
import Badge from '../ui/Badge';
import Switch from '../ui/Switch';
import SectionEditModal, { DraftPreviewModal } from './SectionEditModal';

const sectionState = (record) => !record.live ? 'Unpublished' : JSON.stringify(record.live) !== JSON.stringify(record.draft) ? 'Draft changes' : 'Published';

export default function SectionManager({ module }) {
  const { state, commit } = useStore();
  const { user } = useAuth();
  const { toast } = useUI();
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);
  const records = state[module];
  const saveDraft = (publish = false) => {
    const selected = editing;
    const allowed = commit(user, module, publish ? 'publish' : 'edit', selected.name, '', (draft) => {
      const record = draft[module].find((item) => item.id === selected.id);
      record.draft = { ...selected.value };
      if (publish) record.live = { ...selected.value };
      record.by = user.name;
      record.at = new Date().toISOString();
    }, publish ? 'Published' : 'Saved draft');
    if (allowed) {
      toast(publish ? 'Published. The public website now shows this content.' : 'Draft saved. The public website is unchanged.');
      setEditing(null);
    }
  };
  const reorder = (index, offset) => {
    const target = index + offset;
    if (target < 0 || target >= records.length) return;
    commit(user, module, 'edit', records[index].name, '', (draft) => {
      [draft[module][index], draft[module][target]] = [draft[module][target], draft[module][index]];
    }, 'Reordered');
  };
  return <>
    <div className="card tw"><table><thead><tr><th>Section</th><th>Heading</th><th>Status</th><th>Visible</th><th>Updated</th><th></th></tr></thead><tbody>
      {records.map((record, index) => <tr key={record.id}>
        <td><b>{record.name}</b></td><td className="mut">{record.draft.heading}</td><td><Badge>{sectionState(record)}</Badge></td>
        <td><Switch checked={record.enabled} label={`${record.enabled ? 'Hide' : 'Show'} ${record.name}`} onChange={() => commit(user, module, 'edit', record.name, '', (draft) => {
          const item = draft[module].find((entry) => entry.id === record.id);
          item.enabled = !item.enabled; item.at = new Date().toISOString(); item.by = user.name;
        }, record.enabled ? 'Hidden' : 'Shown')} /></td>
        <td className="sm mut">{record.by}<br />{fmt(record.at)}</td><td className="actions"><button className="b2" onClick={() => setEditing({ id: record.id, name: record.name, value: { ...record.draft } })}>Edit</button>
          <button className="bg" aria-label={`Move ${record.name} up`} onClick={() => reorder(index, -1)}>↑</button><button className="bg" aria-label={`Move ${record.name} down`} onClick={() => reorder(index, 1)}>↓</button></td>
      </tr>)}
    </tbody></table></div>
    {editing && <SectionEditModal module={module} name={editing.name} value={editing.value} onChange={(value) => setEditing({ ...editing, value })} onClose={() => setEditing(null)} onPreview={() => setPreview(editing.value)} onSaveDraft={() => saveDraft(false)} onPublish={() => saveDraft(true)} role={user?.role} />}
    {preview && <DraftPreviewModal value={preview} onClose={() => setPreview(null)} />}
  </>;
}
