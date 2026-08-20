import React from 'react';
import { Users, UserCheck, Shield, FileText, FolderCheck, User, LogIn, ChevronDown, Award, LogOut, UserPlus, ShieldCheck } from 'lucide-react';

export default function HeaderTabNav({
  activeTab,
  setActiveTab,
  userGroupCount = 0,
  individualCount = 0,
  documentCount = 0,
  currentUser,
  onOpenLoginModal,
  onOpenAdminPortal
}) {
  const isAuthenticated = Boolean(currentUser && currentUser.id);
  const userRole = currentUser?.role || "Normal User";
  const userName = currentUser?.name || "Unauthenticated User";

  return (
    <header className="w-full bg-white border-b border-slate-200/80 shrink-0 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        
        {/* Top Header Bar with Logo and Authenticated User Card */}
        <div className="pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100">
          
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Configuration & Workflow Portal</h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Role-based authentication & multi-tier document approval studio</p>
            </div>
          </div>

          {/* User Profile & Login / Signup Switcher */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAdminPortal}
              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-100 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border border-slate-700"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Admin Analytics Portal</span>
            </button>

            {isAuthenticated ? (
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-2.5 flex items-center space-x-3 shadow-2xs">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-indigo-200">
                  {userName[0]}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-xs text-slate-900">{userName}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">(#{currentUser.id})</span>
                  </div>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      userRole === 'Approver'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : userRole === 'Reviewer'
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                        : 'bg-slate-200 text-slate-800 border border-slate-300'
                    }`}>
                      {userRole === 'Approver' ? <Award className="w-3 h-3 text-amber-600" /> : <UserCheck className="w-3 h-3 text-indigo-600" />}
                      <span>{userRole}</span>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl px-3.5 py-2 text-xs font-bold flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-600" />
                <span>Not Logged In</span>
              </div>
            )}

            <button
              onClick={onOpenLoginModal}
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {isAuthenticated ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isAuthenticated ? "Switch Account / Role" : "Sign In / Sign Up"}</span>
            </button>
          </div>

        </div>

        {/* Modern Segmented Pill Tab Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="bg-slate-100/80 p-1 rounded-xl border border-slate-200/70 inline-flex flex-wrap gap-1 shadow-inner">
            
            {/* Tab 1: User Groups */}
            <button
              onClick={() => setActiveTab('user-groups')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
                activeTab === 'user-groups'
                  ? 'bg-white text-indigo-600 font-bold shadow-sm border border-slate-200/80 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-200/50'
              }`}
            >
              <Users className={`w-4 h-4 ${activeTab === 'user-groups' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>User Groups</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'user-groups'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-slate-200/80 text-slate-600'
              }`}>
                {userGroupCount}
              </span>
            </button>

            {/* Tab 2: Individual Access */}
            <button
              onClick={() => setActiveTab('individual-access')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
                activeTab === 'individual-access'
                  ? 'bg-white text-indigo-600 font-bold shadow-sm border border-slate-200/80 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-200/50'
              }`}
            >
              <UserCheck className={`w-4 h-4 ${activeTab === 'individual-access' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Individual Access</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'individual-access'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-slate-200/80 text-slate-600'
              }`}>
                {individualCount}
              </span>
            </button>

            {/* Tab 3: Document Automation (.docx Editor) */}
            <button
              onClick={() => setActiveTab('doc-editor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
                activeTab === 'doc-editor'
                  ? 'bg-white text-indigo-600 font-bold shadow-sm border border-slate-200/80 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-200/50'
              }`}
            >
              <FileText className={`w-4 h-4 ${activeTab === 'doc-editor' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Word Doc (.docx) Automation Editor</span>
            </button>

            {/* Tab 4: Published Documents Menu */}
            <button
              onClick={() => setActiveTab('documents-repo')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
                activeTab === 'documents-repo'
                  ? 'bg-white text-indigo-600 font-bold shadow-sm border border-slate-200/80 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 font-medium hover:bg-slate-200/50'
              }`}
            >
              <FolderCheck className={`w-4 h-4 ${activeTab === 'documents-repo' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Documents Menu (Published)</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'documents-repo'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-200/80 text-slate-600'
              }`}>
                {documentCount}
              </span>
            </button>

          </div>
        </div>

      </div>
    </header>
  );
}
