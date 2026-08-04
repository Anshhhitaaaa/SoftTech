import React, { useState } from 'react';
import {
  X,
  FileText,
  UserCheck,
  Award,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Download,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import { generateAndDownloadDocx } from '../services/DocxGenerator';

export default function WorkflowReviewModal({ doc, isOpen, onClose, currentPersona, onUpdateStatus }) {
  const [reviewerNotes, setReviewerNotes] = useState(doc?.reviewer_notes || "");
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !doc) return null;

  const isPendingReview = doc.status === 'Pending Review';
  const isPendingApproval = doc.status === 'Pending Approval';
  const isApproved = doc.status === 'Approved';

  const isReviewerRole = currentPersona?.role === 'Reviewer';
  const isApproverRole = currentPersona?.role === 'Approver';

  const handleForwardToApprover = () => {
    onUpdateStatus(doc.id, 'Pending Approval', currentPersona.id, reviewerNotes);
    onClose();
  };

  const handleFinalizeAndPublish = () => {
    onUpdateStatus(doc.id, 'Approved', currentPersona.id, reviewerNotes);
    onClose();
  };

  const handleRejectToDraft = () => {
    onUpdateStatus(doc.id, 'Draft', currentPersona.id, reviewerNotes);
    onClose();
  };

  const handleDownloadDocx = async () => {
    setIsDownloading(true);
    try {
      await generateAndDownloadDocx({
        title: doc.title,
        category: doc.category,
        authorName: doc.created_by_user_name || "Rahul Sharma",
        reviewerName: doc.reviewed_by_user_name || "Priya Patel",
        approverName: doc.approved_by_user_name || "Kavita Singh",
        status: doc.status,
        contentHtml: doc.content_html
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-backdrop">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] animate-modal border border-slate-200/90">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-indigo-900/40">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              {isPendingReview ? <UserCheck className="w-5 h-5" /> : <Award className="w-5 h-5 text-amber-400" />}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-0.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                  {isPendingReview ? 'Stage 2: Reviewer Inspection' : (isPendingApproval ? 'Stage 3: Approver Finalization' : 'Finalized Document')}
                </span>
                <span className="text-[10px] text-slate-400">• Doc ID: #{doc.id}</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">{doc.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Metadata Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200/90 rounded-xl p-3.5">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Category</span>
              <span className="font-bold text-slate-800 text-xs">{doc.category}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Author</span>
              <span className="font-bold text-slate-800 text-xs">{doc.created_by_user_name}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Current Status</span>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                doc.status === 'Approved'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {doc.status}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Submitted Date</span>
              <span className="font-semibold text-slate-700 text-xs">
                {doc.created_at ? new Date(doc.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Jul 31, 2026'}
              </span>
            </div>
          </div>

          {/* Document HTML Preview */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3 font-['Plus_Jakarta_Sans',sans-serif]">
            <h4 className="font-bold text-slate-900 text-xs flex items-center justify-between border-b border-slate-100 pb-2">
              <span>Submitted Report Content</span>
              <button
                type="button"
                onClick={handleDownloadDocx}
                disabled={isDownloading}
                className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloading ? "Downloading..." : "Export .docx"}</span>
              </button>
            </h4>
            <div
              className="prose prose-xs max-w-none text-slate-700 leading-normal"
              dangerouslySetInnerHTML={{ __html: doc.content_html }}
            />
          </div>

          {/* Reviewer Notes Field */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Reviewer Feedback & Endorsement Notes</span>
            </label>
            <textarea
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
              placeholder="Enter reviewer feedback, compliance check remarks, or approval endorsement notes..."
              rows={3}
              disabled={isApproved || (!isReviewerRole && !isApproverRole)}
              className="w-full p-3 bg-slate-50/80 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-2xs font-medium"
            />
          </div>

          {/* Role Alignment Hint Alert */}
          {isPendingReview && !isReviewerRole && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Role Note:</strong> Switch your persona in the top navigation header to <strong>Reviewer (Priya Patel)</strong> to approve & forward this document.
              </span>
            </div>
          )}

          {isPendingApproval && !isApproverRole && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Role Note:</strong> Switch your persona in the top navigation header to <strong>Approver (Kavita Singh)</strong> to perform final approval and publish to Documents menu.
              </span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center space-x-3">
            {/* Reviewer Action Buttons */}
            {isPendingReview && isReviewerRole && (
              <>
                <button
                  type="button"
                  onClick={handleRejectToDraft}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Request Revision</span>
                </button>
                <button
                  type="button"
                  onClick={handleForwardToApprover}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Approve & Forward to Approver</span>
                </button>
              </>
            )}

            {/* Approver Action Buttons */}
            {isPendingApproval && isApproverRole && (
              <button
                type="button"
                onClick={handleFinalizeAndPublish}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Finalize & Publish to Documents Menu</span>
              </button>
            )}

            {isApproved && (
              <span className="text-emerald-700 font-bold text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Published in Documents Repository
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
