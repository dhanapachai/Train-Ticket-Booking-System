import axios from 'axios';

// ── Axios instance ─────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT token automatically ────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: auto-logout on 401 ──────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Auth endpoints ─────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
};

// ── Train endpoints ────────────────────────────────────────────────────────
export const trainAPI = {
  search:       (params)    => api.get('/trains/search', { params }),
  availability: (id)        => api.get(`/trains/${id}/availability`),
  getAll:       ()          => api.get('/admin/trains'),
  add:          (data)      => api.post('/admin/trains', data),
  update:       (id, data)  => api.put(`/admin/trains/${id}`, data),
  delete:       (id)        => api.delete(`/admin/trains/${id}`),
};

// ── Booking endpoints ──────────────────────────────────────────────────────
export const bookingAPI = {
  book:   (data) => api.post('/bookings', data),
  myList: ()     => api.get('/bookings/my'),
  cancel: (id)   => api.delete(`/bookings/${id}`),
  all:    ()     => api.get('/admin/bookings'),
  stats:  ()     => api.get('/admin/bookings/stats'),
};
