import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useToast from '../hooks/useToast';
import Toasts from '../components/ui/Toasts';

export default function Login() {
  const { user, login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('admin@uprisinginfra.local');
  const [password, setPassword] = useState('Admin@123');
  if (user) return <Navigate to="/" replace />;
  return <div className="login"><div className="card"><h2 style={{ marginTop: 0 }}>Uprising Infra LLP<br /><span style={{ color: 'var(--r)' }}>Admin Panel</span></h2>
    <form onSubmit={(event) => { event.preventDefault(); login(email, password); }}>
      <div className="fld"><label htmlFor="email">Email</label><input id="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
      <div className="fld"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
      <button className="b" style={{ width: '100%' }} type="submit">Sign in</button>
    </form>
    <p className="sm mut"><button className="link-button" onClick={() => toast('In production a secure reset link is emailed to you.')}>Forgot password?</button></p>
    <p className="sm mut">Prototype accounts: admin@uprisinginfra.local / Admin@123, manager@uprisinginfra.local / Manager@123, editor@uprisinginfra.local / Editor@123.</p>
    <p className="sm mut">Passwords are stored in plain text ONLY in this prototype.</p>
    <Toasts />
  </div></div>;
}
