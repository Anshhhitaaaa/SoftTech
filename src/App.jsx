import React, { useState, useEffect } from 'react';
import { Users, User, Search, Plus, RefreshCw, FileText, Clock, AlertCircle, RotateCcw } from 'lucide-react';
import HeaderTabNav from './components/HeaderTabNav';
import EmptyState from './components/EmptyState';
import DataTable from './components/DataTable';
import CreateGroupModal from './components/CreateGroupModal';
import AddIndividualAccessModal from './components/AddIndividualAccessModal';
import MasterDetailModal from './components/MasterDetailModal';
import DocumentEditor from './components/DocumentEditor';
import WorkflowReviewModal from './components/WorkflowReviewModal';
import DocumentsRepository from './components/DocumentsRepository';
import LoginModal from './components/LoginModal';

import {
  users as mockUsersList,
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
  updateDocumentContentApi,
  updateDocumentStatusApi,
  deleteDocumentApi,
  fetchLookups,
  createUserApi
} from './services/api';

const defaultUser = { id: 1, name: "Rahul Sharma", role: "Normal User", department: "Information Technology", designation: "Senior Architect" };

const fallbackUsersList = mockUsersList.map(u => ({
  id: u.id,
  fullName: u.full_name,
  departmentName: getDepartmentName(u.department_id),
  designationName: getDesignationName(u.designation_id)
}));

