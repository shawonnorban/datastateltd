const TOKEN_KEY = 'admin_token';

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (t) => {
  try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
};

export class ApiError extends Error {
  constructor(message, status, errors) { super(message); this.status = status; this.errors = errors || {}; }
}

export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = { Accept: 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) payload = form;
  else if (body !== undefined) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body); }

  const res = await fetch(`/api/admin${path}`, { method, headers, body: payload });
  if (res.status === 401) {
    setToken(null);
    window.dispatchEvent(new Event('admin:unauthorized'));
    throw new ApiError('Session expired. Please sign in again.', 401);
  }
  if (res.status === 204) return null;
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const first = json.errors ? Object.values(json.errors)[0]?.[0] : null;
    throw new ApiError(first || json.message || 'Request failed', res.status, json.errors);
  }
  return json;
}

export async function download(path, filename) {
  const res = await fetch(`/api/admin${path}`, { headers: { Authorization: `Bearer ${getToken()}` } });
  if (!res.ok) throw new Error('Download failed');
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement('a');
  a.href = url; a.download = filename || 'file'; a.click();
  URL.revokeObjectURL(url);
}
