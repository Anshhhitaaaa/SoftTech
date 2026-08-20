import React, { useState } from 'react';
import { FileText, CheckCircle2, Clock, Users, Building, TrendingUp, BarChart3, PieChart } from 'lucide-react';

export default function AdminDashboard({ kpis, trends, byType, byUser, granularity, setGranularity }) {
  const [hoveredTrend, setHoveredTrend] = useState(null);

  const maxTrend = Math.max(...(trends?.map((t) => t.document_count) || [1]), 1);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Documents */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Documents</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-100 tracking-tight">
            {kpis?.total_documents ?? 0}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Across all departments</span>
          </div>
        </div>

        {/* Approval Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Approval Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-100 tracking-tight">
            {kpis?.approval_rate ?? 0}%
          </div>
          <div className="mt-1 text-[11px] text-emerald-400">
            {kpis?.approved_count ?? 0} Approved documents
          </div>
        </div>

        {/* Pending Action */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Review/Approval</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-100 tracking-tight">
            {kpis?.pending_count ?? 0}
          </div>
          <div className="mt-1 text-[11px] text-amber-400">
            Awaiting executive action
          </div>
        </div>

        {/* Active Contributing Authors */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Authors</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-100 tracking-tight">
            {kpis?.active_authors ?? 0}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Active content creators
          </div>
        </div>

        {/* Active Departments */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Departments</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-100 tracking-tight">
            {kpis?.active_departments ?? 0}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Organizational units
          </div>
        </div>
      </div>

      {/* Main Trends & Activity Visualizer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Document Activity Trends
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-period document volume progression filtered dynamically.
            </p>
          </div>

          {/* Granularity Tab Switcher */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            {['weekly', 'monthly', 'yearly'].map((g) => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                  granularity === g
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {g} Trends
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic SVG / CSS Bar Chart */}
        {trends && trends.length > 0 ? (
          <div className="pt-4">
            <div className="h-64 flex items-end gap-2 sm:gap-3 px-2 border-b border-slate-800">
              {trends.map((item, idx) => {
                const heightPct = Math.max((item.document_count / maxTrend) * 100, 6);
                const isHovered = hoveredTrend === idx;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredTrend(idx)}
                    onMouseLeave={() => setHoveredTrend(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-lg shadow-xl whitespace-nowrap animate-fadeIn">
                        <span className="font-semibold">{item.period_label}:</span> {item.document_count} docs
                      </div>
                    )}

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[40px] rounded-t-lg transition-all duration-300 ${
                        isHovered
                          ? 'bg-gradient-to-t from-indigo-500 to-purple-400 shadow-lg shadow-indigo-500/50'
                          : 'bg-gradient-to-t from-indigo-600/70 to-indigo-500/90 group-hover:from-indigo-500 group-hover:to-indigo-400'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between gap-1 mt-3 px-2 text-[10px] text-slate-400 font-mono overflow-x-auto">
              {trends.map((item, idx) => (
                <span key={idx} className="flex-1 text-center truncate">
                  {item.period_label}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-xs text-slate-500">
            No trend data available for current filter selection.
          </div>
        )}
      </div>

      {/* Categorical & User Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documents by Type */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-400" />
              Documents by Type / Category
            </h3>
            <span className="text-xs text-slate-400">{byType?.length || 0} Categories</span>
          </div>

          <div className="space-y-3">
            {byType?.slice(0, 6).map((cat, idx) => {
              const total = byType.reduce((acc, c) => acc + c.count, 0) || 1;
              const pct = Math.round((cat.count / total) * 100);

              const colors = [
                'bg-indigo-500', 'bg-purple-500', 'bg-blue-500',
                'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'
              ];
              const barColor = colors[idx % colors.length];

              return (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium truncate">{cat.category}</span>
                    <span className="text-slate-400 font-mono">
                      {cat.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Documents by User */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Documents by User Leaderboard
            </h3>
            <span className="text-xs text-slate-400">Top Authors</span>
          </div>

          <div className="space-y-3">
            {byUser?.slice(0, 5).map((user, idx) => {
              const maxUserCount = Math.max(...(byUser?.map((u) => u.count) || [1]), 1);
              const barWidthPct = Math.max((user.count / maxUserCount) * 100, 10);

              return (
                <div key={user.name} className="p-3 bg-slate-800/50 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="text-slate-100 font-medium">{user.name}</span>
                      <span className="text-[10px] text-slate-400">({user.department})</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {user.count} docs
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${barWidthPct}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
