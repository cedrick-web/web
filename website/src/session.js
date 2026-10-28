const TOKEN_KEY = 'devsprint.sessionToken';

export function readSessionToken() {
  try {
    return globalThis.sessionStorage?.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

export function saveSessionToken(token) {
  try {
    if (typeof token === 'string' && token.trim()) {
      globalThis.sessionStorage?.setItem(TOKEN_KEY, token);
    } else {
      globalThis.sessionStorage?.removeItem(TOKEN_KEY);
    }
  } catch {
    // Browser policy may block storage; in-memory authentication still works.
  }
}

export function clearSessionToken() {
  try {
    globalThis.sessionStorage?.removeItem(TOKEN_KEY);
  } catch {
    // Ignore blocked storage while clearing the in-memory session.
  }
}
