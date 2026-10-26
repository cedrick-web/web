import { useState } from 'react';
import { api } from './api';

export default function AuthDialog({ user, onClose, onAuthenticated, onLogout }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = mode === 'register'
        ? await api.register({ name, email, password })
        : await api.login({ email, password });
      onAuthenticated(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return <div className="dialog-backdrop" role="presentation" onMouseDown={event => {
    if (event.target === event.currentTarget) onClose();
  }}>
    <section className="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-title">
      <button className="dialog-close" type="button" onClick={onClose} aria-label="Close account dialog">×</button>
      {user ? <>
        <span className="eyebrow">DEVSPRINT ACCOUNT</span>
        <h2 id="account-title">Welcome, {user.name}</h2>
        <p className="account-email">{user.email}</p>
        <p>Your account progress is synced with the DevSprint API while you are signed in.</p>
        <button className="button secondary" type="button" onClick={onLogout}>Sign out</button>
      </> : <>
        <span className="eyebrow">DEVSPRINT ACCOUNT</span>
        <h2 id="account-title">{mode === 'register' ? 'Create your account' : 'Sign in'}</h2>
        {!api.configured && <p className="account-notice" role="status">
          Accounts are unavailable because VITE_API_URL is not configured. You can continue in local-only mode.
        </p>}
        <form className="account-form" onSubmit={submit}>
          {mode === 'register' && <label>
            Name
            <input autoComplete="name" maxLength={80} minLength={2} required value={name} onChange={event => setName(event.target.value)} />
          </label>}
          <label>
            Email
            <input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} />
          </label>
          <label>
            Password
            <input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={8} required value={password} onChange={event => setPassword(event.target.value)} />
          </label>
          {error && <p className="account-error" role="alert">{error}</p>}
          <button className="button primary" type="submit" disabled={!api.configured || busy}>
            {busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}
          </button>
        </form>
        <p className="account-switch">
          {mode === 'register' ? 'Already registered?' : 'New to DevSprint?'}{' '}
          <button type="button" onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); }}>
            {mode === 'register' ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </>}
    </section>
  </div>;
}
