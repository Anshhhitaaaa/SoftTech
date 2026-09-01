import React, { useState } from 'react';
import { X, ChevronDown, Check, Users, Building } from 'lucide-react';
import { users, getDepartmentName, getDesignationName } from '../data/mockData';
import OrgHierarchySelectors from './common/OrgHierarchySelectors';
import DmsRoleSelector from './common/DmsRoleSelector';

export default function CreateGroupModal({ isOpen, onClose, onSubmit, allUsers = [] }) {
  const [groupName, setGroupName] = useState('');
  const [dmsAccessLevel, setDmsAccessLevel] = useState('full_control');
  const [workflowRole, setWorkflowRole] = useState('reviewer');
  
  const [officeCategoryId, setOfficeCategoryId] = useState('');
  const [officeId, setOfficeId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [designationId, setDesignationId] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const usersToDisplay = (allUsers && allUsers.length > 0) ? allUsers : users;

  const strictUsers = usersToDisplay.filter(u => {
    if (departmentId && u.department_id && u.department_id !== Number(departmentId)) return false;
    if (designationId && u.designation_id && u.designation_id !== Number(designationId)) return false;
    return true;
  });

  const filteredUsers = strictUsers.length > 0 ? strictUsers : usersToDisplay;

  const toggleUserSelection = (userId) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const groupRecord = {
      id: Date.now(),
      group_name: groupName.trim(),
      dms_access_level: dmsAccessLevel,
      workflow_role: workflowRole,
      office_category_id: Number(officeCategoryId) || 1,
      office_id: Number(officeId) || 1,
      department_id: Number(departmentId) || 1,
      designation_id: Number(designationId) || 1,
      selected_user_ids: selectedUserIds.length > 0 ? selectedUserIds : [1, 2],
      users_list: selectedUserIds.length > 0
        ? usersToDisplay.filter(u => selectedUserIds.includes(u.id))
        : [usersToDisplay[0], usersToDisplay[1]],
      created_at: new Date().toISOString()
    };

    onSubmit(groupRecord);
    onClose();
  };

  const selectedUsers = usersToDisplay.filter(u => selectedUserIds.includes(u.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-backdrop">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh] animate-modal border border-slate-200/90">
        
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-indigo-900/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white">Create Group</h2>
              <p className="text-[11px] text-slate-300">Insert into user_groups & group_members tables</p>
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
        <form onSubmit={handleCreate} className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Group Name */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">
              Group name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 border border-slate-300/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs font-medium placeholder:text-slate-400 transition-all"
              />
              <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* DMS Access & Role Card Selection */}
          <DmsRoleSelector
            dmsAccessLevel={dmsAccessLevel}
            setDmsAccessLevel={setDmsAccessLevel}
            workflowRole={workflowRole}
            setWorkflowRole={setWorkflowRole}
          />

          {/* Select Users Box Container */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-4 space-y-4 shadow-inner">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Building className="w-4 h-4 text-indigo-600" />
                Select users
              </h3>
            </div>

            {/* Org Hierarchy Dropdowns */}
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

            {/* Multi-Select Users Dropdown */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Users <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div
                  onClick={() => setIsUsersDropdownOpen(!isUsersDropdownOpen)}
                  className="w-full bg-white px-3 py-2 border border-slate-300 rounded-lg cursor-pointer flex items-center justify-between min-h-[38px] shadow-2xs"
                >
                  <div className="flex flex-wrap gap-1">
                    {selectedUsers.length === 0 ? (
                      <span className="text-slate-400 font-normal">Enter or select users</span>
                    ) : (
                      selectedUsers.map(u => (
                        <span key={u.id} className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                          {u.full_name || u.fullName}
                        </span>
                      ))
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </div>

                {isUsersDropdownOpen && (
                  <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100 p-1">
                    {filteredUsers.map((user) => {
                      const isSelected = selectedUserIds.includes(user.id);
                      const userName = user.full_name || user.fullName || `User #${user.id}`;
                      const deptName = user.departmentName || getDepartmentName(user.department_id || user.departmentId);
                      const desigName = user.designationName || getDesignationName(user.designation_id || user.designationId);
                      return (
                        <div
                          key={user.id}
                          onClick={() => toggleUserSelection(user.id)}
                          className={`p-2.5 flex items-center justify-between cursor-pointer rounded-lg text-xs transition-colors ${
                            isSelected ? 'bg-indigo-50/70 font-semibold text-indigo-900' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="font-bold">{userName}</div>
                            <div className="text-[11px] text-slate-400">
                              {deptName} • {desigName}
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                      );
                    })}
                  </div>
                )}
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
              disabled={!groupName.trim()}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                groupName.trim()
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-indigo-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              Create
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

