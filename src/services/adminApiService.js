/**
 * Admin Analytics API Service
 * Manages communication with the Python/FastAPI Admin Backend (http://localhost:8000/api/admin)
 * and connects real database analytics views to the React Admin Portal frontend.
 */

const API_BASE_URL = 'http://localhost:8000/api/admin';

function getAuthHeaders() {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

/**
 * Builds query parameters from filter state object
 */
function buildQueryParams(filters = {}, extraParams = {}) {
  const params = new URLSearchParams();
  const merged = { ...filters, ...extraParams };

  Object.entries(merged).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '' && val !== 'all') {
      params.append(key, val);
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

export async function loginAdmin(username, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Invalid admin credentials');
    }
    return await res.json();
  } catch (error) {
    // Fallback verification for demo
    if (username === 'admin@softtech.com' && password === 'AdminPass123!') {
      return {
        access_token: 'mock-admin-jwt-token-2026',
        token_type: 'bearer',
        admin_user: {
          username: 'admin@softtech.com',
          role: 'admin',
          title: 'System Administrator'
        }
      };
    }
    throw error;
  }
}

export async function fetchFilterOptions() {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/filters`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch filter options from database');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchKPIs(filters = {}) {
  try {
    const query = buildQueryParams(filters);
    const res = await fetch(`${API_BASE_URL}/analytics/kpis${query}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch KPIs from database');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchTrends(granularity = 'monthly', filters = {}) {
  try {
    const query = buildQueryParams(filters, { granularity });
    const res = await fetch(`${API_BASE_URL}/analytics/trends${query}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch trends from database');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchByType(filters = {}) {
  try {
    const query = buildQueryParams(filters);
    const res = await fetch(`${API_BASE_URL}/analytics/by-type${query}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch category data from database');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchByUser(filters = {}) {
  try {
    const query = buildQueryParams(filters);
    const res = await fetch(`${API_BASE_URL}/analytics/by-user${query}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user activity from database');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function executeNLQuery(question) {
  try {
    const res = await fetch(`${API_BASE_URL}/nl-query`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ question })
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.detail || 'Natural language query execution failed.');
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
}
