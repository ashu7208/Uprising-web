import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useUI } from '../context/UIContext';
import { can } from '../lib/permissions';
import Switch from '../components/ui/Switch';
import Modal from '../components/ui/Modal';
import PublicPreview from '../components/public/PublicPreview';
import useModal from '../hooks/useModal';

export default function WebsiteManagement() {
  const preview = useModal();
  const { state, commit } = useStore();
  const { user } = useAuth();
  const { toast } = useUI();
  const pages = [['Home', 'home'], ['About', 'about']];
  const toggle = () => {
    if (!can(user?.role, 'settings', 'edit')) {
      toast('Not allowed', 'error');
      return;
    }
    commit(user, 'settings', 'edit', 'maintenance', '', (draft) => { draft.settings.maint = !draft.settings.maint; }, `Maintenance ${state.settings.maint ? 'off' : 'on'}`);
  };
  return <div className="grid g2">
    {pages.map(([label, key]) => <div className="card" key={key}><h3 style={{ marginTop: 0 }}>{label} page</h3><p className="mut">{state[key].length} sections · {state[key].filter((item) => item.enabled).length} visible · {state[key].filter((item) => !item.live || JSON.stringify(item.live) !== JSON.stringify(item.draft)).length} need publishing</p><Link className="b2" to={`/${key}`}>Manage sections</Link></div>)}
    <div className="card"><h3 style={{ marginTop: 0 }}>Maintenance mode</h3><p className="mut">When on, visitors see a maintenance notice instead of the website.</p><div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Switch checked={state.settings.maint} label="Toggle maintenance mode" onChange={toggle} /><b>{state.settings.maint ? 'Maintenance ON' : 'Website is live'}</b></div></div>
    <div className="card"><h3 style={{ marginTop: 0 }}>Live preview</h3><p className="mut">See exactly what visitors would see. Drafts never appear here.</p><button className="b" onClick={preview.open}>Open public site preview</button></div>
    {preview.isOpen && <Modal title="Public website preview" onClose={preview.close} wide><p className="mut sm">Shows published content only.</p><PublicPreview /><div className="r"><button className="b2" onClick={preview.close}>Close</button></div></Modal>}
  </div>;
}
