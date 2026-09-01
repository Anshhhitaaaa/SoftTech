export const officeCategories = [
  { id: 1, name: "Corporate Office" },
  { id: 2, name: "Zonal Office" },
  { id: 3, name: "Regional Office" },
  { id: 4, name: "Branch Office" },
  { id: 5, name: "Site Office" }
];

export const offices = [
  { id: 1, name: "Headquarters - New Delhi", office_category_id: 1 },
  { id: 2, name: "Zone East - Kolkata", office_category_id: 2 },
  { id: 3, name: "Zone West - Mumbai", office_category_id: 2 },
  { id: 4, name: "Zone North - Chandigarh", office_category_id: 2 },
  { id: 5, name: "Zone South - Bengaluru", office_category_id: 2 },
  { id: 6, name: "Regional Hub - Pune", office_category_id: 3 }
];

export const departments = [
  { id: 1, name: "Information Technology" },
  { id: 2, name: "Human Resources" },
  { id: 3, name: "Finance & Accounts" },
  { id: 4, name: "Legal & Compliance" },
  { id: 5, name: "Operations & Supply Chain" },
  { id: 6, name: "Quality Assurance" }
];

export const designations = [
  { id: 1, name: "General Manager" },
  { id: 2, name: "Senior Architect" },
  { id: 3, name: "Project Lead" },
  { id: 4, name: "Senior Specialist" },
  { id: 5, name: "Executive Officer" },
  { id: 6, name: "System Administrator" }
];

export const users = [
  { id: 1, full_name: "Rahul Sharma", department_id: 1, designation_id: 2 },
  { id: 2, full_name: "Priya Patel", department_id: 2, designation_id: 1 },
  { id: 3, full_name: "Amit Verma", department_id: 3, designation_id: 3 },
  { id: 4, full_name: "Sneha Reddy", department_id: 5, designation_id: 4 },
  { id: 5, full_name: "Vikram Malhotra", department_id: 1, designation_id: 6 },
  { id: 6, full_name: "Ananya Roy", department_id: 2, designation_id: 5 },
  { id: 7, full_name: "Rohan Gupta", department_id: 2, designation_id: 4 },
  { id: 8, full_name: "Kavita Singh", department_id: 4, designation_id: 1 },
  { id: 9, full_name: "Manish Joshi", department_id: 6, designation_id: 3 },
  { id: 10, full_name: "Deepika Padukone", department_id: 2, designation_id: 4 },
  { id: 11, full_name: "Suresh Menon", department_id: 3, designation_id: 2 },
  { id: 12, full_name: "Neha Kapoor", department_id: 1, designation_id: 4 }
];

export function getDepartmentName(val) {
  if (!val) return "Information Technology";
  if (typeof val === 'string' && isNaN(Number(val))) return val;
  const numId = Number(val);
  const item = departments.find(d => d.id === numId);
  if (item) return item.name;
  return departments[(Math.abs(numId) - 1) % departments.length]?.name || "Information Technology";
}

export function getDesignationName(val) {
  if (!val) return "Senior Specialist";
  if (typeof val === 'string' && isNaN(Number(val))) return val;
  const numId = Number(val);
  const item = designations.find(d => d.id === numId);
  if (item) return item.name;
  return designations[(Math.abs(numId) - 1) % designations.length]?.name || "Senior Specialist";
}

export function getOfficeCategoryName(id) {
  const item = officeCategories.find(c => c.id === Number(id));
  return item ? item.name : 'Unknown Category';
}

export function getOfficeName(id) {
  const item = offices.find(o => o.id === Number(id));
  return item ? item.name : 'Unknown Office';
}

export function getUser(id) {
  return users.find(u => u.id === Number(id));
}
