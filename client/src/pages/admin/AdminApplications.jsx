import { useState, useEffect } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../lib/api';

const STATUS_OPTIONS = ['pending', 'reviewing', 'accepted', 'rejected'];

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewing: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

function ApplicationRow({ app, onStatusChange, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr className="border-b border-gray-50 hover:bg-gray-50/50">
        <td className="py-3 px-4 text-sm font-medium text-gray-900">{app.first_name} {app.last_name}</td>
        <td className="py-3 px-4 text-sm text-gray-600">{app.position}</td>
        <td className="py-3 px-4 text-sm text-gray-600">{app.email}</td>
        <td className="py-3 px-4 text-sm text-gray-600">{new Date(app.created_at).toLocaleDateString()}</td>
        <td className="py-3 px-4">
          <select
            value={app.status}
            onChange={e => onStatusChange(app.id, e.target.value)}
            className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${STATUS_COLORS[app.status]}`}
          >
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setExpanded(!expanded)} className="text-blue-600 text-xs hover:underline flex items-center gap-0.5">
              Details {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            <button onClick={() => onDelete(app.id)} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-blue-50/30">
          <td colSpan={6} className="px-4 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {[
                ['Phone', app.phone],
                ['Address', [app.address, app.city, app.state, app.zip].filter(Boolean).join(', ')],
                ['ID Type', app.id_type],
                ['Experience', app.years_experience],
                ['Qualification', app.qualification],
                ['Coverage Area', app.coverage_area],
                ['Reference 1', app.ref1_name ? `${app.ref1_name} — ${app.ref1_contact}` : '—'],
                ['Reference 2', app.ref2_name ? `${app.ref2_name} — ${app.ref2_contact}` : '—'],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                  <p className="text-gray-800 mt-0.5">{val || '—'}</p>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications')
      .then(r => setApplications(r.data))
      .catch(err => console.error('Failed to load applications', err))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, status) => {
    await api.patch(`/applications/${id}/status`, { status });
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    await api.delete(`/applications/${id}`);
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-500 text-sm mt-1">{applications.length} total submissions</p>
        </div>
        <div className="flex gap-2">
          {['all', ...STATUS_OPTIONS].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg capitalize transition-colors ${filter === s ? 'bg-blue-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400">No applications found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Name', 'Position', 'Email', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <ApplicationRow key={app.id} app={app} onStatusChange={handleStatusChange} onDelete={handleDelete} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
