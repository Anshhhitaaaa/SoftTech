import React, { useState } from 'react';
import { X, ChevronDown, UserPlus, User } from 'lucide-react';
import { users, getDepartmentName, getDesignationName } from '../data/mockData';
import OrgHierarchySelectors from './common/OrgHierarchySelectors';
import DmsRoleSelector from './common/DmsRoleSelector';

export default function AddIndividualAccessModal({ isOpen, onClose, onSubmit, allUsers = [] }) {
  const [officeCategoryId, setOfficeCategoryId] = useState('');
  const [officeId, setOfficeId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [designationId, setDesignationId] = useState('');
  const [targetUserId, setTargetUserId] = useState('');

  const [dmsAccessLevel, setDmsAccessLevel] = useState('full_control');
  const [workflowRole, setWorkflowRole] = useState('reviewer');

  if (!isOpen) return null;

  const usersToDisplay = (allUsers && allUsers.length > 0) ? allUsers : users;

  const strictUsers = usersToDisplay.filter(u => {
    if (departmentId && u.department_id && u.department_id !== Number(departmentId)) return false;
    if (designationId && u.designation_id && u.designation_id !== Number(designationId)) return false;
    return true;
  });

  const filteredUsers = strictUsers.length > 0 ? strictUsers : usersToDisplay;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!targetUserId) return;

    const userObj = usersToDisplay.find(u => u.id === Number(targetUserId)) || usersToDisplay[0];

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

            {/* Org Hierarchy Selectors */}
            <OrgHierarchySelectors
              officeCategoryId={officeCategoryId}
              setOfficeCategoryId={setOfficeCategoryId}
              officeId={officeId}
              setOfficeId={setOfficeId}
              departmentId={departmentId}
              setDepartmentId={setDepartmentId}
              designationId={designationId}
              setDesignationId={setDesignationId}
            />

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

          {/* DMS Access & Role Card Selection */}
          <DmsRoleSelector
            dmsAccessLevel={dmsAccessLevel}
            setDmsAccessLevel={setDmsAccessLevel}
            workflowRole={workflowRole}
            setWorkflowRole={setWorkflowRole}
          />

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

