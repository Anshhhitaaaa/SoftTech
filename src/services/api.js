// Centralized API Service Module for SoftTech
import { getOfficeCategoryName, getOfficeName, getDepartmentName, getDesignationName, getUser } from '../data/mockData';

const isLocalhost = typeof window !== 'undefined' && Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (isLocalhost ? 'http://localhost:5000/api' : 'https://softtech-api.onrender.com/api');

/**
 * Generic HTTP Request Helper
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      console.warn(`[API Warning] ${config.method || 'GET'} ${url} returned ${response.status}`);
      return null;
    }
    if (response.status === 204) return true;
    return await response.json();
  } catch (error) {
    console.error(`[API Error] ${config.method || 'GET'} ${url} failed:`, error.message);
    return null;
  }
}

// ----------------------------------------------------
// DTO & Data Mappers
// ----------------------------------------------------
export function mapGroupFromApi(g, fallbackFormData = {}) {
  if (!g) return null;
  const firstMember = g.members && g.members.length > 0 ? g.members[0] : null;
  return {
    id: g.id,
    group_name: g.groupName,
    dms_access_level: g.dmsAccessLevel,
    workflow_role: g.workflowRole,
    created_at: g.createdAt,
    office_category_id: firstMember ? firstMember.officeCategoryId : (Number(fallbackFormData.office_category_id) || 1),
    office_id: firstMember ? firstMember.officeId : (Number(fallbackFormData.office_id) || 1),
    department_id: firstMember ? firstMember.departmentId : (Number(fallbackFormData.department_id) || 1),
    designation_id: firstMember ? firstMember.designationId : (Number(fallbackFormData.designation_id) || 1),
    members: g.members || [],
    users_list: (g.members || []).map(m => ({
      id: m.userId,
      full_name: m.userName
    }))
  };
}

export function mapIndividualFromApi(i) {
  if (!i) return null;
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
}

export function mapDocumentFromApi(d) {
  if (!d) return null;
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
}

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

// ----------------------------------------------------
// API Service Methods
// ----------------------------------------------------
export async function fetchUserGroups() {
  const data = await apiFetch('/usergroups');
  return Array.isArray(data) ? data.map(g => mapGroupFromApi(g)) : null;
}

export async function createUserGroupApi(formData) {
  const payload = formatUserGroupPayload(formData);
  const data = await apiFetch('/usergroups', { method: 'POST', body: JSON.stringify(payload) });
  return data ? mapGroupFromApi(data, formData) : null;
}

export async function deleteUserGroupApi(id) {
  const result = await apiFetch(`/usergroups/${id}`, { method: 'DELETE' });
  return result !== null;
}

export async function fetchIndividualAccesses() {
  const data = await apiFetch('/individualaccess');
  return Array.isArray(data) ? data.map(mapIndividualFromApi) : null;
}

export async function createIndividualAccessApi(formData) {
  const payload = formatIndividualAccessPayload(formData);
  const data = await apiFetch('/individualaccess', { method: 'POST', body: JSON.stringify(payload) });
  return data ? mapIndividualFromApi(data) : null;
}

export async function deleteIndividualAccessApi(id) {
  const result = await apiFetch(`/individualaccess/${id}`, { method: 'DELETE' });
  return result !== null;
}

export async function fetchDocuments(status = null) {
  const endpoint = status ? `/documents?status=${encodeURIComponent(status)}` : '/documents';
  const data = await apiFetch(endpoint);
  return Array.isArray(data) ? data.map(mapDocumentFromApi) : null;
}

export async function createDocumentApi(docData) {
  const payload = {
    title: docData.title,
    category: docData.category || "Audit & Compliance Report",
    contentHtml: docData.content_html,
    createdByUserId: Number(docData.created_by_user_id || 1),
    submitForReview: Boolean(docData.submit_for_review)
  };
  const data = await apiFetch('/documents', { method: 'POST', body: JSON.stringify(payload) });
  return data ? mapDocumentFromApi(data) : null;
}

export async function updateDocumentContentApi(id, docData) {
  const payload = {
    title: docData.title,
    category: docData.category || "Audit & Compliance Report",
    contentHtml: docData.content_html,
    submitForReview: Boolean(docData.submit_for_review),
    actionByUserId: Number(docData.action_by_user_id || 1)
  };
  const data = await apiFetch(`/documents/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  return data ? mapDocumentFromApi(data) : null;
}

export async function updateDocumentStatusApi(id, status, actionByUserId, reviewerNotes = null) {
  const payload = {
    status,
    actionByUserId: Number(actionByUserId || 1),
    reviewerNotes
  };
  const data = await apiFetch(`/documents/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) });
  return data ? mapDocumentFromApi(data) : null;
}

export async function deleteDocumentApi(id) {
  const result = await apiFetch(`/documents/${id}`, { method: 'DELETE' });
  return result !== null;
}

export async function fetchLookups() {
  return await apiFetch('/lookup/all');
}

export async function createUserApi(userData) {
  const payload = {
    fullName: userData.fullName || userData.full_name,
    departmentName: userData.departmentName || userData.department_name || "Information Technology",
    designationName: userData.designationName || userData.designation_name || "Senior Specialist",
    role: userData.role || "Normal User"
  };
  const u = await apiFetch('/users', { method: 'POST', body: JSON.stringify(payload) });
  if (!u) return null;
  return {
    id: u.id,
    fullName: u.fullName,
    full_name: u.fullName,
    departmentName: u.departmentName,
    department_name: u.departmentName,
    designationName: u.designationName,
    designation_name: u.designationName,
    role: u.role
  };
}



