import React, { useState, useEffect } from 'react';
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
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { generateAndDownloadDocx } from '../services/DocxGenerator';

export default function WorkflowReviewModal({ doc, isOpen, onClose, currentPersona, onUpdateStatus }) {
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (doc) {
      setReviewerNotes(doc.reviewer_notes || "");
      setErrorMessage("");
    }
  }, [doc]);

  if (!isOpen || !doc) return null;

  const isPendingReview = doc.status === 'Pending Review' || doc.status === 'Returned to Reviewer';
  const isPendingApproval = doc.status === 'Pending Approval';
  const isApproved = doc.status === 'Approved';
  const isReturnedToAuthor = doc.status === 'Returned to Author';

  const isReviewerRole = currentPersona?.role === 'Reviewer';
  const isApproverRole = currentPersona?.role === 'Approver';
  const isAuthorRole = currentPersona?.role === 'Normal User' || currentPersona?.id === doc.created_by_user_id;

  // Reviewer Handlers
  const handleForwardToApprover = () => {
    onUpdateStatus(doc.id, 'Pending Approval', currentPersona.id, reviewerNotes);
    onClose();
  };

  const handleSendBackToAuthorFromReviewer = () => {
    if (!reviewerNotes.trim()) {
      setErrorMessage("Please enter a comment explaining why you are sending the document back to the author.");
      return;
    }
    onUpdateStatus(doc.id, 'Returned to Author', currentPersona.id, reviewerNotes);
    onClose();
  };

  // Approver Handlers
  const handleFinalizeAndPublish = () => {
    onUpdateStatus(doc.id, 'Approved', currentPersona.id, reviewerNotes);
    onClose();
  };

  const handleSendBackToReviewer = () => {
    if (!reviewerNotes.trim()) {
      setErrorMessage("Please enter a comment explaining why you are sending the document back to the reviewer.");
      return;
    }
    onUpdateStatus(doc.id, 'Returned to Reviewer', currentPersona.id, reviewerNotes);
    onClose();
  };

  const handleSendBackToAuthorFromApprover = () => {
    if (!reviewerNotes.trim()) {
      setErrorMessage("Please enter a comment explaining why you are sending the document back to the author.");
      return;
    }
    onUpdateStatus(doc.id, 'Returned to Author', currentPersona.id, reviewerNotes);
    onClose();
  };

  const handleDownloadDocx = async () => {
    setIsDownloading(true);
    try {
      await generateAndDownloadDocx({
        title: doc.title,
        category: doc.category,
        authorName: doc.created_by_user_name || "Author",
        reviewerName: doc.reviewed_by_user_name || "Reviewer",
        approverName: doc.approved_by_user_name || "Approver",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200 animate-scaleUp">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-indigo-900/40 shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              {isApproved ? <Award className="w-5 h-5 text-amber-400" /> : <UserCheck className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-0.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isApproved
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : isPendingApproval
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                    : isReturnedToAuthor
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                }`}>
                  {doc.status}
                </span>
                <span className="text-[10px] text-slate-400">• Document ID: #{doc.id}</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">{doc.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 flex-1">
          
          {/* Status Alert Banner */}
          {isReturnedToAuthor && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-900">
              <RotateCcw className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-xs">Returned to Normal User / Author</h4>
                <p className="text-[11px] mt-0.5 text-rose-700">
                  This document was sent back with feedback notes. Review the reviewer/approver comments below, make necessary updates, and resubmit for review.
                </p>
              </div>
            </div>
          )}

          {/* Metadata Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Category</span>
              <span className="font-bold text-slate-800 text-xs">{doc.category}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Author / Creator</span>
              <span className="font-bold text-slate-800 text-xs">{doc.created_by_user_name}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Status</span>
              <span className="font-bold text-slate-800 text-xs">{doc.status}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Last Updated</span>
              <span className="font-semibold text-slate-700 text-xs">
                {doc.updated_at ? new Date(doc.updated_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'}
              </span>
            </div>
          </div>

          {/* Document Content HTML Preview */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3 font-['Plus_Jakarta_Sans',sans-serif]">
            <h4 className="font-bold text-slate-900 text-xs flex items-center justify-between border-b border-slate-100 pb-2">
              <span>Submitted Report Content</span>
              <button
                type="button"
                onClick={handleDownloadDocx}
                disabled={isDownloading}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloading ? "Generating..." : "Download .docx"}</span>
              </button>
            </h4>
            <div
              className="prose prose-xs max-w-none text-slate-700 leading-normal"
              dangerouslySetInnerHTML={{ __html: doc.content_html }}
            />
          </div>

          {/* Reviewer / Approver Notes Log */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Reviewer & Approver Notes / Reason Comment</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Mandatory when sending back document</span>
            </label>

            <textarea
              value={reviewerNotes}
              onChange={(e) => {
                setReviewerNotes(e.target.value);
                setErrorMessage("");
              }}
              placeholder="Enter feedback notes, endorsement details, or mandatory reason for sending back the document..."
              rows={3}
              disabled={isApproved}
              className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 shadow-2xs font-medium"
            />

            {errorMessage && (
              <p className="mt-1.5 text-xs text-rose-600 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}
          </div>

          {/* Role Alignment Guidance Banner */}
          {isPendingReview && !isReviewerRole && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Active Role Hint:</strong> Log in as a <strong>Reviewer</strong> to approve & forward or send back this document.
              </span>
            </div>
          )}

          {isPendingApproval && !isApproverRole && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Active Role Hint:</strong> Log in as an <strong>Approver</strong> to perform final approval or send back to reviewer/author.
              </span>
            </div>
          )}

        </div>

        {/* Footer Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Reviewer Action Buttons */}
            {isPendingReview && isReviewerRole && (
              <>
                <button
                  type="button"
                  onClick={handleSendBackToAuthorFromReviewer}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Send Back to Normal User (with Comment)</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleForwardToApprover}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Approve & Forward to Approver</span>
                </button>
              </>
            )}

            {/* Approver Action Buttons */}
            {isPendingApproval && isApproverRole && (
              <>
                <button
                  type="button"
                  onClick={handleSendBackToReviewer}
                  className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Send Back to Reviewer</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendBackToAuthorFromApprover}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Send Back to Author</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalizeAndPublish}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Approve & Publish to Documents Menu</span>
                </button>
              </>
            )}

            {isApproved && (
              <span className="text-emerald-700 font-bold text-xs flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
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
