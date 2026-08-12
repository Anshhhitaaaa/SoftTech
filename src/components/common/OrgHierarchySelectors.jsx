import React from 'react';
import { ChevronDown, Building } from 'lucide-react';
import { officeCategories, offices, departments, designations } from '../../data/mockData';

/**
 * Reusable Cascading Organizational Dropdown Selectors
 */
export default function OrgHierarchySelectors({
  officeCategoryId,
  setOfficeCategoryId,
  officeId,
  setOfficeId,
  departmentId,
  setDepartmentId,
  designationId,
  setDesignationId,
  showLabels = true
}) {
  const filteredOffices = officeCategoryId
    ? offices.filter(o => o.office_category_id === Number(officeCategoryId))
    : offices;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Office Category */}
        <div>
          {showLabels && (
            <label className="block font-semibold text-slate-700 mb-1 text-xs">
              Office Category <span className="text-red-500">*</span>
            </label>
          )}
          <div className="relative">
            <select
              value={officeCategoryId}
              onChange={(e) => {
                setOfficeCategoryId(e.target.value);
                setOfficeId(''); // Reset dependent office selection
              }}
              className="w-full pl-3 pr-8 py-2 bg-slate-50/70 border border-slate-300/80 rounded-xl appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs font-medium text-slate-700"
            >
              <option value="">Select Category...</option>
              {officeCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Office */}
        <div>
          {showLabels && (
            <label className="block font-semibold text-slate-700 mb-1 text-xs">
              Office Location <span className="text-red-500">*</span>
            </label>
          )}
          <div className="relative">
            <select
              value={officeId}
              onChange={(e) => setOfficeId(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-slate-50/70 border border-slate-300/80 rounded-xl appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs font-medium text-slate-700"
            >
              <option value="">Select Office...</option>
              {filteredOffices.map(off => (
                <option key={off.id} value={off.id}>{off.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Department */}
        <div>
          {showLabels && (
            <label className="block font-semibold text-slate-700 mb-1 text-xs">
              Department <span className="text-red-500">*</span>
            </label>
          )}
          <div className="relative">
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-slate-50/70 border border-slate-300/80 rounded-xl appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs font-medium text-slate-700"
            >
              <option value="">Select Department...</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Designation */}
        <div>
          {showLabels && (
            <label className="block font-semibold text-slate-700 mb-1 text-xs">
              Designation <span className="text-red-500">*</span>
            </label>
          )}
          <div className="relative">
            <select
              value={designationId}
              onChange={(e) => setDesignationId(e.target.value)}
              className="w-full pl-3 pr-8 py-2 bg-slate-50/70 border border-slate-300/80 rounded-xl appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs font-medium text-slate-700"
            >
              <option value="">Select Designation...</option>
              {designations.map(desig => (
                <option key={desig.id} value={desig.id}>{desig.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
