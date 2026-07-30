import React from 'react';
import { Users, UserCheck, Shield } from 'lucide-react';

export default function HeaderTabNav({ activeTab, setActiveTab, userGroupCount = 0, individualCount = 0 }) {
  return (
    <header className="w-full bg-white border-b border-slate-200/80 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        
        {/* Top Header Bar */}
        <div className="pb-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Configuration</h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Manage organizational permissions, group policies & user privileges</p>
            </div>
          </div>
        </div>

        {/* Modern Segmented Pill Tab Bar */}
        <div className="pt-4 flex items-center justify-between">
          <div className="bg-slate-100/80 p-1 rounded-xl border border-slate-200/70 inline-flex space-x-1 shadow-inner">
            
            {/* Tab 1: User Groups */}
            <button
              onClick={() => setActiveTab('user-groups')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all duration-200 ${
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all duration-200 ${
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

          </div>
        </div>

      </div>
    </header>
  );
}
