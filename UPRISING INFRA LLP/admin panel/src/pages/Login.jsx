import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useToast from '../hooks/useToast';
import Toasts from '../components/ui/Toasts';

export default function Login() {
  const { user, login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    await login(email, password);
    setBusy(false);
  };

  return <div className="login"><div className="card"><h2 style={{ marginTop: 0 }}>Uprising Infra LLP<br /><span style={{ color: 'var(--r)' }}>Admin Panel</span></h2>
    <form onSubmit={submit}>
      <div className="fld"><label htmlFor="email">Email</label><input id="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
      <div className="fld"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
      <button className="b" style={{ width: '100%' }} type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
    <p className="sm mut"><button className="link-button" onClick={() => toast('Ask a Super Admin to reset your password from the Users page.')}>Forgot password?</button></p>
    <Toasts />
  </div></div>;
}