import React from 'react';
import { Users, UserCheck, Shield, FileText, FolderCheck, User, UserPlus, Award } from 'lucide-react';

export default function HeaderTabNav({
  activeTab,
  setActiveTab,
  userGroupCount = 0,
  individualCount = 0,
  documentCount = 0,
  currentPersona,
  setCurrentPersona,
  personas = []
}) {
  return (
    <header className="w-full bg-white border-b border-slate-200/80 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        
        {/* Top Header Bar with Logo and Role Switcher */}
        <div className="pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Configuration & Document Automation</h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Manage permissions, word document automation (.docx) & 3-tier approval workflows</p>
            </div>
          </div>

          {/* Persona / User Category Switcher Bar */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-1.5 flex items-center space-x-2 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Active Persona:</span>
            </span>

            <div className="flex items-center space-x-1">
              {personas.map((p) => {
                const isActive = currentPersona.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setCurrentPersona(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-200/60 border border-slate-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                    <span>{p.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                      isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {p.role}
                    </span>
                  </button>
                );
              })}
            </div>
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
