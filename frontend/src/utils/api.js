import axios from 'axios';

const API_BASE_URL = '/api';

// Auth API
export const authAPI = {
  register: (userData) => axios.post(`${API_BASE_URL}/auth/register`, userData),
  login: (credentials) => axios.post(`${API_BASE_URL}/auth/login`, credentials),
  adminLogin: (credentials) => axios.post(`${API_BASE_URL}/auth/admin/login`, credentials)
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