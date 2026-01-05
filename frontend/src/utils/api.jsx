import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Set up axios interceptor to include token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => axios.post(`${API_BASE_URL}/auth/register`, userData),
  login: (credentials) => axios.post(`${API_BASE_URL}/auth/login`, credentials),
  adminLogin: (credentials) => axios.post(`${API_BASE_URL}/auth/admin/login`, credentials),
  validateToken: () => axios.get(`${API_BASE_URL}/auth/validate`)
};

// Restaurant API
export const restaurantAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/restaurants`),
  getById: (id) => axios.get(`${API_BASE_URL}/restaurants/${id}`),
  create: (data) => axios.post(`${API_BASE_URL}/restaurants`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/restaurants/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/restaurants/${id}`)
};

// Menu API
export const menuAPI = {
  getByRestaurant: (restaurantId) => axios.get(`${API_BASE_URL}/menu/${restaurantId}`),
  create: (data) => axios.post(`${API_BASE_URL}/menu`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/menu/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/menu/${id}`)
};

// Order API
export const orderAPI = {
  getUserOrders: () => axios.get(`${API_BASE_URL}/orders`),
  create: (orderData) => axios.post(`${API_BASE_URL}/orders`, orderData),
  getAllOrders: () => axios.get(`${API_BASE_URL}/orders/all`),
  updateStatus: (id, status) => axios.put(`${API_BASE_URL}/orders/${id}/status`, { status })
};

// User API
export const userAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/users`),
  updateStatus: (id, isActive) => axios.put(`${API_BASE_URL}/users/${id}/status`, { isActive }),
  delete: (id) => axios.delete(`${API_BASE_URL}/users/${id}`)
};