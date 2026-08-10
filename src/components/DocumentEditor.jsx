import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Send,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  Table as TableIcon,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  AlertCircle,
  Eye,
  RotateCcw,
  MessageSquare
} from 'lucide-react';
import { generateAndDownloadDocx } from '../services/DocxGenerator';

export default function DocumentEditor({ currentPersona, onSubmitForReview, onUpdateDocument, editingDoc, onClearEditingDoc }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Audit & Compliance");
  const [contentHtml, setContentHtml] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    if (editingDoc) {
      setTitle(editingDoc.title || "");
      setCategory(editingDoc.category || "Audit & Compliance");
      setContentHtml(editingDoc.content_html || "");
    }
  }, [editingDoc]);

  // Preset Template Loader
  const loadSampleAuditTemplate = () => {
    setTitle("Q3 Enterprise Information Security & Access Audit");
    setCategory("Audit & Compliance");
    setContentHtml(`<h1>1. Executive Summary</h1>
<p>Comprehensive review of group policies, document management privileges (full_control vs read_only), and workflow reviewer/approver roles across corporate and zonal hubs.</p>

<h2>2. Security & Policy Compliance Matrix</h2>
<table>
  <thead>
    <tr>
      <th>User Group / Role</th>
      <th>Office Scope</th>
      <th>DMS Rights</th>
      <th>Workflow Role</th>
      <th>Compliance Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Security Lead Policy</td>
      <td>Headquarters - New Delhi</td>
      <td>full_control</td>
      <td>Approver</td>
      <td>VERIFIED</td>
    </tr>
    <tr>
      <td>Regional IT Reviewers</td>
      <td>Zone East & West Offices</td>
      <td>read_only</td>
      <td>Reviewer</td>
      <td>VERIFIED</td>
    </tr>
    <tr>
      <td>Individual Privilege Overrides</td>
      <td>Branch & Site Offices</td>
      <td>full_control</td>
      <td>Reviewer</td>
      <td>VERIFIED</td>
    </tr>
  </tbody>
</table>

<h2>3. Recommendations & Sign-off</h2>
<p>All access modifications require multi-stage reviewer endorsement and final approver authorization prior to publication into the official document repository.</p>`);
  };

  const insertFormatting = (tagStart, tagEnd = '') => {
    setContentHtml(prev => prev + `\n${tagStart}Insert your content here${tagEnd}\n`);
  };

  const handleDownloadDocx = async () => {
    setIsDownloading(true);
    try {
      await generateAndDownloadDocx({
        title: title || "Document",
        category,
        authorName: currentPersona?.name || "Author",
        reviewerName: "Reviewer",
        approverName: "Approver",
        status: editingDoc ? editingDoc.status : "Draft",
        contentHtml
      });
    } catch (err) {
      console.error("Docx generation error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const docRecord = {
      title: title.trim(),
      category: category.trim(),
      content_html: contentHtml,
      created_by_user_id: currentPersona?.id || 1,
      submit_for_review: true,
      action_by_user_id: currentPersona?.id || 1
    };

    if (editingDoc && editingDoc.id && onUpdateDocument) {
      onUpdateDocument(editingDoc.id, docRecord);
    } else {
      onSubmitForReview(docRecord);
    }

    if (onClearEditingDoc) onClearEditingDoc();
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      
      {/* Top Banner Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
            <FileText className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                Word Document (.docx) Editor
              </span>
              <span className="text-[11px] text-slate-300">• Active Author: {currentPersona?.name || "Author"}</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {editingDoc ? `Editing Document #${editingDoc.id}` : "Create Formatted Report"}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {editingDoc && onClearEditingDoc && (
            <button
              type="button"
              onClick={onClearEditingDoc}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              New Document
            </button>
          )}

          <button
            type="button"
            onClick={loadSampleAuditTemplate}
            className="px-3.5 py-2 bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-200 hover:text-white text-xs font-bold rounded-xl border border-indigo-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>Load Audit Template</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadDocx}
            disabled={isDownloading}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? "Generating..." : "Generate .docx File"}</span>
          </button>
        </div>
      </div>

      {/* Returned Feedback Banner if editing a returned doc */}
      {editingDoc && editingDoc.status === 'Returned to Author' && (
        <div className="bg-rose-50 border-b border-rose-200 p-4 flex items-start space-x-3 text-rose-900 shrink-0">
          <RotateCcw className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-extrabold text-xs">Document Returned with Feedback</h4>
            {editingDoc.reviewer_notes ? (
              <p className="text-xs mt-1 bg-white p-2.5 rounded-xl border border-rose-200 font-medium text-rose-800 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-rose-600 shrink-0" />
                <span><strong>Feedback:</strong> {editingDoc.reviewer_notes}</span>
              </p>
            ) : (
              <p className="text-xs mt-0.5 text-rose-700">Please review your content, update necessary sections, and resubmit for review.</p>
            )}
          </div>
        </div>
      )}

      {/* Editor Body Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-5 overflow-y-auto space-y-4">
        
        {/* Title & Category Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Document Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title..."
              required
              className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-300/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs font-bold text-slate-900 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Report Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-300/80 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs font-semibold text-slate-800"
            >
              <option value="Audit & Compliance">Audit & Compliance</option>
              <option value="Security Policy">Security Policy</option>
              <option value="Executive Brief">Executive Brief</option>
              <option value="System Access Review">System Access Review</option>
            </select>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="bg-slate-100/90 border border-slate-200/90 rounded-xl p-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-700 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider">Formatting:</span>
          
          <button
            type="button"
            onClick={() => insertFormatting('<h1>', '</h1>')}
            className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('<h2>', '</h2>')}
            className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('<strong>', '</strong>')}
            className="px-2 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('<table><thead><tr><th>Header 1</th><th>Header 2</th></tr></thead><tbody><tr><td>Data 1</td><td>Data 2</td></tr></tbody></table>')}
            className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>

          <div className="ml-auto">
            <button
              type="button"
              onClick={() => setShowPreviewModal(!showPreviewModal)}
              className="px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPreviewModal ? "Hide Preview" : "Live HTML Preview"}</span>
            </button>
          </div>
        </div>

        {/* Text Canvas & Live Preview Section */}
        <div className="flex-1 min-h-[240px] grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col min-h-[200px]">
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Document HTML / Structured Content Editor
            </label>
            <textarea
              value={contentHtml}
              onChange={(e) => setContentHtml(e.target.value)}
              rows={10}
              className="flex-1 w-full p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-800 shadow-inner resize-none leading-relaxed min-h-[180px]"
            />
          </div>

          <div className="flex flex-col min-h-[200px]">
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Formatted Page Preview (.docx Layout)</span>
              <span className="text-[10px] text-slate-400 font-normal">WYSIWYG Fidelity</span>
            </label>
            <div className="flex-1 w-full p-5 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto space-y-3 font-['Plus_Jakarta_Sans',sans-serif] text-xs text-slate-700 leading-normal shadow-inner min-h-[180px]">
              <div
                className="prose prose-xs max-w-none prose-headings:text-indigo-950 prose-table:border-collapse prose-table:border prose-th:bg-indigo-900 prose-th:text-white prose-th:p-2 prose-td:p-2 prose-td:border"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Submission Bar */}
        <div className="shrink-0 mt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl gap-3 shadow-2xs">
          <div className="flex items-center space-x-2 text-xs text-slate-700">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Workflow Action: Author ({currentPersona?.name || 'Author'}) finalizes content and submits to Reviewer queue (`Pending Review`).</span>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>{editingDoc ? "Save Updates & Submit to Reviewer" : "Finalize & Submit to Reviewer"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
