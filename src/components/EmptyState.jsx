import React from 'react';
import { Plus, KeyRound, Lock, Sparkles } from 'lucide-react';

export default function EmptyState({ type, onCreateClick }) {
  const isGroup = type === 'user-groups';
  const title = isGroup ? "No User Groups Configured" : "No Individual Access Assigned";
  const description = isGroup
    ? 'Create structured permission groups to manage document workflows and department privileges at scale.'
    : 'Assign custom document and template workflow permissions directly to specific team members.';
  const buttonText = isGroup ? "Create User Group" : "Add Individual Access";

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center my-auto w-full">
      
      {/* Graphic Illustration */}
      <div className="relative w-56 h-44 mb-6 flex items-center justify-center">
        
        {/* Glow & Backdrop Ring */}
        <div className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-sky-500/10 blur-md" />
        <div className="absolute w-32 h-32 rounded-full border border-indigo-200/60 bg-white/40 shadow-inner flex items-center justify-center" />

        {/* Static Security Badge Card */}
        <div className="relative z-10 w-44 h-32 bg-white rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-200/60 p-4 flex flex-col justify-between">
          
          {/* Badge Top Header */}
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              {isGroup ? <Lock className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
            </div>
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          </div>

          {/* Placeholder Line Art */}
          <div className="space-y-1.5 text-left">
            <div className="w-24 h-2 bg-slate-200 rounded-full"></div>
            <div className="w-16 h-1.5 bg-slate-100 rounded-full"></div>
          </div>

          {/* Badge Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400 font-semibold">
            <span>{isGroup ? 'Group Policy' : 'User Access'}</span>
            <span className="text-indigo-600 font-bold">Unset</span>
          </div>

        </div>

        {/* Decorative Floating Sparkle Chip */}
        <div className="absolute -top-1 right-8 z-20 p-2 bg-white rounded-xl shadow-md border border-slate-100">
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>

      </div>

      {/* Main Text */}
      <h3 className="text-lg font-bold text-slate-900 mb-1.5 tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {/* Action Button */}
      <button
        onClick={onCreateClick}
        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>{buttonText}</span>
      </button>

    </div>
  );
}
