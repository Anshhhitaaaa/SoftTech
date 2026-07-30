import React, { useState } from 'react';
import { X, Users, User, ShieldCheck, FileText, CheckCircle2, Building, Sliders } from 'lucide-react';
import { getOfficeCategoryName, getOfficeName, getDepartmentName, getDesignationName } from '../data/mockData';

export default function MasterDetailModal({ item, type, isOpen, onClose }) {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'permissions' | 'members'

  if (!isOpen || !item) return null;

  const isGroup = type === 'user-groups';
  const isFullControl = item.dms_access_level === 'full_control';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-backdrop">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-modal border border-slate-200/90">
        
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-indigo-900/40">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              {isGroup ? <Users className="w-5 h-5 text-indigo-300" /> : <User className="w-5 h-5 text-indigo-300" />}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-0.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                  {isGroup ? 'user_groups DB Record' : 'individual_access DB Record'}
                </span>
                <span className="text-[10px] text-slate-400">• Record ID: #{item.id}</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {isGroup ? item.group_name : item.user?.full_name}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 pt-3 flex space-x-6 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`pb-2.5 transition-all relative ${
              activeSubTab === 'overview' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Foreign Keys
            {activeSubTab === 'overview' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></span>}
          </button>

          <button
            onClick={() => setActiveSubTab('permissions')}
            className={`pb-2.5 transition-all relative ${
              activeSubTab === 'permissions' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Granted Permissions Matrix
            {activeSubTab === 'permissions' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></span>}
          </button>

          {isGroup && (
            <button
              onClick={() => setActiveSubTab('members')}
              className={`pb-2.5 transition-all relative ${
                activeSubTab === 'members' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              group_members ({item.users_list?.length || 0})
              {activeSubTab === 'members' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"></span>}
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {activeSubTab === 'overview' && (
            <div className="space-y-5">
              {/* Quick Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl flex flex-col justify-between">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">dms_access_level</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{isFullControl ? 'Add/edit/delete Document' : 'View only Document'}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl flex flex-col justify-between">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">workflow_role</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="capitalize">{item.workflow_role}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl flex flex-col justify-between col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">created_at</span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                    <span>{item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Jul 29, 2026'}</span>
                  </div>
                </div>
              </div>

              {/* PostgreSQL Foreign Keys Card */}
              <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-indigo-950 text-xs flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-600" />
                  PostgreSQL Foreign Key Relationships
                </h4>
                <div className="grid grid-cols-2 gap-y-2.5 text-xs pt-1 border-t border-indigo-100/60">
                  <div>
                    <span className="text-slate-500 font-medium block text-[11px]">office_category_id (#{item.office_category_id})</span>
                    <span className="font-bold text-slate-800">{getOfficeCategoryName(item.office_category_id)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block text-[11px]">office_id (#{item.office_id})</span>
                    <span className="font-bold text-slate-800">{getOfficeName(item.office_id)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block text-[11px]">department_id (#{item.department_id})</span>
                    <span className="font-bold text-slate-800">{getDepartmentName(item.department_id)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block text-[11px]">designation_id (#{item.designation_id})</span>
                    <span className="font-bold text-slate-800">{getDesignationName(item.designation_id)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'permissions' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-600" />
                DMS & Workflow CHECK Constraints
              </h4>

              <div className="space-y-2">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800">Document Browsing & Search</div>
                      <div className="text-[11px] text-slate-400">Allows viewing documents</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200">Granted</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className={`w-4 h-4 ${isFullControl ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <div>
                      <div className="font-bold text-slate-800">dms_access_level = 'full_control'</div>
                      <div className="text-[11px] text-slate-400">Allows adding, editing, and deleting documents</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                    isFullControl
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    {isFullControl ? 'Granted' : 'Denied'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className={`w-4 h-4 ${item.workflow_role === 'reviewer' ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <div>
                      <div className="font-bold text-slate-800">workflow_role = 'reviewer'</div>
                      <div className="text-[11px] text-slate-400">Can review templates and leave feedback</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                    item.workflow_role === 'reviewer'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    {item.workflow_role === 'reviewer' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className={`w-4 h-4 ${item.workflow_role === 'approver' ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <div>
                      <div className="font-bold text-slate-800">workflow_role = 'approver'</div>
                      <div className="text-[11px] text-slate-400">Final approval authority for templates</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                    item.workflow_role === 'approver'
                      ? 'bg-violet-50 text-violet-700 border-violet-200'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    {item.workflow_role === 'approver' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'members' && isGroup && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs">group_members table ({item.users_list?.length || 0})</h4>
                <span className="text-[11px] text-slate-400">Assigned Users FK</span>
              </div>

              <div className="border border-slate-200/80 rounded-xl divide-y divide-slate-100 max-h-56 overflow-y-auto">
                {item.users_list && item.users_list.map((usr) => (
                  <div key={usr.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                        {usr.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{usr.full_name}</div>
                        <div className="text-[11px] text-slate-400">User ID: #{usr.id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-700">{getDepartmentName(usr.department_id)}</div>
                      <div className="text-[10px] text-slate-400">{getDesignationName(usr.designation_id)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer"
          >
            Close Master Detail
          </button>
        </div>

      </div>
    </div>
  );
}
