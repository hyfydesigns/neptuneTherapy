import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/content').then(r => {
      const flat = {};
      for (const [key, val] of Object.entries(r.data)) flat[key] = val.data;
      setContent(flat);
    }).finally(() => setLoading(false));
  }, []);

  const updateSection = (section, data) => {
    setContent(prev => ({ ...prev, [section]: data }));
  };

  return (
    <ContentContext.Provider value={{ content, loading, updateSection }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => useContext(ContentContext);
