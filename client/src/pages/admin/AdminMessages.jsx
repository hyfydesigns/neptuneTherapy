import { useState, useEffect } from 'react';
import { Trash2, Mail } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../lib/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/contact')
      .then(r => setMessages(r.data))
      .catch(err => console.error('Failed to load messages', err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    await api.delete(`/contact/${id}`);
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-500 text-sm mt-1">{messages.length} contact form submissions</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center text-gray-400">Loading...</div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center text-gray-400">No messages yet</div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-5">
          {/* List */}
          <div className="lg:col-span-2 space-y-2">
            {messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => setSelected(msg)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${selected?.id === msg.id ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-900">{msg.name}</p>
                  <p className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString()}</p>
                </div>
                <p className="text-xs text-gray-500 truncate">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
                    <p className="text-sm text-gray-500">{new Date(selected.created_at).toLocaleString()}</p>
                  </div>
                  <button onClick={() => handleDelete(selected.id)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-5">
                  <Mail size={15} className="text-gray-400" />
                  <a href={`mailto:${selected.email}`} className="text-blue-600 text-sm hover:underline">{selected.email}</a>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
                <div className="mt-5">
                  <a
                    href={`mailto:${selected.email}?subject=Re: Your inquiry to Neptune Therapy`}
                    className="inline-block bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center text-gray-400">
                Select a message to read it
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
