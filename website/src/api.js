const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  if (!API_URL) throw new Error('DevSprint API is not configured');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}

export const api = {
  get configured() { return Boolean(API_URL); },
  register: (payload) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: (token) => request('/api/me', { headers: { Authorization: `Bearer ${token}` } }),
  progress: (token) => request('/api/progress', { headers: { Authorization: `Bearer ${token}` } }),
  saveProgress: (token, challengeId, status = 'completed') => request(`/api/progress/${challengeId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  }),
};
