import { getOfficeCategoryName, getOfficeName, getDepartmentName, getDesignationName, getUser } from '../data/mockData';

const isLocalhost = typeof window !== 'undefined' && Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (isLocalhost ? 'http://localhost:5000/api' : 'https://softtech-api.onrender.com/api');

export function formatUserGroupPayload(formData) {
  return {
    groupName: formData.group_name,
    dmsAccessLevel: formData.dms_access_level,
    workflowRole: formData.workflow_role,
    members: (formData.selected_user_ids || []).map(userId => ({
      userId: Number(userId),
      officeCategoryId: Number(formData.office_category_id || 1),
      officeId: Number(formData.office_id || 1),
      departmentId: Number(formData.department_id || 1),
      designationId: Number(formData.designation_id || 1)
    }))
  };
}

export function formatIndividualAccessPayload(formData) {
  return {
    officeCategoryId: Number(formData.office_category_id || 1),
    officeId: Number(formData.office_id || 1),
    departmentId: Number(formData.department_id || 1),
    designationId: Number(formData.designation_id || 1),
    targetUserId: Number(formData.target_user_id || 1),
    dmsAccessLevel: formData.dms_access_level,
    workflowRole: formData.workflow_role
  };
}

export async function fetchUserGroups() {
  try {
    const response = await fetch(`${API_BASE_URL}/usergroups`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    return data.map(g => {
      const firstMember = g.members && g.members.length > 0 ? g.members[0] : null;
      return {
        id: g.id,
        group_name: g.groupName,
        dms_access_level: g.dmsAccessLevel,
        workflow_role: g.workflowRole,
        created_at: g.createdAt,
        office_category_id: firstMember ? firstMember.officeCategoryId : 1,
        office_id: firstMember ? firstMember.officeId : 1,
        department_id: firstMember ? firstMember.departmentId : 1,
        designation_id: firstMember ? firstMember.designationId : 1,
        members: g.members || [],
        users_list: (g.members || []).map(m => ({
          id: m.userId,
          full_name: m.userName
        }))
      };
    });
  } catch (error) {
    return null;
  }
}

export async function createUserGroupApi(formData) {
  const payload = formatUserGroupPayload(formData);
  try {
    const response = await fetch(`${API_BASE_URL}/usergroups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Failed to create group. Status: ${response.status}`);
    const g = await response.json();
    const firstMember = g.members && g.members.length > 0 ? g.members[0] : null;
    return {
      id: g.id,
      group_name: g.groupName,
      dms_access_level: g.dmsAccessLevel,
      workflow_role: g.workflowRole,
      created_at: g.createdAt,
      office_category_id: firstMember ? firstMember.officeCategoryId : (Number(formData.office_category_id) || 1),
      office_id: firstMember ? firstMember.officeId : (Number(formData.office_id) || 1),
      department_id: firstMember ? firstMember.departmentId : (Number(formData.department_id) || 1),
      designation_id: firstMember ? firstMember.designationId : (Number(formData.designation_id) || 1),
      members: g.members || [],
      users_list: (g.members || []).map(m => ({
        id: m.userId,
        full_name: m.userName
      }))
    };
  } catch (error) {
    return null;
  }
}

export async function deleteUserGroupApi(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/usergroups/${id}`, { method: 'DELETE' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function fetchIndividualAccesses() {
  try {
    const response = await fetch(`${API_BASE_URL}/individualaccess`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    return data.map(i => ({
      id: i.id,
      office_category_id: i.officeCategoryId,
      office_category_name: i.officeCategoryName,
      office_id: i.officeId,
      office_name: i.officeName,
      department_id: i.departmentId,
      department_name: i.departmentName,
      designation_id: i.designationId,
      designation_name: i.designationName,
      target_user_id: i.targetUserId,
      user: {
        id: i.targetUserId,
        full_name: i.targetUserName
      },
      dms_access_level: i.dmsAccessLevel,
      workflow_role: i.workflowRole,
      created_at: i.createdAt
    }));
  } catch (error) {
    return null;
  }
}

export async function createIndividualAccessApi(formData) {
  const payload = formatIndividualAccessPayload(formData);
  try {
    const response = await fetch(`${API_BASE_URL}/individualaccess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Failed to save access. Status: ${response.status}`);
    const i = await response.json();
    return {
      id: i.id,
      office_category_id: i.officeCategoryId,
      office_category_name: i.officeCategoryName,
      office_id: i.officeId,
      office_name: i.officeName,
      department_id: i.departmentId,
      department_name: i.departmentName,
      designation_id: i.designationId,
      designation_name: i.designationName,
      target_user_id: i.targetUserId,
      user: {
        id: i.targetUserId,
        full_name: i.targetUserName
      },
      dms_access_level: i.dmsAccessLevel,
      workflow_role: i.workflowRole,
      created_at: i.createdAt
    };
  } catch (error) {
    return null;
  }
}

export async function deleteIndividualAccessApi(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/individualaccess/${id}`, { method: 'DELETE' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// ----------------------------------------------------
// Document Automation & Workflow API Functions
// ----------------------------------------------------
export async function fetchDocuments(status = null) {
  try {
    const url = status ? `${API_BASE_URL}/documents?status=${encodeURIComponent(status)}` : `${API_BASE_URL}/documents`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.map(d => ({
      id: d.id,
      title: d.title,
      category: d.category,
      content_html: d.contentHtml,
      status: d.status,
      created_by_user_id: d.createdByUserId,
      created_by_user_name: d.createdByUserName,
      reviewed_by_user_id: d.reviewedByUserId,
      reviewed_by_user_name: d.reviewedByUserName,
      approved_by_user_id: d.approvedByUserId,
      approved_by_user_name: d.approvedByUserName,
      reviewer_notes: d.reviewerNotes,
      created_at: d.createdAt,
      updated_at: d.updatedAt
    }));
  } catch (error) {
    return null;
  }
}

export async function createDocumentApi(docData) {
  const payload = {
    title: docData.title,
    category: docData.category || "Audit & Compliance Report",
    contentHtml: docData.content_html,
    createdByUserId: Number(docData.created_by_user_id || 1),
    submitForReview: Boolean(docData.submit_for_review)
  };
  try {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Failed to create document. Status: ${response.status}`);
    const d = await response.json();
    return {
      id: d.id,
      title: d.title,
      category: d.category,
      content_html: d.contentHtml,
      status: d.status,
      created_by_user_id: d.createdByUserId,
      created_by_user_name: d.createdByUserName,
      reviewed_by_user_id: d.reviewedByUserId,
      reviewed_by_user_name: d.reviewedByUserName,
      approved_by_user_id: d.approvedByUserId,
      approved_by_user_name: d.approvedByUserName,
      reviewer_notes: d.reviewerNotes,
      created_at: d.createdAt,
      updated_at: d.updatedAt
    };
  } catch (error) {
    return null;
  }
}

export async function updateDocumentStatusApi(id, status, actionByUserId, reviewerNotes = null) {
  const payload = {
    status: status,
    actionByUserId: Number(actionByUserId || 1),
    reviewerNotes: reviewerNotes
  };
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Failed to update status. Status: ${response.status}`);
    const d = await response.json();
    return {
      id: d.id,
      title: d.title,
      category: d.category,
      content_html: d.contentHtml,
      status: d.status,
      created_by_user_id: d.createdByUserId,
      created_by_user_name: d.createdByUserName,
      reviewed_by_user_id: d.reviewedByUserId,
      reviewed_by_user_name: d.reviewedByUserName,
      approved_by_user_id: d.approvedByUserId,
      approved_by_user_name: d.approvedByUserName,
      reviewer_notes: d.reviewerNotes,
      created_at: d.createdAt,
      updated_at: d.updatedAt
    };
  } catch (error) {
    return null;
  }
}

export async function deleteDocumentApi(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, { method: 'DELETE' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

