import React from 'react';
import { Filter, RotateCcw, Calendar, User, FolderKanban, Building2, CheckCircle } from 'lucide-react';

export default function AdminFilterBar({ filters, setFilters, filterOptions, onReset }) {
  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const activeCount = Object.values(filters).filter((val) => val !== '' && val !== 'all').length;

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-slate-100 font-semibold text-sm">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Filter className="w-4 h-4" />
          </div>
          <span>Admin Executive Filters</span>
          {activeCount > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-indigo-500/20 text-indigo-300 font-medium">
              {activeCount} active
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition px-2.5 py-1 rounded-lg hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* User Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <User className="w-3 h-3 text-slate-500" />
            User / Author
          </label>
          <select
            value={filters.user_id || 'all'}
            onChange={(e) => handleChange('user_id', e.target.value === 'all' ? '' : e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          >
            <option value="all">All Users</option>
            {filterOptions?.users?.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Document Type / Category */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <FolderKanban className="w-3 h-3 text-slate-500" />
            Document Type
          </label>
          <select
            value={filters.category || 'all'}
            onChange={(e) => handleChange('category', e.target.value === 'all' ? '' : e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          >
            <option value="all">All Categories</option>
            {filterOptions?.categories?.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-slate-500" />
            Department
          </label>
          <select
            value={filters.department_name || 'all'}
            onChange={(e) => handleChange('department_name', e.target.value === 'all' ? '' : e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          >
            <option value="all">All Departments</option>
            {filterOptions?.departments?.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-slate-500" />
            Status
          </label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleChange('status', e.target.value === 'all' ? '' : e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          >
            <option value="all">All Statuses</option>
            {filterOptions?.statuses?.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Preset Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            Date Range Period
          </label>
          <select
            value={filters.date_preset || 'all'}
            onChange={(e) => handleChange('date_preset', e.target.value === 'all' ? '' : e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          >
            <option value="all">All Time</option>
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="this_month">This Month</option>
            <option value="this_year">This Year</option>
            <option value="last_year">Last Year</option>
          </select>
        </div>
      </div>
    </div>
  );
}
