import React, { useState } from 'react';
import { FileText, CheckCircle2, Clock, Users, Building, TrendingUp, BarChart3, PieChart, Eye } from 'lucide-react';
import DocumentDrillDownModal from './DocumentDrillDownModal';

export default function AdminDashboard({ kpis, trends, byType, byUser, granularity, setGranularity }) {
  const [hoveredTrend, setHoveredTrend] = useState(null);
  const [drillDownState, setDrillDownState] = useState({
    isOpen: false,
    dimensionType: '',
    dimensionValue: ''
  });

  const maxTrend = Math.max(...(trends?.map((t) => t.document_count) || [1]), 1);

  const handleOpenDrillDown = (type, val) => {
    setDrillDownState({
      isOpen: true,
      dimensionType: type,
      dimensionValue: val
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Documents */}
        <div
          onClick={() => handleOpenDrillDown('status', 'Approved')}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-indigo-500/40 transition cursor-pointer"
        >
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
            <span>Click to inspect files</span>
          </div>
        </div>

        {/* Approval Rate */}
        <div
          onClick={() => handleOpenDrillDown('status', 'Approved')}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition cursor-pointer"
        >
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
        <div
          onClick={() => handleOpenDrillDown('status', 'Pending Review')}
          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition cursor-pointer"
        >
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
            Click to inspect pending files
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
              Multi-period document volume progression filtered dynamically (Click any bar to inspect uploaded files).
            </p>
          </div>

          {/* Granularity Tab Switcher */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            {['weekly', 'monthly', 'yearly'].map((g) => (
              <button
                key={g}
                onClick={() => setGranularity(g)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-300 ${
                  granularity === g
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-105 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {g} Trends
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Animated Bar Chart with Staggered Cascading Wave Transition */}
        {trends && trends.length > 0 ? (
          <div key={`${granularity}-${trends.length}`} className="pt-6 animate-fadeIn">
            <div className="h-64 flex items-end gap-2 sm:gap-4 px-3 border-b border-slate-800/80 pb-2 relative">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-dashed border-slate-700 w-full" />
                <div className="border-b border-dashed border-slate-700 w-full" />
                <div className="border-b border-dashed border-slate-700 w-full" />
                <div className="border-b border-dashed border-slate-700 w-full" />
              </div>

              {trends.map((item, idx) => {
                const heightPct = Math.max((item.document_count / maxTrend) * 100, 8);
                const isHovered = hoveredTrend === idx;

                return (
                  <div
                    key={item.period_label || idx}
                    onClick={() => handleOpenDrillDown('created_month', item.period_label)}
                    onMouseEnter={() => setHoveredTrend(idx)}
                    onMouseLeave={() => setHoveredTrend(null)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative z-10"
                  >
                    {/* Top Value Pill */}
                    <div
                      style={{ transitionDelay: `${idx * 30}ms` }}
                      className={`mb-2 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition-all duration-500 transform ${
                        isHovered
                          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/50 scale-110 -translate-y-1'
                          : 'bg-slate-800/90 text-indigo-300 border border-slate-700/80 group-hover:bg-slate-700'
                      }`}
                    >
                      {item.document_count}
                    </div>

                    {/* Tooltip on Hover */}
                    {isHovered && (
                      <div className="absolute -top-10 z-30 px-3 py-1.5 bg-slate-900 border border-indigo-500/40 text-slate-100 text-xs rounded-xl shadow-2xl whitespace-nowrap animate-modal">
                        <span className="font-semibold text-indigo-400">{item.period_label}:</span> {item.document_count} files (Click to inspect)
                      </div>
                    )}

                    {/* Animated Bar Column with Staggered Cascade Delay */}
                    <div className="w-full max-w-[44px] h-full flex items-end relative">
                      <div
                        style={{
                          height: `${heightPct}%`,
                          transitionDelay: `${idx * 40}ms`
                        }}
                        className={`w-full rounded-t-xl transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) transform origin-bottom group-hover:scale-y-105 ${
                          isHovered
                            ? 'bg-gradient-to-t from-indigo-600 via-indigo-500 to-purple-400 shadow-xl shadow-indigo-500/40'
                            : 'bg-gradient-to-t from-indigo-700/80 via-indigo-600/90 to-purple-600/80 group-hover:from-indigo-600 group-hover:to-purple-500'
                        }`}
                      >
                        {/* Shimmer Light Reflection on Top of Bar */}
                        <div className="h-1.5 w-full bg-white/20 rounded-t-xl" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between gap-2 mt-4 px-3 text-[11px] text-slate-400 font-mono font-medium">
              {trends.map((item, idx) => (
                <span
                  key={idx}
                  onClick={() => handleOpenDrillDown('created_month', item.period_label)}
                  className={`flex-1 text-center truncate transition-colors duration-300 cursor-pointer hover:text-indigo-300 ${
                    hoveredTrend === idx ? 'text-indigo-300 font-bold' : ''
                  }`}
                >
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
                <div
                  key={cat.category}
                  onClick={() => handleOpenDrillDown('category', cat.category)}
                  className="space-y-1.5 group cursor-pointer p-2 rounded-xl hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium truncate group-hover:text-indigo-300 transition">
                      {cat.category}
                    </span>
                    <span className="text-slate-400 font-mono flex items-center gap-2">
                      {cat.count} ({pct}%)
                      <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-indigo-400 transition" />
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
                <div
                  key={user.name}
                  onClick={() => handleOpenDrillDown('author_name', user.name)}
                  className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-800/80 cursor-pointer group transition"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="text-slate-100 font-medium group-hover:text-indigo-300 transition">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-slate-400">({user.department})</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1">
                      {user.count} docs
                      <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-indigo-400 transition" />
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

      {/* Drill-Down Inspector Modal */}
      <DocumentDrillDownModal
        isOpen={drillDownState.isOpen}
        onClose={() => setDrillDownState({ isOpen: false, dimensionType: '', dimensionValue: '' })}
        dimensionType={drillDownState.dimensionType}
        dimensionValue={drillDownState.dimensionValue}
      />
    </div>
  );
}
