import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { MENU } from '../../data/config';
import Toasts from '../ui/Toasts';

export default function AdminLayout() {
  const { pathname } = useLocation();
  const route = pathname.split('/')[1] || 'dashboard';
  const title = MENU.find(([id]) => id === route)?.[1] || 'Dashboard';
  return <div className="app"><Sidebar /><div className="main"><Topbar title={title} /><main className="ct"><Outlet /></main></div><Toasts /></div>;
}
