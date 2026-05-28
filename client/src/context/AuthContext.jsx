import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('neptune_admin_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then(r => setAdmin(r.data))
      .catch(() => localStorage.removeItem('neptune_admin_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('neptune_admin_token', data.token);
    setAdmin({ email: data.email });
  };

  const logout = () => {
    localStorage.removeItem('neptune_admin_token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
