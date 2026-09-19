/**
 * YAATHRI API Service Layer
 * Connects the React application to the FastAPI SQLite backend.
 * Handles Bearer token authentication, error formatting, and request lifecycles.
 */

const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('yaathri_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  if (!res.ok) {
    let errorDetail = 'An unexpected server error occurred.';
    try {
      const data = await res.json();
      errorDetail = data.detail || data.message || errorDetail;
    } catch (e) {
      errorDetail = res.statusText || errorDetail;
    }
    const err = new Error(errorDetail);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const api = {
  // Authentication
  auth: {
    async register(data) {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    async login(email, password) {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },
    async logout() {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
      } catch (e) {}
      localStorage.removeItem('yaathri_token');
      localStorage.removeItem('yaathri_user');
    },
    async getMe() {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    async forgotPassword(email) {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return handleResponse(res);
    },
  },

  // Student details
  students: {
    async getMe() {
      const res = await fetch(`${API_BASE}/students/me`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Applications
  applications: {
    async list() {
      const res = await fetch(`${API_BASE}/applications`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    async create(data) {
      const res = await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    async get(id) {
      const res = await fetch(`${API_BASE}/applications/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Digital Passes
  passes: {
    async list() {
      const res = await fetch(`${API_BASE}/passes`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    async get(id) {
      const res = await fetch(`${API_BASE}/passes/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Transit Routes
  routes: {
    async list() {
      const res = await fetch(`${API_BASE}/routes`);
      return handleResponse(res);
    },
    async get(id) {
      const res = await fetch(`${API_BASE}/routes/${id}`);
      return handleResponse(res);
    },
  },

  // QR Verification & Tokens
  qr: {
    async generate(passId) {
      const res = await fetch(`${API_BASE}/qr/generate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ pass_id: passId }),
      });
      return handleResponse(res);
    },
    async verify(passNumberOrQr, terminalCode = 'TERMINAL-KL-RTO-TCR', location = 'Aluva Metro Station Turnstile #4') {
      const res = await fetch(`${API_BASE}/qr/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pass_number_or_qr: passNumberOrQr,
          terminal_code: terminalCode,
          location: location,
        }),
      });
      return handleResponse(res);
    },
  },

  // Travel Tokens
  tokens: {
    async generate(passId, turnstileGate = 'GATE-04-ALUVA') {
      const res = await fetch(`${API_BASE}/travel-token/generate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          pass_id: passId,
          turnstile_gate: turnstileGate,
        }),
      });
      return handleResponse(res);
    },
    async verify(tokenCode, turnstileGate = 'GATE-04-ALUVA') {
      const res = await fetch(`${API_BASE}/travel-token/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token_code: tokenCode,
          turnstile_gate: turnstileGate,
        }),
      });
      return handleResponse(res);
    },
  },

  // Notifications
  notifications: {
    async list() {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    async markRead(id) {
      const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Admin Protected Operations
  admin: {
    async listApplications(statusFilter = null) {
      let url = `${API_BASE}/admin/applications`;
      if (statusFilter) {
        url += `?status_filter=${encodeURIComponent(statusFilter)}`;
      }
      const res = await fetch(url, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    async getApplication(id) {
      const res = await fetch(`${API_BASE}/admin/applications/${id}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    async approveApplication(id, notes = 'Verified by Institution Authority') {
      const res = await fetch(`${API_BASE}/admin/applications/${id}/approve`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: 'APPROVE', reviewer_notes: notes }),
      });
      return handleResponse(res);
    },
    async rejectApplication(id, notes = 'Institutional or distance criteria mismatch') {
      const res = await fetch(`${API_BASE}/admin/applications/${id}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ action: 'REJECT', reviewer_notes: notes }),
      });
      return handleResponse(res);
    },
    async listStudents() {
      const res = await fetch(`${API_BASE}/admin/students`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    async listRoutes() {
      const res = await fetch(`${API_BASE}/admin/routes`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    async createRoute(data) {
      const res = await fetch(`${API_BASE}/admin/routes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    async listVerifications(limit = 50) {
      const res = await fetch(`${API_BASE}/admin/verifications?limit=${limit}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
  },
};

