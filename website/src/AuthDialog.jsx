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
    if (busy) return;
    setError('');

    if (!api.configured) {
      setError('Account services are not configured yet. The DevSprint API URL must be set by the site administrator.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const passwordBytes = new TextEncoder().encode(password).length;

    if (mode === 'register' && (cleanName.length < 2 || cleanName.length > 80)) {
      setError('Name must be between 2 and 80 characters.');
      return;
    }
    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail) || cleanEmail.length > 255) {
      setError('Enter a valid email address.');
      return;
    }
    if (passwordBytes < 8 || passwordBytes > 72) {
      setError('Password must be between 8 and 72 UTF-8 bytes.');
      return;
    }

    setBusy(true);
    try {
      const result = mode === 'register'
        ? await api.register({ name: cleanName, email: cleanEmail, password })
        : await api.login({ email: cleanEmail, password });
      if (!result?.token || !result?.user?.id || !result?.user?.email) {
        throw new Error('The API returned an incomplete account response. Please try again.');
      }
      onAuthenticated(result);
    } catch (requestError) {
      setError(requestError instanceof TypeError
        ? 'Could not reach DevSprint API. Check your connection or try again later.'
        : (requestError?.message || 'Account request failed. Please try again.'));
    } finally {
      setBusy(false);
    }
  }

  function switchMode() {
    if (busy) return;
    setMode(current => current === 'register' ? 'login' : 'register');
    setPassword('');
    setError('');
  }

  return <div className="dialog-backdrop" role="presentation" onMouseDown={event => {
    if (event.target === event.currentTarget && !busy) onClose();
  }}>
    <section className="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-title" aria-busy={busy}>
      <button className="dialog-close" type="button" onClick={onClose} disabled={busy} aria-label="Close account dialog">×</button>
      {user ? <>
        <span className="eyebrow">DEVSPRINT ACCOUNT</span>
        <h2 id="account-title">Welcome, {user.name}</h2>
        <p className="account-email">{user.email}</p>
        <p>Your challenge progress is synced with your DevSprint account when you are signed in.</p>
        <button className="button secondary" type="button" onClick={onLogout}>Sign out</button>
      </> : <>
        <span className="eyebrow">DEVSPRINT ACCOUNT</span>
        <h2 id="account-title">{mode === 'register' ? 'Create your account' : 'Sign in'}</h2>
        {!api.configured && <p className="account-notice" role="status">
          Account services are unavailable because VITE_API_URL is not configured. Guest progress remains available in this browser.
        </p>}
        <form className="account-form" onSubmit={submit}>
          {mode === 'register' && <label>
            Name
            <input
              autoComplete="name"
              maxLength={80}
              minLength={2}
              disabled={busy}
              required
              value={name}
              onChange={event => setName(event.target.value)}
            />
          </label>}
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={255}
              disabled={busy}
              required
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              minLength={8}
              disabled={busy}
              required
              value={password}
              onChange={event => setPassword(event.target.value)}
              aria-describedby="password-help"
            />
            <small id="password-help">Use at least 8 UTF-8 bytes. Passwords are verified by the DevSprint API.</small>
          </label>
          {error && <p className="account-error" role="alert">{error}</p>}
          <button className="button primary" type="submit" disabled={!api.configured || busy}>
            {busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}
          </button>
        </form>
        <p className="account-switch">
          {mode === 'register' ? 'Already registered?' : 'New to DevSprint?'}{' '}
          <button type="button" disabled={busy} onClick={switchMode}>
            {mode === 'register' ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </>}
    </section>
  </div>;
}
