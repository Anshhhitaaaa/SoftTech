import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  fetchDocuments,
  createDocumentApi,
  updateDocumentContentApi,
  updateDocumentStatusApi,
  deleteDocumentApi
} from '../services/api';

const defaultAuditDocument = {
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
};

/**
 * Custom Hook to manage Document Lifecycle and Role-Based Approval Workflow State
 */
export function useDocumentWorkflow(currentUser, setActiveTab) {
  const [documents, setDocuments] = useState([]);
  const [selectedReviewDoc, setSelectedReviewDoc] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  const loadDocuments = useCallback(async () => {
    const docs = await fetchDocuments();
    let finalDocs = [];

    if (docs && docs.length > 0) {
      finalDocs = docs;
    } else {
      const localSaved = localStorage.getItem('softtech_documents');
      if (localSaved) {
        try { finalDocs = JSON.parse(localSaved); } catch { finalDocs = []; }
      }
    }

    if (finalDocs.length === 0) {
      finalDocs = [defaultAuditDocument];
    }

    setDocuments(finalDocs);
    localStorage.setItem('softtech_documents', JSON.stringify(finalDocs));
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Persist local changes
  useEffect(() => {
    if (documents && documents.length > 0) {
      localStorage.setItem('softtech_documents', JSON.stringify(documents));
    }
  }, [documents]);

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

    setDocuments(prev => [newDocObj, ...prev]);

    if (docRecord.submit_for_review) {
      alert(`Report "${docRecord.title}" submitted to Reviewer queue! Current status: Pending Review.`);
    }
  };

  const handleUpdateDocumentContent = async (id, docRecord) => {
    const updatedDoc = await updateDocumentContentApi(id, docRecord);
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        return updatedDoc || {
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

    setEditingDoc(null);
    alert(`Document #${id} updated and resubmitted to Reviewer queue!`);
  };

  const handleUpdateDocumentStatus = async (id, status, actionUserId, reviewerNotes) => {
    const updatedDoc = await updateDocumentStatusApi(id, status, actionUserId, reviewerNotes);
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        return updatedDoc || {
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

    if (status === 'Approved') {
      alert(`Document finalized by Approver (${currentUser?.name})! Published in Documents menu.`);
      if (setActiveTab) setActiveTab('documents-repo');
    } else if (status === 'Returned to Author') {
      alert(`Document #${id} sent back to Author with comments.`);
    } else if (status === 'Returned to Reviewer') {
      alert(`Document #${id} sent back to Reviewer with comments.`);
    }
  };

  const handleDeleteDocument = async (id) => {
    await deleteDocumentApi(id);
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleInspectDocument = (doc) => {
    setSelectedReviewDoc(doc);
    setIsReviewModalOpen(true);
  };

  const handleEditReturnedDoc = (doc) => {
    setEditingDoc(doc);
    if (setActiveTab) setActiveTab('doc-editor');
  };

  // Workflow Queues Computation
  const approvedDocuments = useMemo(() => documents.filter(d => d.status === 'Approved'), [documents]);
  const pendingReviewDocs = useMemo(() => documents.filter(d => d.status === 'Pending Review' || d.status === 'Returned to Reviewer'), [documents]);
  const pendingApprovalDocs = useMemo(() => documents.filter(d => d.status === 'Pending Approval'), [documents]);
  const returnedToAuthorDocs = useMemo(() => documents.filter(d => d.status === 'Returned to Author'), [documents]);

  return {
    documents,
    approvedDocuments,
    pendingReviewDocs,
    pendingApprovalDocs,
    returnedToAuthorDocs,
    selectedReviewDoc,
    isReviewModalOpen,
    setIsReviewModalOpen,
    editingDoc,
    setEditingDoc,
    handleCreateDocument,
    handleUpdateDocumentContent,
    handleUpdateDocumentStatus,
    handleDeleteDocument,
    handleInspectDocument,
    handleEditReturnedDoc
  };
}
