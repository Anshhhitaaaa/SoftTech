import React from 'react';
import {
  FileText,
  Download,
  Eye,
  Trash2,
  ShieldCheck,
  Award,
  User,
  Clock,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { generateAndDownloadDocx } from '../services/DocxGenerator';

export default function DocumentsRepository({ documents, onInspectDocument, onDeleteDocument }) {
  const approvedDocs = (documents || []).filter(d => d.status === 'Approved');

  const handleDownload = async (doc) => {
    await generateAndDownloadDocx({
      title: doc.title,
      category: doc.category,
      authorName: doc.created_by_user_name || "Rahul Sharma",
      reviewerName: doc.reviewed_by_user_name || "Priya Patel",
      approverName: doc.approved_by_user_name || "Kavita Singh",
      status: doc.status,
      contentHtml: doc.content_html
    });
  };

  if (!approvedDocs || approvedDocs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-slate-200/90 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">No Finalized Documents Published Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mb-4">
          Once a Normal User creates a report, the Reviewer endorses it, and the Approver finalizes the changes, the document will appear here in the Published Documents Repository.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
      <div className="overflow-y-auto flex-1 min-h-0">
        <table className="w-full text-left text-xs text-slate-700 border-collapse relative">
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200/80 shadow-2xs">
            <tr className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4 bg-slate-50/95">Document Title & Category</th>
              <th className="py-3.5 px-4 bg-slate-50/95">Author (Normal User)</th>
              <th className="py-3.5 px-4 bg-slate-50/95">Reviewer & Approver</th>
              <th className="py-3.5 px-4 bg-slate-50/95">Approval Status</th>
              <th className="py-3.5 px-4 bg-slate-50/95">Finalized Timestamp</th>
              <th className="py-3.5 px-4 text-right bg-slate-50/95">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {approvedDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-indigo-50/30 transition-colors group">
                
                {/* Title & Category */}
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span
                        onClick={() => onInspectDocument(doc)}
                        className="block hover:text-indigo-600 transition-colors cursor-pointer text-xs font-bold text-slate-900"
                      >
                        {doc.title}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-semibold mt-0.5">
                        <Tag className="w-2.5 h-2.5" />
                        {doc.category}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Author */}
                <td className="py-3.5 px-4 text-slate-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                      {doc.created_by_user_name?.charAt(0) || 'U'}
                    </div>
                    <span className="font-bold text-xs">{doc.created_by_user_name}</span>
                  </div>
                </td>

                {/* Reviewer & Approver */}
                <td className="py-3.5 px-4 text-slate-600">
                  <div className="text-[11px] space-y-0.5">
                    <div className="flex items-center gap-1 font-semibold text-slate-800">
                      <CheckCircle2 className="w-3 h-3 text-indigo-600 shrink-0" />
                      <span>Reviewer: {doc.reviewed_by_user_name || 'Priya Patel'}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-slate-800">
                      <Award className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>Approver: {doc.approved_by_user_name || 'Kavita Singh'}</span>
                    </div>
                  </div>
                </td>

                {/* Status Pill */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Published & Visible
                  </span>
                </td>

                {/* Timestamp */}
                <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{doc.updated_at ? new Date(doc.updated_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Jul 31, 2026'}</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                      title="Download .docx File"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .docx</span>
                    </button>

                    <button
                      onClick={() => onInspectDocument(doc)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      title="Inspect Report Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
