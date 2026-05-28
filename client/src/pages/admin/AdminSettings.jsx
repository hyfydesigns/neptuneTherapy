import { useState } from 'react';
import { Lock } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export default function AdminSettings() {
  const { admin } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: 'error', msg: 'New passwords do not match' });
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setStatus({ type: 'success', msg: data.message });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.error || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your admin account</p>
      </div>

      <div className="max-w-lg space-y-5">
        {/* Account Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Admin Email</p>
            <p className="text-gray-900 font-medium">{admin?.email}</p>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Lock size={18} className="text-blue-600" />
            <h2 className="font-semibold text-gray-900">Change Password</h2>
          </div>

          {status && (
            <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              ['currentPassword', 'Current Password'],
              ['newPassword', 'New Password'],
              ['confirmPassword', 'Confirm New Password'],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input
                  type="password"
                  name={name}
                  value={form[name]}
                  onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
