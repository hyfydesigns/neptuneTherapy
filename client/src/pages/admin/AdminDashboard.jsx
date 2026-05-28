import { useState, useEffect } from 'react';
import { Users, MessageSquare, FileText, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ applications: 0, messages: 0, pending: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [recentMsgs, setRecentMsgs] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/applications'),
      api.get('/contact'),
    ]).then(([apps, msgs]) => {
      const a = apps.data;
      const m = msgs.data;
      setStats({
        applications: a.length,
        messages: m.length,
        pending: a.filter(x => x.status === 'pending').length,
      });
      setRecentApps(a.slice(0, 5));
      setRecentMsgs(m.slice(0, 5));
    });
  }, []);

  const statCards = [
    { label: 'Total Applications', value: stats.applications, icon: Users, color: 'blue' },
    { label: 'Pending Review', value: stats.pending, icon: TrendingUp, color: 'yellow' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'green' },
    { label: 'Content Sections', value: 6, icon: FileText, color: 'purple' },
  ];

  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back to the Neptune Therapy admin panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${colorMap[card.color]} flex items-center justify-center mb-3`}>
              <card.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">Recent Applications</h2>
            <Link to="/admin/applications" className="text-blue-600 text-sm hover:underline">View all</Link>
          </div>
          {recentApps.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No applications yet</p>
          ) : (
            <div className="space-y-3">
              {recentApps.map(app => (
                <div key={app.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{app.first_name} {app.last_name}</p>
                    <p className="text-xs text-gray-500">{app.position}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900">Recent Messages</h2>
            <Link to="/admin/messages" className="text-blue-600 text-sm hover:underline">View all</Link>
          </div>
          {recentMsgs.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {recentMsgs.map(msg => (
                <div key={msg.id} className="py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{msg.name}</p>
                    <p className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</p>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/content" className="bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            Edit Site Content
          </Link>
          <Link to="/admin/applications" className="bg-white text-blue-700 border border-blue-200 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Review Applications
          </Link>
          <Link to="/admin/messages" className="bg-white text-blue-700 border border-blue-200 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Read Messages
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-700',
    reviewing: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}
