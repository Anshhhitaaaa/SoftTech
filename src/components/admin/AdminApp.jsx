import React, { useState, useEffect } from 'react';
import { ShieldCheck, LayoutDashboard, Sparkles, Lock, LogOut, Database, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import AdminLoginModal from './AdminLoginModal';
import AdminFilterBar from './AdminFilterBar';
import AdminDashboard from './AdminDashboard';
import NLQueryWorkspace from './NLQueryWorkspace';
import {
  fetchFilterOptions,
  fetchKPIs,
  fetchTrends,
  fetchByType,
  fetchByUser
} from '../../services/adminApiService';

export default function AdminApp({ onExitAdminMode }) {
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | nl-query | allowlist
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Dynamic Dashboard States
  const [filters, setFilters] = useState({
    user_id: '',
    category: '',
    department_name: '',
    status: '',
    date_preset: ''
  });
  const [granularity, setGranularity] = useState('monthly');

  // Filter options state
  const [filterOptions, setFilterOptions] = useState({
    users: [
      { id: 1, name: 'Rahul Sharma' },
      { id: 2, name: 'Priya Patel' },
      { id: 3, name: 'Amit Verma' },
      { id: 4, name: 'Sneha Reddy' },
      { id: 5, name: 'Vikram Malhotra' }
    ],
    departments: [
      'Information Technology', 'Human Resources', 'Finance & Accounts',
      'Legal & Compliance', 'Operations & Supply Chain', 'Quality Assurance'
    ],
    categories: [
      'Audit & Compliance Report', 'Financial Statement', 'Technical Architecture',
      'HR Policy Document', 'Legal Contract', 'Standard Operating Procedure'
    ],
    statuses: ['Draft', 'Pending Review', 'Pending Approval', 'Approved', 'Returned to Author']
  });

  // Analytical Datasets matching current filters
  const [kpis, setKpis] = useState({
    total_documents: 148,
    approved_count: 89,
    pending_count: 36,
    draft_count: 23,
    approval_rate: 60.1,
    active_authors: 12,
    active_departments: 6
  });

  const [trends, setTrends] = useState([
    { period_label: '2025-09', document_count: 12 },
    { period_label: '2025-10', document_count: 18 },
    { period_label: '2025-11', document_count: 15 },
    { period_label: '2025-12', document_count: 22 },
    { period_label: '2026-01', document_count: 26 },
    { period_label: '2026-02', document_count: 31 },
    { period_label: '2026-03', document_count: 24 }
  ]);

  const [byType, setByType] = useState([
    { category: 'Audit & Compliance Report', count: 42 },
    { category: 'Standard Operating Procedure', count: 31 },
    { category: 'Financial Statement', count: 27 },
    { category: 'HR Policy Document', count: 24 },
    { category: 'Technical Architecture', count: 24 }
  ]);

  const [byUser, setByUser] = useState([
    { name: 'Rahul Sharma', department: 'Information Technology', count: 28 },
    { name: 'Priya Patel', department: 'Human Resources', count: 22 },
    { name: 'Amit Verma', department: 'Finance & Accounts', count: 19 },
    { name: 'Sneha Reddy', department: 'Operations & Supply Chain', count: 17 },
    { name: 'Vikram Malhotra', department: 'Information Technology', count: 14 }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      try {
        setAdminUser(JSON.parse(savedUser));
      } catch (e) {
        setShowLoginModal(true);
      }
    } else {
      setShowLoginModal(true);
    }
  }, []);

  // Fetch filter options from database on login
  useEffect(() => {
    if (adminUser) {
      fetchFilterOptions().then((opts) => {
        if (opts) setFilterOptions(opts);
      });
    }
  }, [adminUser]);

  // Fetch live analytics data from FastAPI database view whenever filters or granularity changes
  useEffect(() => {
    if (adminUser) {
      fetchKPIs(filters).then((res) => res && setKpis(res));
      fetchTrends(granularity, filters).then((res) => res && setTrends(res));
      fetchByType(filters).then((res) => res && setByType(res));
      fetchByUser(filters).then((res) => res && setByUser(res));
    }
  }, [adminUser, filters, granularity]);

  const handleLoginSuccess = (user) => {
    setAdminUser(user);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminUser(null);
    setShowLoginModal(true);
  };

  const handleResetFilters = () => {
    setFilters({
      user_id: '',
      category: '',
      department_name: '',
      status: '',
      date_preset: ''
    });
  };

  return (
    <div className="h-screen overflow-y-auto bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Admin Login Modal Guard */}
      <AdminLoginModal
        isOpen={showLoginModal || !adminUser}
        onLoginSuccess={handleLoginSuccess}
      />

      {adminUser && (
        <div className="min-h-screen flex flex-col">
          {/* Top Admin Navigation Bar */}
          <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              {/* Brand & Badge */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-base font-bold text-slate-100 tracking-tight">
                      Admin Analytics Portal
                    </h1>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                      Admin Scope Only
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    FastAPI Analytics Engine & Controlled Natural Language Workspace
                  </p>
                </div>
              </div>

              {/* Center Navigation Tabs */}
              <nav className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'dashboard'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Executive Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('nl-query')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'nl-query'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Natural-Language Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('allowlist')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'allowlist'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <span>Security & Allowlist</span>
                </button>
              </nav>

              {/* Right Profile & Action Controls */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end text-xs">
                  <span className="font-semibold text-slate-200">{adminUser.username}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Role: {adminUser.role}</span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout Admin Session"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                {onExitAdminMode && (
                  <button
                    onClick={onExitAdminMode}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 transition"
                  >
                    Exit Admin
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <AdminFilterBar
                  filters={filters}
                  setFilters={setFilters}
                  filterOptions={filterOptions}
                  onReset={handleResetFilters}
                />
                <AdminDashboard
                  kpis={kpis}
                  trends={trends}
                  byType={byType}
                  byUser={byUser}
                  granularity={granularity}
                  setGranularity={setGranularity}
                />
              </div>
            )}

            {activeTab === 'nl-query' && <NLQueryWorkspace />}

            {activeTab === 'allowlist' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-100">
                      Analytics Layer Allowlist & Security Policy
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Strict security schema blocking direct production table access and restricting SQL generation to approved read-only analytics views.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Database className="w-4 h-4 text-indigo-400" />
                      Approved Analytics Views
                    </h3>
                    <ul className="text-xs text-slate-300 space-y-2 font-mono">
                      <li className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                        <span>vw_admin_analytics_documents</span>
                        <span className="text-emerald-400 text-[10px]">READ_ONLY</span>
                      </li>
                      <li className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                        <span>vw_admin_analytics_user_activities</span>
                        <span className="text-emerald-400 text-[10px]">READ_ONLY</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      Security Enforcement Protocol
                    </h3>
                    <ul className="text-xs text-slate-300 space-y-2">
                      <li className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        Strict AST / Token validation before query execution
                      </li>
                      <li className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        Forbidden: DROP, DELETE, UPDATE, INSERT, ALTER, TRUNCATE
                      </li>
                      <li className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        Chained statements (;) and system catalogs blocked
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
