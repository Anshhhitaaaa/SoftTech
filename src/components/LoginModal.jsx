import React, { useState, useEffect } from 'react';
import { Shield, User, LogIn, CheckCircle2, ChevronRight, Users, Sparkles, X, UserCheck, Award, UserPlus, Building, Briefcase, HelpCircle } from 'lucide-react';
import { users as mockUsersList, getDepartmentName, getDesignationName, departments, designations } from '../data/mockData';

export default function LoginModal({
  isOpen,
  onClose,
  allUsers = [],
  currentUser,
  onLoginSuccess,
  onSignUpUser,
  userGroups = [],
  individualAccesses = []
}) {
  const [activeMode, setActiveMode] = useState('login'); // 'login' | 'signup'

  // Fallback user list
  const defaultFallbackUsers = mockUsersList.map(u => ({
    id: u.id,
    fullName: u.full_name,
    departmentName: getDepartmentName(u.department_id),
    designationName: getDesignationName(u.designation_id)
  }));

  const userListToDisplay = (allUsers && allUsers.length > 0) ? allUsers : defaultFallbackUsers;

  const [selectedUserId, setSelectedUserId] = useState(currentUser?.id || null);
  const [selectedRole, setSelectedRole] = useState(currentUser?.role || "Normal User");
  const [searchTerm, setSearchTerm] = useState("");

  // Signup form state
  const [signUpName, setSignUpName] = useState("");
  const [signUpDept, setSignUpDept] = useState("Information Technology");
  const [signUpDesig, setSignUpDesig] = useState("Senior Specialist");
  const [signUpRole, setSignUpRole] = useState("Normal User");

  useEffect(() => {
    if (currentUser?.id) {
      setSelectedUserId(currentUser.id);
      if (currentUser.role) setSelectedRole(currentUser.role);
    } else {
      setSelectedUserId(null);
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const activeDbUser = selectedUserId ? userListToDisplay.find(u => u.id === Number(selectedUserId)) : null;

  // Helper to check DB assigned roles
  const getAssignedRolesForUser = (userId) => {
    if (!userId) return ["Normal User"];
    const roles = new Set(["Normal User"]);

    userGroups.forEach(g => {
      const isMember = (g.members || g.users_list || []).some(m => (m.userId || m.id) === userId);
      if (isMember) {
        if (g.workflow_role === 'reviewer' || g.workflowRole === 'reviewer') roles.add("Reviewer");
        if (g.workflow_role === 'approver' || g.workflowRole === 'approver') roles.add("Approver");
      }
    });

    individualAccesses.forEach(i => {
      const targetId = i.target_user_id || i.targetUserId || (i.user && i.user.id);
      if (targetId === userId) {
        if (i.workflow_role === 'reviewer' || i.workflowRole === 'reviewer') roles.add("Reviewer");
        if (i.workflow_role === 'approver' || i.workflowRole === 'approver') roles.add("Approver");
      }
    });

    return Array.from(roles);
  };

  const detectedRoles = activeDbUser ? getAssignedRolesForUser(activeDbUser.id) : [];

  const filteredUsers = userListToDisplay.filter(u => {
    if (!searchTerm.trim()) return true;
    const name = u.fullName || u.full_name || '';
    const dept = u.departmentName || u.department_name || '';
    const desig = u.designationName || u.designation_name || '';
    const term = searchTerm.toLowerCase();
    return name.toLowerCase().includes(term) || dept.toLowerCase().includes(term) || desig.toLowerCase().includes(term) || String(u.id).includes(term);
  });

  const handleLogin = (e) => {
    e?.preventDefault();
    if (!activeDbUser) return;

    onLoginSuccess({
      id: activeDbUser.id,
      name: activeDbUser.fullName || activeDbUser.full_name || `User #${activeDbUser.id}`,
      role: selectedRole,
      department: activeDbUser.departmentName || activeDbUser.department_name || "Department",
      designation: activeDbUser.designationName || activeDbUser.designation_name || "Employee"
    });
    if (onClose) onClose();
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (!signUpName.trim()) return;

    const maxExistingId = Math.max(0, ...userListToDisplay.map(u => Number(u.id) || 0));
    const nextId = (maxExistingId > 0 && maxExistingId < 1000000) ? maxExistingId + 1 : (userListToDisplay.length + 1);

    const newUserObj = {
      id: nextId,
      fullName: signUpName.trim(),
      full_name: signUpName.trim(),
      departmentName: signUpDept,
      department_name: signUpDept,
      designationName: signUpDesig,
      designation_name: signUpDesig,
      role: signUpRole
    };

    if (onSignUpUser) {
      onSignUpUser(newUserObj);
    }

    onLoginSuccess({
      id: newUserObj.id,
      name: newUserObj.fullName,
      role: signUpRole,
      department: signUpDept,
      designation: signUpDesig
    });

    alert(`Account created successfully for ${newUserObj.fullName}! Logged in as ${signUpRole}.`);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] animate-scaleUp">
        
        {/* Top Header with Tab Switcher */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  System Authentication
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  {activeMode === 'login' ? 'Role-Based User Login' : 'Create New Account'}
                </h2>
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Mode Switcher Tabs (Login vs Sign Up) */}
          <div className="mt-5 bg-white/10 p-1 rounded-xl flex items-center border border-white/10">
            <button
              type="button"
              onClick={() => setActiveMode('login')}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'login'
                  ? 'bg-white text-slate-900 shadow-md scale-[1.01]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Login Existing User</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('signup')}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'signup'
                  ? 'bg-indigo-600 text-white shadow-md scale-[1.01]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up New User</span>
            </button>
          </div>
        </div>

        {/* LOGIN MODE */}
        {activeMode === 'login' && (
          <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 flex-1">
            
            {/* Step 1: Select User */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>1. Select User from List ({userListToDisplay.length} Total)</span>
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search user..."
                  className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 w-40"
                />
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-1 bg-slate-50 border border-slate-200 rounded-2xl">
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs">No users found</div>
                ) : (
                  filteredUsers.map(user => {
                    const isSelected = selectedUserId === user.id;
                    const userName = user.fullName || user.full_name || `User #${user.id}`;
                    const roles = getAssignedRolesForUser(user.id);

                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setSelectedUserId(user.id);
                          const userRoles = getAssignedRolesForUser(user.id);
                          if (!userRoles.includes(selectedRole) && selectedRole !== "Normal User") {
                            setSelectedRole(userRoles.includes("Approver") ? "Approver" : userRoles.includes("Reviewer") ? "Reviewer" : "Normal User");
                          }
                        }}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-[1.01]'
                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100/70 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          }`}>
                            {userName[0] || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-xs tracking-tight flex items-center gap-1.5">
                              <span>{userName}</span>
                              <span className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>(#{user.id})</span>
                            </div>
                            <div className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                              {user.departmentName || user.department_name || 'General Dept'} • {user.designationName || user.designation_name || 'Staff'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          {roles.map(r => (
                            <span
                              key={r}
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                isSelected
                                  ? 'bg-white/20 text-white border border-white/30'
                                  : r === 'Approver'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : r === 'Reviewer'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Step 2: Choose Active Role for Session */}
            <div>
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>2. Choose Active Role for Session</span>
              </label>

              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    role: "Normal User",
                    title: "Normal User",
                    desc: "Create & submit files for review",
                    icon: User
                  },
                  {
                    role: "Reviewer",
                    title: "Reviewer",
                    desc: "Review & approve or return to author",
                    icon: UserCheck
                  },
                  {
                    role: "Approver",
                    title: "Approver",
                    desc: "Finalize & publish or return file",
                    icon: Award
                  }
                ].map(r => {
                  const isAssignedInDb = (r.role === "Normal User") || detectedRoles.includes(r.role);
                  const isSelectedRole = selectedRole === r.role;
                  const IconComponent = r.icon;

                  return (
                    <button
                      key={r.role}
                      type="button"
                      disabled={!isAssignedInDb}
                      onClick={() => {
                        if (isAssignedInDb) setSelectedRole(r.role);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        !isAssignedInDb
                          ? 'bg-slate-100/70 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                          : isSelectedRole
                          ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 scale-[1.02] cursor-pointer'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300 cursor-pointer'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-1.5 rounded-lg ${
                            !isAssignedInDb
                              ? 'bg-slate-200 text-slate-400'
                              : isSelectedRole
                              ? 'bg-indigo-500 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          {isSelectedRole && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {!isAssignedInDb && <Shield className="w-3.5 h-3.5 text-slate-400" />}
                        </div>
                        <div className="font-bold text-xs tracking-tight">{r.title}</div>
                        <p className={`text-[10px] leading-tight mt-1 ${
                          !isAssignedInDb
                            ? 'text-slate-400'
                            : isSelectedRole
                            ? 'text-slate-300'
                            : 'text-slate-400'
                        }`}>
                          {isAssignedInDb ? r.desc : "Requires DB Access Assignment"}
                        </p>
                      </div>

                      {isAssignedInDb ? (
                        <span className={`inline-block text-[9px] font-extrabold uppercase mt-3 px-1.5 py-0.5 rounded-md ${
                          isSelectedRole ? 'bg-indigo-600/40 text-indigo-200' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          ✓ Authorized
                        </span>
                      ) : (
                        <span className="inline-block text-[9px] font-bold uppercase mt-3 px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-500">
                          🔒 No DB Access
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active User Summary */}
            <div className={`border rounded-2xl p-4 flex items-center justify-between transition-all ${
              activeDbUser ? 'bg-indigo-50/80 border-indigo-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl font-extrabold flex items-center justify-center text-sm shadow-md ${
                  activeDbUser ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-600'
                }`}>
                  {activeDbUser ? (activeDbUser.fullName || activeDbUser.full_name || "U")[0] : "?"}
                </div>
                <div>
                  {activeDbUser ? (
                    <>
                      <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Logging in as:</div>
                      <div className="font-extrabold text-slate-900 text-sm">{activeDbUser.fullName || activeDbUser.full_name || `User #${activeDbUser.id}`}</div>
                      <div className="text-xs text-indigo-700 font-semibold">Active Role: <span className="underline">{selectedRole}</span></div>
                    </>
                  ) : (
                    <>
                      <div className="text-xs font-bold text-slate-700">No User Selected</div>
                      <div className="text-[11px] text-slate-400">Click a user from the list above or switch to Sign Up</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveMode('signup')}
                className="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>New user? Register account</span>
              </button>

              <button
                type="button"
                onClick={handleLogin}
                disabled={!activeDbUser}
                className={`px-7 py-3 text-white text-xs font-extrabold rounded-2xl transition-all flex items-center gap-2 ${
                  activeDbUser
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200 cursor-pointer scale-[1.02]'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Confirm & Authenticate</span>
                <ChevronRight className="w-4 h-4 opacity-80" />
              </button>
            </div>

          </div>
        )}

        {/* SIGN UP MODE */}
        {activeMode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 flex-1">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                <span>Full Name <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="text"
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                placeholder="Enter full name (e.g., Alex Johnson)..."
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-indigo-600" />
                  <span>Department</span>
                </label>
                <select
                  value={signUpDept}
                  onChange={(e) => setSignUpDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>Designation</span>
                </label>
                <select
                  value={signUpDesig}
                  onChange={(e) => setSignUpDesig(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white"
                >
                  {designations.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Primary Assigned Workflow Role</span>
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { role: "Normal User", label: "Normal User", desc: "Creator" },
                  { role: "Reviewer", label: "Reviewer", desc: "Review Stage" },
                  { role: "Approver", label: "Approver", desc: "Approval Stage" }
                ].map(r => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setSignUpRole(r.role)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      signUpRole === r.role
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs">{r.label}</div>
                    <div className={`text-[10px] ${signUpRole === r.role ? 'text-indigo-100' : 'text-slate-400'}`}>{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveMode('login')}
                className="text-slate-600 hover:text-slate-900 font-bold text-xs cursor-pointer"
              >
                Back to Login
              </button>

              <button
                type="submit"
                className="px-7 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register & Authenticate Account</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
