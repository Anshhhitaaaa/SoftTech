import React, { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { loginAdmin } from '../../services/adminApiService';

export default function AdminLoginModal({ isOpen, onLoginSuccess }) {
  const [username, setUsername] = useState('admin@softtech.com');
  const [password, setPassword] = useState('AdminPass123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginAdmin(username, password);
      const user = data.admin_user || {
        username,
        role: 'admin',
        title: 'System Administrator'
      };
      localStorage.setItem('adminToken', data.access_token);
      localStorage.setItem('adminUser', JSON.stringify(user));
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Access Denied: Only authorized Admin credentials are permitted to log in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Glowing Gradient Accent */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-4 text-indigo-400 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Admin Portal Access</h2>
            <p className="text-sm text-slate-400 mt-1">
              Restricted portal for system administrators and executive analytics.
            </p>
          </div>

          {/* Quick Notice */}
          <div className="mb-6 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              <strong>Admin Only:</strong> Normal user functionality is disabled in this application scope.
            </span>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                Admin Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@softtech.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authenticate Admin Session</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Default Demo Credentials: <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">admin@softtech.com</code> / <code className="text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">AdminPass123!</code>
          </div>
        </div>
      </div>
    </div>
  );
}
