import { NavLink } from 'react-router-dom';
import { MENU } from '../../data/config';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useUI } from '../../context/UIContext';
import { can } from '../../lib/permissions';

export default function Sidebar() {
  const { user } = useAuth();
  const { state } = useStore();
  const { collapsed, mobileOpen, setMobileOpen } = useUI();
  const newCount = state.enquiries.filter((item) => item.status === 'New').length;
  return <aside className={`sb ${collapsed ? 'c' : ''} ${mobileOpen ? 'o' : ''}`} id="sb">
    <div className="logo"><i /><b>UPRISING INFRA</b></div>
    {MENU.filter(([id]) => can(user?.role, id)).map(([id, label, icon]) => (
      <NavLink key={id} to={id === 'dashboard' ? '/' : `/${id}`} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nv ${isActive ? 'on' : ''}`} title={label}>
        <span className="e">{icon}</span><span className="l">{label}</span>
        {id === 'enquiries' && newCount > 0 && <span className="n l">{newCount}</span>}
      </NavLink>
    ))}
  </aside>;
}
