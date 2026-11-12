import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useUI } from '../../context/UIContext';
import Modal from '../ui/Modal';
import PublicPreview from '../public/PublicPreview';

export default function Topbar({ title }) {
  const { user, logout, changePassword } = useAuth();
  const { state } = useStore();
  const { toggleSidebar } = useUI();
  const [profile, setProfile] = useState(false);
  const [preview, setPreview] = useState(false);
  const [password, setPassword] = useState('');
  const count = state.enquiries.filter((item) => item.status === 'New').length;
  return <>
    <header className="top">
      <button className="b2" aria-label="Toggle sidebar" onClick={toggleSidebar}>☰</button>
      <h1>{title}</h1>
      <button className="b2" onClick={() => setPreview(true)}>Public site preview</button>
      <Link className="bg" to="/enquiries" title="New enquiries" aria-label={`New enquiries: ${count}`}>🔔 {count}</Link>
      <button className="b2" onClick={() => setProfile(true)}>{user?.name} · {user?.role}</button>
    </header>
    {profile && <Modal title={user?.name || ''} onClose={() => setProfile(false)}>
      <p className="mut">{user?.role}</p>
      <div className="fld"><label htmlFor="new-password">New password</label><input id="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
      <div className="r"><button className="b2" onClick={logout}>Log out</button><button className="b" onClick={() => { if (changePassword(password)) setProfile(false); }}>Change password</button></div>
    </Modal>}
    {preview && <Modal title="Public website preview" onClose={() => setPreview(false)} wide><p className="mut sm">Shows published content only.</p><PublicPreview /><div className="r"><button className="b2" onClick={() => setPreview(false)}>Close</button></div></Modal>}
  </>;
}
