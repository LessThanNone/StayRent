import axiosInstance from './axiosInstance';

// Auth Services
export const authService = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  getMe: () => axiosInstance.get('/auth/me'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
};

// Property Services
export const propertyService = {
  getProperties: (params) => axiosInstance.get('/properties', { params }),
  getPropertyById: (id) => axiosInstance.get(`/properties/${id}`),
  createProperty: (formData) =>
    axiosInstance.post('/properties', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateProperty: (id, formData) =>
    axiosInstance.put(`/properties/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteProperty: (id) => axiosInstance.delete(`/properties/${id}`),
  getOwnerProperties: () => axiosInstance.get('/properties/owner/my-listings'),
};

// Booking Services
export const bookingService = {
  createBooking: (data) => axiosInstance.post('/bookings', data),
  getMyBookings: () => axiosInstance.get('/bookings/my-bookings'),
  getOwnerBookings: () => axiosInstance.get('/bookings/owner-bookings'),
  updateBookingStatus: (id, status) =>
    axiosInstance.put(`/bookings/${id}/status`, { status }),
};

// Review Services
export const reviewService = {
  createReview: (propertyId, data) =>
    axiosInstance.post(`/reviews/${propertyId}`, data),
  getPropertyReviews: (propertyId) =>
    axiosInstance.get(`/reviews/${propertyId}`),
};

// Wishlist Services  (now at /api/wishlist per spec)
export const wishlistService = {
  getWishlist: () => axiosInstance.get('/wishlist'),
  toggleWishlist: (propertyId) =>
    axiosInstance.post('/wishlist/toggle', { propertyId }),
};

// Admin Services
export const adminService = {
  getStats: () => axiosInstance.get('/admin/stats'),
  getUsers: () => axiosInstance.get('/admin/users'),
  updateUserRole: (id, role) =>
    axiosInstance.put(`/admin/users/${id}/role`, { role }),
  getProperties: () => axiosInstance.get('/admin/properties'),
  togglePropertyStatus: (id) =>
    axiosInstance.put(`/admin/properties/${id}/toggle-status`),
  getBookings: () => axiosInstance.get('/admin/bookings'),
  // Owner approval
  getOwners: () => axiosInstance.get('/admin/owners'),
  approveOwner: (id) => axiosInstance.patch(`/admin/owners/${id}/approve`),
};

