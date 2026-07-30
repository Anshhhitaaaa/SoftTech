import React, { useState } from 'react';
import { X, ChevronDown, Check, Users, FileEdit, Eye, CheckSquare, Award, Building } from 'lucide-react';
import { officeCategories, offices, departments, designations, users, getOfficeCategoryName, getOfficeName, getDepartmentName, getDesignationName } from '../data/mockData';

export default function CreateGroupModal({ isOpen, onClose, onSubmit }) {
  const [groupName, setGroupName] = useState('');
  const [dmsAccessLevel, setDmsAccessLevel] = useState('full_control'); // PostgreSQL enum ('full_control' | 'read_only')
  const [workflowRole, setWorkflowRole] = useState('reviewer');         // PostgreSQL enum ('reviewer' | 'approver')
  
  const [officeCategoryId, setOfficeCategoryId] = useState('');
  const [officeId, setOfficeId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [designationId, setDesignationId] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);

  if (!isOpen) return null;

  // Filter offices by category if selected
  const filteredOffices = officeCategoryId
    ? offices.filter(o => o.office_category_id === Number(officeCategoryId))
    : offices;

  // Filter users by department/designation if selected
  const strictUsers = users.filter(u => {
    if (departmentId && u.department_id !== Number(departmentId)) return false;
    if (designationId && u.designation_id !== Number(designationId)) return false;
    return true;
  });

  const filteredUsers = strictUsers.length > 0
    ? strictUsers
    : (departmentId || designationId
        ? users.filter(u => (departmentId && u.department_id === Number(departmentId)) || (designationId && u.designation_id === Number(designationId)))
        : users);


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

    // PostgreSQL Record Payload
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
        ? users.filter(u => selectedUserIds.includes(u.id))
        : [users[0], users[1]],
      created_at: new Date().toISOString()
    };

    onSubmit(groupRecord);
    onClose();
  };

  const selectedUsers = users.filter(u => selectedUserIds.includes(u.id));

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
                    name="dms_access_level"
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
                    name="dms_access_level"
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
                  name="workflow_role"
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
                  name="workflow_role"
                  checked={workflowRole === 'approver'}
                  onChange={() => {}}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
              </div>

            </div>
          </div>

          {/* Select Users Box Container */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-4 space-y-4 shadow-inner">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Building className="w-4 h-4 text-indigo-600" />
                Select users
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
                          {u.full_name}
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
                      return (
                        <div
                          key={user.id}
                          onClick={() => toggleUserSelection(user.id)}
                          className={`p-2.5 flex items-center justify-between cursor-pointer rounded-lg text-xs transition-colors ${
                            isSelected ? 'bg-indigo-50/70 font-semibold text-indigo-900' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="font-bold">{user.full_name}</div>
                            <div className="text-[11px] text-slate-400">
                              {getDepartmentName(user.department_id)} • {getDesignationName(user.designation_id)}
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
