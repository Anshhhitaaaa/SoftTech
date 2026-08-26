import React, { useState, useEffect } from 'react';
import { X, FileText, Search, Filter, Eye, CheckCircle2, Clock, FileCheck, User, Building2, Calendar, Download, Sparkles } from 'lucide-react';
import { fetchDrillDownDocuments } from '../../services/adminApiService';

export default function DocumentDrillDownModal({ isOpen, onClose, dimensionType, dimensionValue, filterContext }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'approved' | 'pending' | 'draft'

  useEffect(() => {
    if (isOpen && dimensionValue) {
      setLoading(true);
      
      let initialStatus = 'all';
      if (dimensionType === 'status') {
        const valLower = String(dimensionValue).toLowerCase();
        if (valLower.includes('approved')) initialStatus = 'approved';
        else if (valLower.includes('pending')) initialStatus = 'pending';
        else if (valLower.includes('draft') || valLower.includes('returned')) initialStatus = 'draft';
      }
      setStatusFilter(initialStatus);
      setSearchQuery('');
      fetchDrillDownDocuments(dimensionType, dimensionValue, filterContext)
        .then((res) => {
          setDocuments(res || []);
        })
        .catch(() => setDocuments([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen, dimensionType, dimensionValue, filterContext]);

  if (!isOpen) return null;

  const totalCount = documents.length;
  const approvedCount = documents.filter((d) => d.status === 'Approved').length;
  const pendingCount = documents.filter((d) => d.status.startsWith('Pending')).length;
  const draftCount = documents.filter((d) => d.status === 'Draft' || d.status.startsWith('Returned')).length;

  const filteredDocs = documents.filter((doc) => {
    // 1. KPI Status Filter
    if (statusFilter === 'approved' && doc.status !== 'Approved') return false;
    if (statusFilter === 'pending' && !doc.status.startsWith('Pending')) return false;
    if (statusFilter === 'draft' && doc.status !== 'Draft' && !doc.status.startsWith('Returned')) return false;

    // 2. Search Query Filter
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    return (
      doc.title?.toLowerCase().includes(term) ||
      doc.category?.toLowerCase().includes(term) ||
      doc.author_name?.toLowerCase().includes(term) ||
      doc.department_name?.toLowerCase().includes(term) ||
      doc.status?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Header Accent */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">
                  Uploaded Documents Inspection
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {dimensionValue}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any summary card below to filter the document list by status.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick KPI Summary Bar with Interactive Status Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 bg-slate-950/40 border-b border-slate-800/80">
          {/* Card 1: Total Files */}
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-3.5 rounded-2xl text-left transition-all duration-200 border cursor-pointer relative overflow-hidden group ${
              statusFilter === 'all'
                ? 'bg-indigo-500/15 border-indigo-500/60 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/10'
                : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 group-hover:text-indigo-300 transition">
                Total Uploaded Files
              </span>
              {statusFilter === 'all' && (
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              )}
            </div>
            <div className="text-xl font-extrabold text-slate-100 font-mono mt-1 flex items-baseline justify-between">
              <span>{totalCount}</span>
              <span className="text-[10px] font-sans font-normal text-indigo-400 uppercase tracking-wider">All</span>
            </div>
          </button>

          {/* Card 2: Approved Files */}
          <button
            onClick={() => setStatusFilter('approved')}
            className={`p-3.5 rounded-2xl text-left transition-all duration-200 border cursor-pointer relative overflow-hidden group ${
              statusFilter === 'approved'
                ? 'bg-emerald-500/15 border-emerald-500/60 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-400 group-hover:text-emerald-300 transition">
                Approved Files
              </span>
              {statusFilter === 'approved' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </div>
            <div className="text-xl font-extrabold text-slate-100 font-mono mt-1 flex items-baseline justify-between">
              <span>{approvedCount}</span>
              <span className="text-[10px] font-sans font-normal text-emerald-400 uppercase tracking-wider">Approved</span>
            </div>
          </button>

          {/* Card 3: Pending Files */}
          <button
            onClick={() => setStatusFilter('pending')}
            className={`p-3.5 rounded-2xl text-left transition-all duration-200 border cursor-pointer relative overflow-hidden group ${
              statusFilter === 'pending'
                ? 'bg-amber-500/15 border-amber-500/60 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-amber-400 group-hover:text-amber-300 transition">
                Pending Review/Approval
              </span>
              {statusFilter === 'pending' && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </div>
            <div className="text-xl font-extrabold text-slate-100 font-mono mt-1 flex items-baseline justify-between">
              <span>{pendingCount}</span>
              <span className="text-[10px] font-sans font-normal text-amber-400 uppercase tracking-wider">Pending</span>
            </div>
          </button>

          {/* Card 4: Draft / Returned Files */}
          <button
            onClick={() => setStatusFilter('draft')}
            className={`p-3.5 rounded-2xl text-left transition-all duration-200 border cursor-pointer relative overflow-hidden group ${
              statusFilter === 'draft'
                ? 'bg-purple-500/15 border-purple-500/60 ring-2 ring-purple-500/30 shadow-lg shadow-purple-500/10'
                : 'bg-slate-900/80 border-slate-800 hover:border-purple-500/40 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 group-hover:text-purple-300 transition">
                Draft / Returned
              </span>
              {statusFilter === 'draft' && (
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              )}
            </div>
            <div className="text-xl font-extrabold text-slate-100 font-mono mt-1 flex items-baseline justify-between">
              <span>{draftCount}</span>
              <span className="text-[10px] font-sans font-normal text-purple-400 uppercase tracking-wider">Draft</span>
            </div>
          </button>
        </div>

        {/* Search Input Bar & Active Status Filter Pill */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search uploaded files by title, author, category, or status..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {statusFilter !== 'all' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status Filter:</span>
              <button
                onClick={() => setStatusFilter('all')}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-indigo-500/30 transition"
              >
                <span className="capitalize">{statusFilter} Files</span>
                <X className="w-3.5 h-3.5 text-indigo-300" />
              </button>
            </div>
          )}
        </div>

        {/* File Table Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Fetching uploaded document records from analytics layer...</span>
            </div>
          ) : filteredDocs.length > 0 ? (
            <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-200 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Doc ID</th>
                    <th className="px-4 py-3">Document Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Author & Dept</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Upload Date</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-800/40 transition group">
                      <td className="px-4 py-3 text-indigo-400 font-bold">#{1000 + doc.id}</td>
                      <td className="px-4 py-3 font-sans font-semibold text-slate-100 max-w-xs truncate">
                        {doc.title}
                      </td>
                      <td className="px-4 py-3 font-sans">
                        <span
                          onClick={() => setSearchQuery(doc.category)}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] cursor-pointer transition"
                          title="Click to filter by this category"
                        >
                          {doc.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-sans">
                        <div
                          onClick={() => setSearchQuery(doc.author_name)}
                          className="text-slate-200 hover:text-indigo-300 font-medium cursor-pointer transition"
                          title="Click to search by author"
                        >
                          {doc.author_name}
                        </div>
                        <div
                          onClick={() => setSearchQuery(doc.department_name)}
                          className="text-[10px] text-slate-400 hover:text-indigo-300 cursor-pointer transition"
                          title="Click to search by department"
                        >
                          {doc.department_name}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-sans">
                        <span
                          onClick={() => {
                            if (doc.status === 'Approved') setStatusFilter('approved');
                            else if (doc.status.startsWith('Pending')) setStatusFilter('pending');
                            else setStatusFilter('draft');
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer hover:scale-105 transition ${
                            doc.status === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : doc.status.startsWith('Pending')
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-700/50 text-slate-300 border border-slate-600/40'
                          }`}
                          title="Click to filter by this status"
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-[11px]">{doc.created_at}</td>
                      <td className="px-4 py-3 text-right font-sans">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="px-3 py-1 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto transition shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center space-y-2">
              <span>No matching document files found for this status filter.</span>
              {statusFilter !== 'all' && (
                <button
                  onClick={() => setStatusFilter('all')}
                  className="text-indigo-400 hover:underline text-xs font-semibold"
                >
                  Clear Status Filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredDocs.length} of {documents.length} files</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition"
          >
            Close Inspector
          </button>
        </div>

        {/* Sub-Modal: Detailed Document Content Inspector */}
        {selectedDoc && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-100">{selectedDoc.title}</h4>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                    <span>Uploaded by {selectedDoc.author_name} ({selectedDoc.department_name})</span>
                    <span>•</span>
                    <span className="font-mono text-indigo-400">{selectedDoc.created_at}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Box */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-200 text-xs leading-relaxed font-mono">
                  <div dangerouslySetInnerHTML={{ __html: selectedDoc.content_html }} />
                </div>

                {selectedDoc.reviewer_notes && (
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-200 font-sans">Compliance & Workflow Audit Notes:</strong>
                      {selectedDoc.reviewer_notes}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs"
                >
                  Back to List
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
