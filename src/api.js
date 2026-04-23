const API_BASE = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {
  products: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE}/products?${query}`, {
        headers: { ...getAuthHeaders() },
      });
      return handleResponse(response);
    },
    getFeatured: async () => {
      const response = await fetch(`${API_BASE}/products/featured`);
      return handleResponse(response);
    },
    getSale: async () => {
      const response = await fetch(`${API_BASE}/products/sale`);
      return handleResponse(response);
    },
    getById: async (id) => {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        headers: { ...getAuthHeaders() },
      });
      return handleResponse(response);
    },
  },
  categories: {
    getAll: async () => {
      const response = await fetch(`${API_BASE}/categories`);
      return handleResponse(response);
    },
    getById: async (id) => {
      const response = await fetch(`${API_BASE}/categories/${id}`);
      return handleResponse(response);
    },
    getProducts: async (id, params = {}) => {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE}/categories/${id}/products?${query}`);
      return handleResponse(response);
    },
  },
  cart: {
    get: async (sessionId) => {
      const response = await fetch(`${API_BASE}/cart?session_id=${sessionId}`, {
        headers: { ...getAuthHeaders() },
      });
      return handleResponse(response);
    },
    add: async (productId, quantity = 1, sessionId) => {
      const response = await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ product_id: productId, quantity, session_id: sessionId }),
      });
      return handleResponse(response);
    },
    update: async (id, quantity) => {
      const response = await fetch(`${API_BASE}/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ quantity }),
      });
      return handleResponse(response);
    },
    remove: async (id) => {
      const response = await fetch(`${API_BASE}/cart/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() },
      });
      return handleResponse(response);
    },
    clear: async (sessionId) => {
      const response = await fetch(`${API_BASE}/cart`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ session_id: sessionId }),
      });
      return handleResponse(response);
    },
  },
  orders: {
    create: async (orderData) => {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(orderData),
      });
      return handleResponse(response);
    },
    getAll: async (sessionId) => {
      const response = await fetch(`${API_BASE}/orders?session_id=${sessionId}`, {
        headers: { ...getAuthHeaders() },
      });
      return handleResponse(response);
    },
    getById: async (id, sessionId) => {
      const response = await fetch(`${API_BASE}/orders/${id}?session_id=${sessionId}`, {
        headers: { ...getAuthHeaders() },
      });
      return handleResponse(response);
    },
  },
  auth: {
    register: async (userData) => {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
    login: async (credentials) => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    },
    getProfile: async () => {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers: { ...getAuthHeaders() },
      });
      return handleResponse(response);
    },
    updateProfile: async (userData) => {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
  },
  testimonials: {
    getActive: async () => {
      const response = await fetch(`${API_BASE}/testimonials/active`);
      return handleResponse(response);
    },
  },
};

export const getSessionId = () => {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export default api;