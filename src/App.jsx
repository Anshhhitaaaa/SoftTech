import React, { useState, useEffect } from 'react';
import { Users, User, Search, Plus, RefreshCw, FileText, Clock, AlertCircle } from 'lucide-react';
import HeaderTabNav from './components/HeaderTabNav';
import EmptyState from './components/EmptyState';
import DataTable from './components/DataTable';
import CreateGroupModal from './components/CreateGroupModal';
import AddIndividualAccessModal from './components/AddIndividualAccessModal';
import MasterDetailModal from './components/MasterDetailModal';
import DocumentEditor from './components/DocumentEditor';
import WorkflowReviewModal from './components/WorkflowReviewModal';
import DocumentsRepository from './components/DocumentsRepository';

import {
  getOfficeCategoryName,
  getOfficeName,
  getDepartmentName,
  getDesignationName
} from './data/mockData';

import {
  fetchUserGroups,
  createUserGroupApi,
  deleteUserGroupApi,
  fetchIndividualAccesses,
  createIndividualAccessApi,
  deleteIndividualAccessApi,
  fetchDocuments,
  createDocumentApi,
  updateDocumentStatusApi,
  deleteDocumentApi
} from './services/api';

const personas = [
  { id: 1, name: "Rahul Sharma", role: "Normal User", category: "Creator" },
  { id: 2, name: "Priya Patel", role: "Reviewer", category: "Reviewer" },
  { id: 8, name: "Kavita Singh", role: "Approver", category: "Approver" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('user-groups'); // 'user-groups' | 'individual-access' | 'doc-editor' | 'documents-repo'
  const [currentPersona, setCurrentPersona] = useState(personas[0]); // Default: Normal User

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [userGroups, setUserGroups] = useState([]);
  const [individualAccessList, setIndividualAccessList] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isIndividualModalOpen, setIsIndividualModalOpen] = useState(false);

  const [masterDetailItem, setMasterDetailItem] = useState(null);
  const [isMasterDetailOpen, setIsMasterDetailOpen] = useState(false);

  const [selectedReviewDoc, setSelectedReviewDoc] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const groups = await fetchUserGroups();
    const accesses = await fetchIndividualAccesses();
    const docs = await fetchDocuments();

    if (groups !== null) setUserGroups(groups);
    if (accesses !== null) setIndividualAccessList(accesses);

    if (docs !== null) {
      setDocuments(docs);
    } else {
      // Fallback initial sample document
      setDocuments([
        {
          id: 1,
          title: "Q3 Enterprise Information Security & Access Policy Audit",
          category: "Audit & Compliance",
          content_html: "<h1>Enterprise Information Security Audit</h1><p>Comprehensive review of group policies and individual access assignments across regional offices.</p><table><tr><th>Metric</th><th>Status</th></tr><tr><td>MFA Compliance</td><td>99.4%</td></tr><tr><td>DMS Access Control</td><td>Verified</td></tr></table>",
          status: "Approved",
          created_by_user_id: 1,
          created_by_user_name: "Rahul Sharma",
          reviewed_by_user_id: 2,
          reviewed_by_user_name: "Priya Patel",
          approved_by_user_id: 8,
          approved_by_user_name: "Kavita Singh",
          reviewer_notes: "Verified against Q3 compliance matrix. All criteria satisfied.",
          created_at: "2026-07-28T10:00:00Z",
          updated_at: "2026-07-30T15:30:00Z"
        }
      ]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateGroup = async (newGroupData) => {
    const savedGroup = await createUserGroupApi(newGroupData);
    if (savedGroup) {
      setUserGroups([savedGroup, ...userGroups]);
    } else {
      setUserGroups([newGroupData, ...userGroups]);
    }
  };

  const handleAddIndividualAccess = async (newAccessData) => {
    const savedAccess = await createIndividualAccessApi(newAccessData);
    if (savedAccess) {
      setIndividualAccessList([savedAccess, ...individualAccessList]);
    } else {
      setIndividualAccessList([newAccessData, ...individualAccessList]);
    }
  };

  const handleDeleteGroup = async (id) => {
    await deleteUserGroupApi(id);
    setUserGroups(userGroups.filter(g => g.id !== id));
  };

  const handleDeleteIndividual = async (id) => {
    await deleteIndividualAccessApi(id);
    setIndividualAccessList(individualAccessList.filter(i => i.id !== id));
  };

  // Document Automation & Workflow Handlers
  const handleCreateDocument = async (docRecord) => {
    const savedDoc = await createDocumentApi(docRecord);
    const newDocObj = savedDoc || {
      id: Date.now(),
      title: docRecord.title,
      category: docRecord.category,
      content_html: docRecord.content_html,
      status: docRecord.submit_for_review ? 'Pending Review' : 'Draft',
      created_by_user_id: currentPersona.id,
      created_by_user_name: currentPersona.name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setDocuments([newDocObj, ...documents]);

    // If submitted for review, switch tab to notify or open review queue
    if (docRecord.submit_for_review) {
      alert(`Report "${docRecord.title}" submitted to Reviewer (Priya Patel)! Current status: Pending Review.`);
    }
  };

  const handleUpdateDocumentStatus = async (id, status, actionUserId, reviewerNotes) => {
    const updatedDoc = await updateDocumentStatusApi(id, status, actionUserId, reviewerNotes);
    if (updatedDoc) {
      setDocuments(documents.map(d => d.id === id ? updatedDoc : d));
    } else {
      setDocuments(documents.map(d => {
        if (d.id === id) {
          return {
            ...d,
            status,
            reviewer_notes: reviewerNotes || d.reviewer_notes,
            reviewed_by_user_name: status === 'Pending Approval' ? currentPersona.name : d.reviewed_by_user_name,
            approved_by_user_name: status === 'Approved' ? currentPersona.name : d.approved_by_user_name,
            updated_at: new Date().toISOString()
          };
        }
        return d;
      }));
    }

    if (status === 'Approved') {
      alert(`Document finalized by Approver (${currentPersona.name})! It is now published and visible in the Documents menu.`);
      setActiveTab('documents-repo');
    }
  };

  const handleDeleteDocument = async (id) => {
    await deleteDocumentApi(id);
    setDocuments(documents.filter(d => d.id !== id));
  };

  const handleOpenMasterDetail = (item) => {
    setMasterDetailItem(item);
    setIsMasterDetailOpen(true);
  };

  const handleInspectDocument = (doc) => {
    setSelectedReviewDoc(doc);
    setIsReviewModalOpen(true);
  };

  // Universal Omni-Search Filters
  const filteredGroups = userGroups.filter(g => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const matchName = g.group_name?.toLowerCase().includes(term);
    const matchDms = g.dms_access_level?.toLowerCase().includes(term);
    const matchRole = g.workflow_role?.toLowerCase().includes(term);
    const matchCat = (g.office_category_name || getOfficeCategoryName(g.office_category_id))?.toLowerCase().includes(term);
    const matchMembers = (g.users_list || g.members || []).some(m =>
      (m.full_name || m.user_name || '')?.toLowerCase().includes(term)
    );
    return matchName || matchDms || matchRole || matchCat || matchMembers;
  });

  const filteredIndividual = individualAccessList.filter(i => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const matchUserName = i.user?.full_name?.toLowerCase().includes(term);
    const matchDept = (i.department_name || getDepartmentName(i.department_id || i.user?.department_id))?.toLowerCase().includes(term);
    const matchDesig = (i.designation_name || getDesignationName(i.designation_id || i.user?.designation_id))?.toLowerCase().includes(term);
    const matchOffice = (i.office_name || getOfficeName(i.office_id))?.toLowerCase().includes(term);
    const matchOfficeCat = (i.office_category_name || getOfficeCategoryName(i.office_category_id))?.toLowerCase().includes(term);
    const matchDms = i.dms_access_level?.toLowerCase().includes(term);
    const matchRole = i.workflow_role?.toLowerCase().includes(term);
    return matchUserName || matchDept || matchDesig || matchOffice || matchOfficeCat || matchDms || matchRole;
  });

  const approvedDocuments = documents.filter(d => d.status === 'Approved');
  const pendingReviewDocs = documents.filter(d => d.status === 'Pending Review');
  const pendingApprovalDocs = documents.filter(d => d.status === 'Pending Approval');

  const filteredDocuments = approvedDocuments.filter(d => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return d.title?.toLowerCase().includes(term) || d.category?.toLowerCase().includes(term) || d.created_by_user_name?.toLowerCase().includes(term);
  });

  const isGroupTab = activeTab === 'user-groups';
  const isIndividualTab = activeTab === 'individual-access';
  const isDocEditorTab = activeTab === 'doc-editor';
  const isRepoTab = activeTab === 'documents-repo';

  return (
    <div className="h-screen overflow-hidden bg-slate-50/60 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] antialiased">

      <HeaderTabNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userGroupCount={userGroups.length}
        individualCount={individualAccessList.length}
        documentCount={approvedDocuments.length}
        currentPersona={currentPersona}
        setCurrentPersona={setCurrentPersona}
        personas={personas}
      />

      {/* Role / Workflow Notification Banner if pending items exist */}
      {(pendingReviewDocs.length > 0 || pendingApprovalDocs.length > 0) && (
        <div className="bg-gradient-to-r from-amber-500 via-indigo-600 to-violet-600 text-white text-xs px-4 py-2 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-white shrink-0 animate-pulse" />
            <span className="font-bold">Workflow Queue:</span>
            {pendingReviewDocs.length > 0 && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                {pendingReviewDocs.length} Pending Review (Reviewer Persona)
              </span>
            )}
            {pendingApprovalDocs.length > 0 && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                {pendingApprovalDocs.length} Pending Approval (Approver Persona)
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {pendingReviewDocs.length > 0 && (
              <button
                onClick={() => handleInspectDocument(pendingReviewDocs[0])}
                className="px-2.5 py-1 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-all text-[11px] cursor-pointer"
              >
                Inspect Pending Review #{pendingReviewDocs[0].id}
              </button>
            )}
            {pendingApprovalDocs.length > 0 && (
              <button
                onClick={() => handleInspectDocument(pendingApprovalDocs[0])}
                className="px-2.5 py-1 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-all text-[11px] cursor-pointer"
              >
                Inspect Pending Approval #{pendingApprovalDocs[0].id}
              </button>
            )}
          </div>
        </div>
      )}

      <main className="flex-1 min-h-0 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col">

        {/* Tab 1: User Groups & Tab 2: Individual Access */}
        {(isGroupTab || isIndividualTab) && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex-1 flex flex-col min-h-0 transition-all duration-200">

            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30 shrink-0">

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                  {isGroupTab ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    {isGroupTab ? 'User Group Policies' : 'Individual Access Privileges'}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {isGroupTab ? 'Manage group-level document rights & workflow permissions' : 'Direct user overrides & individual role assignment'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">

                <button
                  onClick={loadData}
                  disabled={isLoading}
                  title="Refresh Data"
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
                </button>

                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, dept, office, role, access..."
                    className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300/90 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder:text-slate-400 shadow-2xs font-medium"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>

                <button
                  onClick={() => isGroupTab ? setIsGroupModalOpen(true) : setIsIndividualModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isGroupTab ? "Create Group" : "Add Individual Access"}</span>
                </button>

              </div>

            </div>

            <div className="p-4 flex-1 flex flex-col min-h-0 overflow-hidden">
              {(isGroupTab ? userGroups.length === 0 : individualAccessList.length === 0) ? (
                <EmptyState
                  type={activeTab}
                  onCreateClick={() => isGroupTab ? setIsGroupModalOpen(true) : setIsIndividualModalOpen(true)}
                />
              ) : (
                <DataTable
                  items={isGroupTab ? filteredGroups : filteredIndividual}
                  type={activeTab}
                  onViewDetail={handleOpenMasterDetail}
                  onDeleteItem={isGroupTab ? handleDeleteGroup : handleDeleteIndividual}
                />
              )}
            </div>

          </div>
        )}

        {/* Tab 3: Word Document Automation Editor */}
        {isDocEditorTab && (
          <DocumentEditor
            currentPersona={currentPersona}
            onSubmitForReview={handleCreateDocument}
            onSaveDraft={handleCreateDocument}
          />
        )}

        {/* Tab 4: Published Documents Repository */}
        {isRepoTab && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Published Documents Repository</h2>
                <p className="text-xs text-slate-500">Official finalized Word documents (.docx) approved by reviewer & approver</p>
              </div>

              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search published documents..."
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300/90 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder:text-slate-400 shadow-2xs font-medium"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <DocumentsRepository
              documents={filteredDocuments}
              onInspectDocument={handleInspectDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          </div>
        )}

      </main>

      {/* Modals */}
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onSubmit={handleCreateGroup}
      />

      <AddIndividualAccessModal
        isOpen={isIndividualModalOpen}
        onClose={() => setIsIndividualModalOpen(false)}
        onSubmit={handleAddIndividualAccess}
      />

      <MasterDetailModal
        item={masterDetailItem}
        type={activeTab}
        isOpen={isMasterDetailOpen}
        onClose={() => setIsMasterDetailOpen(false)}
      />

      <WorkflowReviewModal
        doc={selectedReviewDoc}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        currentPersona={currentPersona}
        onUpdateStatus={handleUpdateDocumentStatus}
      />

    </div>
  );
}
