import { useState, useEffect, useCallback } from 'react';
import {
  users as mockUsersList,
  getDepartmentName,
  getDesignationName
} from '../data/mockData';
import {
  fetchUserGroups,
  createUserGroupApi,
  deleteUserGroupApi,
  fetchIndividualAccesses,
  createIndividualAccessApi,
  deleteIndividualAccessApi,
  fetchLookups,
  createUserApi
} from '../services/api';

const normalizeUser = (u, idx = 0) => {
  if (!u) return null;
  const uid = Number(u.id || idx + 1);
  const deptId = u.department_id || u.departmentId || ((idx % 6) + 1);
  const desigId = u.designation_id || u.designationId || ((idx % 6) + 1);
  const name = u.full_name || u.fullName || u.name || `User #${uid}`;
  const deptName = u.departmentName || u.department_name || (typeof u.department === 'string' ? u.department : getDepartmentName(deptId));
  const desigName = u.designationName || u.designation_name || (typeof u.designation === 'string' ? u.designation : getDesignationName(desigId));
  return {
    ...u,
    id: uid,
    full_name: name,
    fullName: name,
    name: name,
    department_id: Number(deptId),
    departmentId: Number(deptId),
    designation_id: Number(desigId),
    designationId: Number(desigId),
    departmentName: deptName,
    department_name: deptName,
    designationName: desigName,
    designation_name: desigName
  };
};

const fallbackUsersList = mockUsersList.map((u, idx) => normalizeUser(u, idx));

/**
 * Custom Hook to handle System Configuration data (User Groups, Individual Access, DB Users)
 */
export function useSystemConfigData() {
  const [allDbUsers, setAllDbUsers] = useState(fallbackUsersList);
  const [userGroups, setUserGroups] = useState([]);
  const [individualAccessList, setIndividualAccessList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const groups = await fetchUserGroups();
    const accesses = await fetchIndividualAccesses();
    const lookups = await fetchLookups();

    // User Groups Persistence
    if (groups && groups.length > 0) {
      setUserGroups(groups);
      localStorage.setItem('softtech_user_groups', JSON.stringify(groups));
    } else {
      const localG = localStorage.getItem('softtech_user_groups');
      if (localG) {
        try { setUserGroups(JSON.parse(localG)); } catch {}
      }
    }

    // Individual Access Persistence
    if (accesses && accesses.length > 0) {
      setIndividualAccessList(accesses);
      localStorage.setItem('softtech_individual_access', JSON.stringify(accesses));
    } else {
      const localA = localStorage.getItem('softtech_individual_access');
      if (localA) {
        try { setIndividualAccessList(JSON.parse(localA)); } catch {}
      }
    }

    // DB Users Merge
    let rawUsers = (lookups && lookups.users && lookups.users.length > 0) ? lookups.users : fallbackUsersList;
    const localUsers = localStorage.getItem('softtech_users');
    if (localUsers) {
      try {
        const parsed = JSON.parse(localUsers);
        if (Array.isArray(parsed)) {
          const existingIds = new Set(rawUsers.map(u => u.id));
          const extraUsers = parsed.filter(u => !existingIds.has(u.id));
          rawUsers = [...extraUsers, ...rawUsers];
        }
      } catch {}
    }
    const dbUsers = rawUsers.map((u, idx) => normalizeUser(u, idx));
    setAllDbUsers(dbUsers);
    setIsLoading(false);
  }, []);

  const handleCreateGroup = async (newGroupData) => {
    const savedGroup = await createUserGroupApi(newGroupData);
    const itemToSave = savedGroup || newGroupData;
    setUserGroups(prev => {
      const updated = [itemToSave, ...prev];
      localStorage.setItem('softtech_user_groups', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteGroup = async (id) => {
    await deleteUserGroupApi(id);
    setUserGroups(prev => {
      const updated = prev.filter(g => g.id !== id);
      localStorage.setItem('softtech_user_groups', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddIndividualAccess = async (newAccessData) => {
    const savedAccess = await createIndividualAccessApi(newAccessData);
    const itemToSave = savedAccess || newAccessData;
    setIndividualAccessList(prev => {
      const updated = [itemToSave, ...prev];
      localStorage.setItem('softtech_individual_access', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteIndividual = async (id) => {
    await deleteIndividualAccessApi(id);
    setIndividualAccessList(prev => {
      const updated = prev.filter(i => i.id !== id);
      localStorage.setItem('softtech_individual_access', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSignUpUser = async (newUserObj) => {
    const savedUser = await createUserApi(newUserObj);
    const userToSave = savedUser || newUserObj;

    setAllDbUsers(prev => {
      const updated = [userToSave, ...prev.filter(u => u.id !== userToSave.id)];
      localStorage.setItem('softtech_users', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    allDbUsers,
    userGroups,
    individualAccessList,
    isLoading,
    loadData,
    handleCreateGroup,
    handleDeleteGroup,
    handleAddIndividualAccess,
    handleDeleteIndividual,
    handleSignUpUser
  };
}
