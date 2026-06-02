import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import Layout from './components/Layout';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ApplyPage from './pages/ApplyPage';

import ServiceDetailPage from './pages/ServiceDetailPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminContent from './pages/admin/AdminContent';
import AdminApplications from './pages/admin/AdminApplications';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  if (!admin) return <Navigate to="/admin" replace />;
  return children;
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ContentProvider>
            <Routes>
              {/* Public site */}
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/about" element={<Layout><AboutPage /></Layout>} />
              <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
              <Route path="/apply" element={<Layout><ApplyPage /></Layout>} />
              <Route path="/services/:slug" element={<Layout><ServiceDetailPage /></Layout>} />

              {/* Admin — noindex */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/content" element={<ProtectedRoute><AdminContent /></ProtectedRoute>} />
              <Route path="/admin/applications" element={<ProtectedRoute><AdminApplications /></ProtectedRoute>} />
              <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ContentProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
