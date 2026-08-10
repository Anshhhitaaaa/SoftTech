import React, { useState } from 'react';
import { X, ChevronDown, UserPlus, FileEdit, Eye, CheckSquare, Award, Building, User } from 'lucide-react';
import { officeCategories, offices, departments, designations, users, getDepartmentName, getDesignationName } from '../data/mockData';

export default function AddIndividualAccessModal({ isOpen, onClose, onSubmit, allUsers = [] }) {
  const [officeCategoryId, setOfficeCategoryId] = useState('');
  const [officeId, setOfficeId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [designationId, setDesignationId] = useState('');
  const [targetUserId, setTargetUserId] = useState('');

  const [dmsAccessLevel, setDmsAccessLevel] = useState('full_control'); // PostgreSQL enum ('full_control' | 'read_only')
  const [workflowRole, setWorkflowRole] = useState('reviewer');         // PostgreSQL enum ('reviewer' | 'approver')

  if (!isOpen) return null;

  const usersToDisplay = (allUsers && allUsers.length > 0) ? allUsers : users;

  // Filter offices by selected office category
  const filteredOffices = officeCategoryId
    ? offices.filter(o => o.office_category_id === Number(officeCategoryId))
    : offices;

  // Filter users by selected department/designation
  const strictUsers = usersToDisplay.filter(u => {
    if (departmentId && u.department_id && u.department_id !== Number(departmentId)) return false;
    if (designationId && u.designation_id && u.designation_id !== Number(designationId)) return false;
    return true;
  });

  const filteredUsers = strictUsers.length > 0
    ? strictUsers
    : usersToDisplay;


  const handleAdd = (e) => {
    e.preventDefault();
    if (!targetUserId) return;

    const userObj = usersToDisplay.find(u => u.id === Number(targetUserId)) || usersToDisplay[0];

    // PostgreSQL Record Payload for individual_access
    const individualRecord = {
      id: Date.now(),
      office_category_id: Number(officeCategoryId) || 1,
      office_id: Number(officeId) || 1,
      department_id: Number(departmentId) || 1,
      designation_id: Number(designationId) || 1,
      target_user_id: Number(targetUserId),
      user: userObj,
      dms_access_level: dmsAccessLevel,
      workflow_role: workflowRole,
      created_at: new Date().toISOString()
    };

    onSubmit(individualRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-backdrop">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh] animate-modal border border-slate-200/90">
        
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-indigo-900/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white">Add Individual Access</h2>
              <p className="text-[11px] text-slate-300">Insert into individual_access table</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleAdd} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Container Card for Select User */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-4 space-y-4 shadow-inner">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                Select User
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Office Category */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Office Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={officeCategoryId}
                    onChange={(e) => setOfficeCategoryId(e.target.value)}
                    className="w-full appearance-none bg-white px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-slate-700 pr-8 shadow-2xs font-medium"
                  >
                    <option value="">Select</option>
                    {officeCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Office */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Office <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={officeId}
                    onChange={(e) => setOfficeId(e.target.value)}
                    className="w-full appearance-none bg-white px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-slate-700 pr-8 shadow-2xs font-medium"
                  >
                    <option value="">Select</option>
                    {filteredOffices.map((off) => (
                      <option key={off.id} value={off.id}>{off.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full appearance-none bg-white px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-slate-700 pr-8 shadow-2xs font-medium"
                  >
                    <option value="">Select</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Designation */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Designation <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={designationId}
                    onChange={(e) => setDesignationId(e.target.value)}
                    className="w-full appearance-none bg-white px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-slate-700 pr-8 shadow-2xs font-medium"
                  >
                    <option value="">Select</option>
                    {designations.map((desig) => (
                      <option key={desig.id} value={desig.id}>{desig.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Target User */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                User <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full appearance-none bg-white px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-slate-700 pr-8 shadow-2xs font-bold"
                >
                  <option value="">Enter</option>
                  {filteredUsers.map((usr) => (
                    <option key={usr.id} value={usr.id}>
                      {usr.full_name} — ({getDepartmentName(usr.department_id)}, {getDesignationName(usr.designation_id)})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* DMS Access Cards Selection */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">
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
                    name="dmsAccessInd"
                    checked={dmsAccessLevel === 'full_control'}
                    onChange={() => {}}
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
                    <span className="font-bold text-slate-800 text-xs">View only Document</span>
                  </div>
                  <input
                    type="radio"
                    name="dmsAccessInd"
                    checked={dmsAccessLevel === 'read_only'}
                    onChange={() => {}}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-medium">read_only</span>
              </div>

            </div>
          </div>

          {/* Template Workflow Access Cards Selection */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">
              Template Workflow Access
            </label>
            <div className="grid grid-cols-2 gap-3">
              
              <div
                onClick={() => setWorkflowRole('reviewer')}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  workflowRole === 'reviewer'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <CheckSquare className={`w-4 h-4 ${workflowRole === 'reviewer' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="font-bold text-slate-800 text-xs">Reviewer</span>
                </div>
                <input
                  type="radio"
                  name="workflowRoleInd"
                  checked={workflowRole === 'reviewer'}
                  onChange={() => {}}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              <div
                onClick={() => setWorkflowRole('approver')}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  workflowRole === 'approver'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Award className={`w-4 h-4 ${workflowRole === 'approver' ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="font-bold text-slate-800 text-xs">Approver</span>
                </div>
                <input
                  type="radio"
                  name="workflowRoleInd"
                  checked={workflowRole === 'approver'}
                  onChange={() => {}}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
              </div>

            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200/80">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!targetUserId}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                targetUserId
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-indigo-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              Add
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
