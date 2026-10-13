import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, getToken, setToken } from '@/lib/api';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const out = () => setUser(null);
    window.addEventListener('admin:unauthorized', out);
    if (!getToken()) { setReady(true); return () => window.removeEventListener('admin:unauthorized', out); }
    api('/me').then(setUser).catch(() => setToken(null)).finally(() => setReady(true));
    return () => window.removeEventListener('admin:unauthorized', out);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api('/login', { method: 'POST', body: { email, password } });
    setToken(res.token);
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    try { await api('/logout', { method: 'POST' }); } catch { /* ignore */ }
    setToken(null);
    setUser(null);
  }, []);

  return <AuthCtx.Provider value={{ user, ready, login, logout }}>{children}</AuthCtx.Provider>;
}