export default function App() {
  const [activeTab, setActiveTab] = useState('user-groups'); // 'user-groups' | 'individual-access' | 'doc-editor' | 'documents-repo'
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true); // Auto open login modal on launch

  const [allDbUsers, setAllDbUsers] = useState(fallbackUsersList);
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

  const [editingDoc, setEditingDoc] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    const groups = await fetchUserGroups();
    const accesses = await fetchIndividualAccesses();
    const docs = await fetchDocuments();
    const lookups = await fetchLookups();

    if (groups !== null) setUserGroups(groups);
    if (accesses !== null) setIndividualAccessList(accesses);

    let finalDocs = [];
    if (docs && docs.length > 0) {
      finalDocs = docs;
    } else {
      const localSaved = localStorage.getItem('softtech_documents');
      if (localSaved) {
        try {
          finalDocs = JSON.parse(localSaved);
        } catch {
          finalDocs = [];
        }
      }
    }

    if (finalDocs.length === 0) {
      finalDocs = [
        {
          id: 1,
          title: "Q3 Enterprise Information Security & Access Policy Audit",
          category: "Audit & Compliance",
          content_html: "<h1>Enterprise Information Security Audit</h1><p>Comprehensive review of group policies and individual access assignments across regional offices.</p>",
          status: "Approved",
          created_by_user_id: 1,
          created_by_user_name: "Rahul Sharma",
          reviewed_by_user_id: 2,
          reviewed_by_user_name: "Priya Patel",
          approved_by_user_id: 8,
          approved_by_user_name: "Kavita Singh",
          reviewer_notes: "Verified against Q3 compliance matrix. All criteria satisfied.",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }

    setDocuments(finalDocs);
    localStorage.setItem('softtech_documents', JSON.stringify(finalDocs));

    let dbUsers = (lookups && lookups.users && lookups.users.length > 0) ? lookups.users : fallbackUsersList;
    const localUsers = localStorage.getItem('softtech_users');
    if (localUsers) {
      try {
        const parsed = JSON.parse(localUsers);
        if (Array.isArray(parsed)) {
          // Merge local users without duplicating IDs
          const existingIds = new Set(dbUsers.map(u => u.id));
          const extraUsers = parsed.filter(u => !existingIds.has(u.id));
          dbUsers = [...extraUsers, ...dbUsers];
        }
      } catch {
        // ignore
      }
    }
    setAllDbUsers(dbUsers);

    setIsLoading(false);
  };

  const handleSignUpUser = async (newUserObj) => {
    // 1. Send to Backend DB API
    const savedUser = await createUserApi(newUserObj);
    const userToSave = savedUser || newUserObj;

    // 2. Update React State
    setAllDbUsers(prev => {
      const updated = [userToSave, ...prev.filter(u => u.id !== userToSave.id)];
      localStorage.setItem('softtech_users', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save documents to localStorage whenever documents state updates
  useEffect(() => {
    if (documents && documents.length > 0) {
      localStorage.setItem('softtech_documents', JSON.stringify(documents));
    }
  }, [documents]);

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

  // Document Workflow Handlers
  const handleCreateDocument = async (docRecord) => {
    const savedDoc = await createDocumentApi(docRecord);
    const newDocObj = savedDoc || {
      id: Date.now(),
      title: docRecord.title,
      category: docRecord.category,
      content_html: docRecord.content_html,
      status: docRecord.submit_for_review ? 'Pending Review' : 'Draft',
      created_by_user_id: currentUser?.id || 1,
      created_by_user_name: currentUser?.name || "Author",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setDocuments([newDocObj, ...documents]);

    if (docRecord.submit_for_review) {
      alert(`Report "${docRecord.title}" submitted to Reviewer queue! Current status: Pending Review.`);
    }
  };

  const handleUpdateDocumentContent = async (id, docRecord) => {
    const updatedDoc = await updateDocumentContentApi(id, docRecord);
    if (updatedDoc) {
      setDocuments(documents.map(d => d.id === id ? updatedDoc : d));
    } else {
      setDocuments(documents.map(d => {
        if (d.id === id) {
          return {
            ...d,
            title: docRecord.title,
            category: docRecord.category,
            content_html: docRecord.content_html,
            status: docRecord.submit_for_review ? 'Pending Review' : 'Draft',
            updated_at: new Date().toISOString()
          };
        }
        return d;
      }));
    }
    setEditingDoc(null);
    alert(`Document #${id} updated and resubmitted to Reviewer queue!`);
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
            reviewed_by_user_name: status === 'Pending Approval' ? (currentUser?.name || "Reviewer") : d.reviewed_by_user_name,
            approved_by_user_name: status === 'Approved' ? (currentUser?.name || "Approver") : d.approved_by_user_name,
            updated_at: new Date().toISOString()
          };
        }
        return d;
      }));
    }

    if (status === 'Approved') {
      alert(`Document finalized by Approver (${currentUser.name})! Published in Documents menu.`);
      setActiveTab('documents-repo');
    } else if (status === 'Returned to Author') {
      alert(`Document #${id} sent back to Author with comments.`);
    } else if (status === 'Returned to Reviewer') {
      alert(`Document #${id} sent back to Reviewer with comments.`);
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

  const handleEditReturnedDoc = (doc) => {
    setEditingDoc(doc);
    setActiveTab('doc-editor');
  };

  // Search Filters
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
  const pendingReviewDocs = documents.filter(d => d.status === 'Pending Review' || d.status === 'Returned to Reviewer');
  const pendingApprovalDocs = documents.filter(d => d.status === 'Pending Approval');
  const returnedToAuthorDocs = documents.filter(d => d.status === 'Returned to Author');

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
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Role-Based Workflow Banner */}
      {currentUser?.role === 'Reviewer' && pendingReviewDocs.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs px-4 py-2 flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-white shrink-0 animate-pulse" />
            <span className="font-bold">Reviewer Queue:</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-semibold">
              {pendingReviewDocs.length} Document(s) Awaiting Review
            </span>
          </div>
          <button
            onClick={() => handleInspectDocument(pendingReviewDocs[0])}
            className="px-3 py-1 bg-white text-indigo-900 font-bold rounded-lg hover:bg-slate-100 transition-all text-xs cursor-pointer shadow-xs"
          >
            Inspect Document #{pendingReviewDocs[0].id}
          </button>
        </div>
      )}

      {currentUser?.role === 'Approver' && pendingApprovalDocs.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs px-4 py-2 flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-white shrink-0 animate-pulse" />
            <span className="font-bold">Approver Queue:</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-semibold">
              {pendingApprovalDocs.length} Document(s) Awaiting Final Approval
            </span>
          </div>
          <button
            onClick={() => handleInspectDocument(pendingApprovalDocs[0])}
            className="px-3 py-1 bg-white text-amber-900 font-bold rounded-lg hover:bg-slate-100 transition-all text-xs cursor-pointer shadow-xs"
          >
            Inspect Document #{pendingApprovalDocs[0].id}
          </button>
        </div>
      )}

      {currentUser?.role === 'Normal User' && returnedToAuthorDocs.length > 0 && (
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs px-4 py-2 flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-4 h-4 text-white shrink-0 animate-spin" />
            <span className="font-bold">Returned Documents:</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-semibold">
              {returnedToAuthorDocs.length} Document(s) returned with feedback
            </span>
          </div>
          <button
            onClick={() => handleEditReturnedDoc(returnedToAuthorDocs[0])}
            className="px-3 py-1 bg-white text-rose-900 font-bold rounded-lg hover:bg-slate-100 transition-all text-xs cursor-pointer shadow-xs"
          >
            Edit & Resubmit Doc #{returnedToAuthorDocs[0].id}
          </button>
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
            currentPersona={currentUser}
            onSubmitForReview={handleCreateDocument}
            onUpdateDocument={handleUpdateDocumentContent}
            editingDoc={editingDoc}
            onClearEditingDoc={() => setEditingDoc(null)}
          />
        )}

        {/* Tab 4: Published Documents Repository */}
        {isRepoTab && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Published Documents Repository</h2>
                <p className="text-xs text-slate-500 font-medium">Official finalized Word documents (.docx) approved by reviewer & approver</p>
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
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        allUsers={allDbUsers}
        currentUser={currentUser}
        onLoginSuccess={(loggedUser) => {
          setCurrentUser(loggedUser);
          if (loggedUser.role === 'Reviewer' && pendingReviewDocs.length > 0) {
            handleInspectDocument(pendingReviewDocs[0]);
          } else if (loggedUser.role === 'Approver' && pendingApprovalDocs.length > 0) {
            handleInspectDocument(pendingApprovalDocs[0]);
          }
        }}
        onSignUpUser={handleSignUpUser}
        userGroups={userGroups}
        individualAccesses={individualAccessList}
      />

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
        currentPersona={currentUser}
        onUpdateStatus={handleUpdateDocumentStatus}
      />

    </div>
  );
}
