import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCan } from './hooks/useCan';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WebsiteManagement from './pages/WebsiteManagement';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Clients from './pages/Clients';
import Leadership from './pages/Leadership';
import Faqs from './pages/Faqs';
import Enquiries from './pages/Enquiries';
import MediaLibrary from './pages/MediaLibrary';
import BackupRestore from './pages/BackupRestore';
import ActivityLogs from './pages/ActivityLogs';
import Settings from './pages/Settings';
import NavFooter from './pages/NavFooter';
import Seo from './pages/Seo';
import Users from './pages/Users';
import NotAllowed from './pages/NotAllowed';

function AuthenticationGuard({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PermissionRoute({ module, children }) {
  const allowed = useCan(module);
  return allowed ? children : <NotAllowed />;
}

export default function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<AuthenticationGuard><AdminLayout /></AuthenticationGuard>}>
      <Route index element={<PermissionRoute module="dashboard"><Dashboard /></PermissionRoute>} />
      <Route path="site" element={<PermissionRoute module="site"><WebsiteManagement /></PermissionRoute>} />
      <Route path="home" element={<PermissionRoute module="home"><HomePage /></PermissionRoute>} />
      <Route path="about" element={<PermissionRoute module="about"><AboutPage /></PermissionRoute>} />
      <Route path="services" element={<PermissionRoute module="services"><Services /></PermissionRoute>} />
      <Route path="projects" element={<PermissionRoute module="projects"><Projects /></PermissionRoute>} />
      <Route path="clients" element={<PermissionRoute module="clients"><Clients /></PermissionRoute>} />
      <Route path="leadership" element={<PermissionRoute module="leadership"><Leadership /></PermissionRoute>} />
      <Route path="faqs" element={<PermissionRoute module="faqs"><Faqs /></PermissionRoute>} />
      <Route path="enquiries" element={<PermissionRoute module="enquiries"><Enquiries /></PermissionRoute>} />
      <Route path="media" element={<PermissionRoute module="media"><MediaLibrary /></PermissionRoute>} />
      <Route path="navfooter" element={<PermissionRoute module="navfooter"><NavFooter /></PermissionRoute>} />
      <Route path="seo" element={<PermissionRoute module="seo"><Seo /></PermissionRoute>} />
      <Route path="users" element={<PermissionRoute module="users"><Users /></PermissionRoute>} />
      <Route path="logs" element={<PermissionRoute module="logs"><ActivityLogs /></PermissionRoute>} />
      <Route path="backup" element={<PermissionRoute module="backup"><BackupRestore /></PermissionRoute>} />
      <Route path="settings" element={<PermissionRoute module="settings"><Settings /></PermissionRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>;
}
