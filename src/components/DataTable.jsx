import React from 'react';
import { Eye, Trash2, Users, User, ShieldCheck, FileText, CheckSquare, Award } from 'lucide-react';
import { getOfficeCategoryName, getOfficeName, getDepartmentName, getDesignationName } from '../data/mockData';

export default function DataTable({ items, type, onViewDetail, onDeleteItem }) {
  const isGroup = type === 'user-groups';

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4">{isGroup ? 'Group Name' : 'User Name'}</th>
              <th className="py-3.5 px-4">{isGroup ? 'Office Category' : 'Department & Role'}</th>
              <th className="py-3.5 px-4">DMS Access</th>
              <th className="py-3.5 px-4">Template Workflow Access</th>
              <th className="py-3.5 px-4">{isGroup ? 'Members' : 'Office Location'}</th>
              <th className="py-3.5 px-4">Created Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {items.map((item) => {
              const isFullControl = item.dms_access_level === 'full_control';
              const isApprover = item.workflow_role === 'approver';

              return (
                <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                  
                  {/* Name Column */}
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs group-hover:scale-105 transition-transform">
                        {isGroup ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <div>
                        <span
                          onClick={() => onViewDetail(item)}
                          className="block hover:text-indigo-600 transition-colors cursor-pointer text-xs font-bold"
                        >
                          {isGroup ? item.group_name : item.user?.full_name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Office / Dept Column */}
                  <td className="py-3.5 px-4 text-slate-600">
                    {isGroup ? (
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                        {getOfficeCategoryName(item.office_category_id)}
                      </span>
                    ) : (
                      <div>
                        <div className="font-bold text-slate-800">{getDepartmentName(item.department_id || item.user?.department_id)}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{getDesignationName(item.designation_id || item.user?.designation_id)}</div>
                      </div>
                    )}
                  </td>

                  {/* DMS Access Tag */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                      isFullControl
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-sky-50 text-sky-700 border-sky-200'
                    }`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {isFullControl ? 'Add/edit/delete Document' : 'View only Document'}
                    </span>
                  </td>

                  {/* Template Workflow Access Tag */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                      isApprover
                        ? 'bg-violet-50 text-violet-700 border-violet-200'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {isApprover ? <Award className="w-3.5 h-3.5" /> : <CheckSquare className="w-3.5 h-3.5" />}
                      {isApprover ? 'Approver' : 'Reviewer'}
                    </span>
                  </td>

                  {/* Members / Office Column */}
                  <td className="py-3.5 px-4 text-slate-600">
                    {isGroup ? (
                      <div className="flex items-center -space-x-1.5 overflow-hidden">
                        {item.users_list && item.users_list.slice(0, 3).map((u, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-white"
                            title={u.full_name}
                          >
                            {u.full_name.charAt(0)}
                          </div>
                        ))}
                        {item.users_list && item.users_list.length > 3 && (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 rounded-full px-1.5 py-0.5 ml-1">
                            +{item.users_list.length - 3}
                          </span>
                        )}
                        {(!item.users_list || item.users_list.length === 0) && (
                          <span className="text-slate-400 text-xs">0 Members</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-700 font-semibold">{getOfficeName(item.office_id)}</span>
                    )}
                  </td>

                  {/* Created Date */}
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Jul 29, 2026'}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewDetail(item)}
                        className="px-3 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                        title="View Master Detail"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Master Detail</span>
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
