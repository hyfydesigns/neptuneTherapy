import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, MessageSquare, LogOut, Eye, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/content', icon: FileText, label: 'Site Content' },
  { to: '/admin/applications', icon: Users, label: 'Applications' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin'); };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-none">Neptune</p>
              <p className="text-slate-400 text-xs">Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Eye size={17} />
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-900/40 hover:text-red-400 transition-colors"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>

        <div className="px-4 pb-4">
          <p className="text-xs text-slate-600 truncate">{admin?.email}</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
