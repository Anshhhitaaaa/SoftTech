import React, { useState, useEffect } from 'react';
import { Users, User, Search, Plus, RefreshCw } from 'lucide-react';
import HeaderTabNav from './components/HeaderTabNav';
import EmptyState from './components/EmptyState';
import DataTable from './components/DataTable';
import CreateGroupModal from './components/CreateGroupModal';
import AddIndividualAccessModal from './components/AddIndividualAccessModal';
import MasterDetailModal from './components/MasterDetailModal';
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
  deleteIndividualAccessApi
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('user-groups');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [userGroups, setUserGroups] = useState([]);
  const [individualAccessList, setIndividualAccessList] = useState([]);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isIndividualModalOpen, setIsIndividualModalOpen] = useState(false);

  const [masterDetailItem, setMasterDetailItem] = useState(null);
  const [isMasterDetailOpen, setIsMasterDetailOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const groups = await fetchUserGroups();
    const accesses = await fetchIndividualAccesses();

    if (groups !== null && accesses !== null) {
      setUserGroups(groups);
      setIndividualAccessList(accesses);
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

  const handleOpenMasterDetail = (item) => {
    setMasterDetailItem(item);
    setIsMasterDetailOpen(true);
  };

  // Universal Omni-Search across all fields
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

  const isGroupTab = activeTab === 'user-groups';
  const currentItems = isGroupTab ? filteredGroups : filteredIndividual;
  const rawItems = isGroupTab ? userGroups : individualAccessList;

  return (
    <div className="h-screen overflow-hidden bg-slate-50/60 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] antialiased">

      <HeaderTabNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userGroupCount={userGroups.length}
        individualCount={individualAccessList.length}
      />

      <main className="flex-1 min-h-0 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col">

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

              {/* Universal Search Bar across all fields */}
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

              {rawItems.length > 0 && (
                <button
                  onClick={() => isGroupTab ? setIsGroupModalOpen(true) : setIsIndividualModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isGroupTab ? "Create Group" : "Add Individual Access"}</span>
                </button>
              )}

            </div>

          </div>

          <div className="p-4 flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto">
            {rawItems.length === 0 ? (
              <EmptyState
                type={activeTab}
                onCreateClick={() => isGroupTab ? setIsGroupModalOpen(true) : setIsIndividualModalOpen(true)}
              />
            ) : (
              <DataTable
                items={currentItems}
                type={activeTab}
                onViewDetail={handleOpenMasterDetail}
                onDeleteItem={isGroupTab ? handleDeleteGroup : handleDeleteIndividual}
              />
            )}
          </div>

        </div>

      </main>

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

    </div>
  );
}
