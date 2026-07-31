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
      officeCategoryId: Number(formData.office_category_id),
      officeId: Number(formData.office_id),
      departmentId: Number(formData.department_id),
      designationId: Number(formData.designation_id)
    }))
  };
}

export function formatIndividualAccessPayload(formData) {
  return {
    officeCategoryId: Number(formData.office_category_id),
    officeId: Number(formData.office_id),
    departmentId: Number(formData.department_id),
    designationId: Number(formData.designation_id),
    targetUserId: Number(formData.target_user_id),
    dmsAccessLevel: formData.dms_access_level,
    workflowRole: formData.workflow_role
  };
}

export async function fetchUserGroups() {
  try {
    const response = await fetch(`${API_BASE_URL}/usergroups`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    return data.map(g => ({
      id: g.id,
      group_name: g.groupName,
      dms_access_level: g.dmsAccessLevel,
      workflow_role: g.workflowRole,
      created_at: g.createdAt,
      members: g.members.map(m => ({
        user_id: m.userId,
        user_name: m.userName,
        office_category_id: m.officeCategoryId,
        office_category_name: m.officeCategoryName,
        office_id: m.officeId,
        office_name: m.officeName,
        department_id: m.departmentId,
        department_name: m.departmentName,
        designation_id: m.designationId,
        designation_name: m.designationName
      }))
    }));
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
    return {
      id: g.id,
      group_name: g.groupName,
      dms_access_level: g.dmsAccessLevel,
      workflow_role: g.workflowRole,
      created_at: g.createdAt,
      members: g.members.map(m => ({
        user_id: m.userId,
        user_name: m.userName,
        office_category_id: m.officeCategoryId,
        office_category_name: m.officeCategoryName,
        office_id: m.officeId,
        office_name: m.officeName,
        department_id: m.departmentId,
        department_name: m.departmentName,
        designation_id: m.designationId,
        designation_name: m.designationName
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
