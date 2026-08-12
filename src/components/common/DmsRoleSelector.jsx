import React from 'react';
import { FileEdit, Eye, CheckSquare, Award } from 'lucide-react';

/**
 * Reusable Card Selectors for DMS Access & Workflow Roles
 */
export default function DmsRoleSelector({
  dmsAccessLevel,
  setDmsAccessLevel,
  workflowRole,
  setWorkflowRole
}) {
  return (
    <div className="space-y-4">
      {/* DMS Access Level Cards */}
      <div>
        <label className="block font-bold text-slate-800 mb-2 text-xs">
          DMS Access <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => setDmsAccessLevel('full_control')}
            className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
              dmsAccessLevel === 'full_control'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <FileEdit className={`w-4 h-4 ${dmsAccessLevel === 'full_control' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="font-bold text-slate-800 text-xs">Add/edit/delete Document</span>
              </div>
              <input
                type="radio"
                name="dms_access_level"
                checked={dmsAccessLevel === 'full_control'}
                onChange={() => setDmsAccessLevel('full_control')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium">full_control</span>
          </div>

          <div
            onClick={() => setDmsAccessLevel('read_only')}
            className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
              dmsAccessLevel === 'read_only'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <Eye className={`w-4 h-4 ${dmsAccessLevel === 'read_only' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="font-bold text-slate-800 text-xs">Read document</span>
              </div>
              <input
                type="radio"
                name="dms_access_level"
                checked={dmsAccessLevel === 'read_only'}
                onChange={() => setDmsAccessLevel('read_only')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium">read_only</span>
          </div>
        </div>
      </div>

      {/* Workflow Role Cards */}
      <div>
        <label className="block font-bold text-slate-800 mb-2 text-xs">
          Workflow Role <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => setWorkflowRole('reviewer')}
            className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
              workflowRole === 'reviewer'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <CheckSquare className={`w-4 h-4 ${workflowRole === 'reviewer' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="font-bold text-slate-800 text-xs">Reviewer</span>
              </div>
              <input
                type="radio"
                name="workflow_role"
                checked={workflowRole === 'reviewer'}
                onChange={() => setWorkflowRole('reviewer')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Review & send to approver</span>
          </div>

          <div
            onClick={() => setWorkflowRole('approver')}
            className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
              workflowRole === 'approver'
                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <Award className={`w-4 h-4 ${workflowRole === 'approver' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="font-bold text-slate-800 text-xs">Approver</span>
              </div>
              <input
                type="radio"
                name="workflow_role"
                checked={workflowRole === 'approver'}
                onChange={() => setWorkflowRole('approver')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Final approval & publish</span>
          </div>
        </div>
      </div>
    </div>
  );
}
