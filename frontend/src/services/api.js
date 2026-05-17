import axios from 'axios';

// ─── Base instance ─────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Token helpers ─────────────────────────────────────────────────────────
export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const setTokens = ({ access, refresh }) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const isAuthenticated = () => Boolean(getAccessToken());

// ─── Request interceptor — attach Bearer token ─────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor — silent token refresh on 401 ───────────────────
const AUTH_PATHS = ['/auth/login/', '/auth/register/', '/auth/token/refresh/'];

const isAuthEndpoint = (config) =>
  AUTH_PATHS.some((path) => config?.url?.includes(path));

let _isRefreshing = false;
let _queue = [];

const processQueue = (error, token = null) => {
  _queue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token),
  );
  _queue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status !== 401 ||
      original._retried ||
      isAuthEndpoint(original)
    ) {
      return Promise.reject(error);
    }

    if (_isRefreshing) {
      return new Promise((resolve, reject) => _queue.push({ resolve, reject }))
        .then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
    }

    original._retried = true;
    _isRefreshing = true;

    try {
      const refresh = getRefreshToken();
      if (!refresh) throw new Error('No refresh token');

      const { data } = await axios.post(
        `${api.defaults.baseURL}/auth/token/refresh/`,
        { refresh },
      );

      setTokens({ access: data.access, refresh: data.refresh ?? refresh });
      processQueue(null, data.access);
      original.headers.Authorization = `Bearer ${data.access}`;
      return api(original);
    } catch (err) {
      processQueue(err, null);
      clearTokens();
      window.location.href = '/login';
      return Promise.reject(err);
    } finally {
      _isRefreshing = false;
    }
  },
);

// ─── Error parser ──────────────────────────────────────────────────────────
export const parseErrors = (error) => {
  const data = error.response?.data;
  if (!data || typeof data !== 'object') {
    return { non_field_errors: 'Network error. Please try again.' };
  }
  const flat = {};
  Object.entries(data).forEach(([key, value]) => {
    flat[key] = Array.isArray(value) ? value[0] : String(value);
  });
  return flat;
};

// ═══════════════════════════════════════════════════════════════════════════
// AUTH  →  /api/auth/
// ═══════════════════════════════════════════════════════════════════════════
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (data) => api.post('/auth/register/', data),
  logout: (refresh) => api.post('/auth/logout/', { refresh }),
  refreshToken: (refresh) => api.post('/auth/token/refresh/', { refresh }),
  getUser: () => api.get('/auth/user/'),
  forgotPassword: (email) => api.post('/auth/forgot-password/', { email }),
  resetPassword: (data) => api.post('/auth/reset-password/', data),
  confirmEmail: (token) => api.post('/auth/confirm-email/', { token }),
};

// ═══════════════════════════════════════════════════════════════════════════
// SHOP  →  /api/  (existing — unchanged)
// ═══════════════════════════════════════════════════════════════════════════

export const getProducts = (params = {}) =>
  api.get('/products/', { params });

export const getProductDetails = (slug) =>
  api.get(`/products/${slug}/`);

export const getRelatedProducts = (slug) =>
  api.get(`/products/${slug}/related/`);

export const getCategories = () =>
  api.get('/categories/');

export const getBrands = (search = '') =>
  api.get('/brands/', { params: search ? { search } : {} });

export const getColors = () =>
  api.get('/colors/');

// ═══════════════════════════════════════════════════════════════════════════
// ELASTICSEARCH SEARCH  →  /api/search/
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Full-text Elasticsearch product search with faceted filters.
 *
 * @param {Object} params
 * @param {string}  params.q           - Full-text query
 * @param {string}  params.category    - Category slug filter
 * @param {string}  params.brand       - Brand slug filter
 * @param {number}  params.min_price   - Minimum price
 * @param {number}  params.max_price   - Maximum price
 * @param {boolean} params.is_new      - New arrivals filter
 * @param {boolean} params.is_sale     - On-sale filter
 * @param {boolean} params.in_stock    - In-stock filter
 * @param {string}  params.sort        - Sort order (relevance|price-asc|price-desc|rating|newest|popular)
 * @param {number}  params.page        - Page number (1-based)
 * @param {number}  params.page_size   - Results per page
 *
 * @returns {Promise<{
 *   count: number,
 *   page: number,
 *   pages: number,
 *   page_size: number,
 *   results: Array,
 *   aggregations: {
 *     categories: Array,
 *     brands: Array,
 *     price_stats: Object,
 *     price_ranges: Array,
 *     new_count: number,
 *     sale_count: number,
 *   },
 *   fallback?: boolean,
 * }>}
 */
export const searchProducts = (params = {}) =>
  api.get('/search/', { params });

/**
 * Lightweight autocomplete suggestions.
 *
 * @param {string} q - Partial search query (min 2 chars)
 * @returns {Promise<{ suggestions: Array<{id, name, slug, thumbnail, price, category}> }>}
 */
export const autocompleteProducts = (q) =>
  api.get('/search/autocomplete/', { params: { q } });

// ═══════════════════════════════════════════════════════════════════════════
// CART
// ═══════════════════════════════════════════════════════════════════════════

export const getCart = () => api.get('/cart/');
export const addToCart = (productId, quantity = 1) =>
  api.post('/cart/', { product_id: productId, quantity });
export const updateCartItem = (itemId, quantity) =>
  api.patch(`/cart/item/${itemId}/`, { quantity });
export const removeCartItem = (itemId) => api.delete(`/cart/item/${itemId}/`);
export const clearCart = () => api.delete('/cart/clear/');

export const cartAPI = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};

// ═══════════════════════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════════════════════

export const createOrder = (payload) => api.post('/orders/', payload);
export const getOrders = () => api.get('/orders/');
export const getOrderDetail = (orderId) => api.get(`/orders/${orderId}/`);
export const cancelOrder = (orderId) =>
  api.patch(`/orders/${orderId}/`, { status: 'cancelled' });

// ═══════════════════════════════════════════════════════════════════════════
// USER DASHBOARD  →  /api/dashboard/
// ═══════════════════════════════════════════════════════════════════════════
export const dashboardAPI = {
  getProfile: () => api.get('/dashboard/profile/'),
  updateProfile: (data) => api.patch('/dashboard/profile/', data),
  uploadAvatar: (formData) =>
    api.post('/dashboard/profile/upload-avatar/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  changePassword: (data) => api.post('/dashboard/change-password/', data),
  getNotifications: () => api.get('/dashboard/notifications/'),
  updateNotifications: (data) => api.patch('/dashboard/notifications/', data),
  getSummary: () => api.get('/dashboard/summary/'),
  getOrders: (params = {}) => api.get('/dashboard/orders/', { params }),
  getOrder: (id) => api.get(`/dashboard/orders/${id}/`),
  getWishlist: () => api.get('/dashboard/wishlist/'),
  addToWishlist: (productId) =>
    api.post('/dashboard/wishlist/', { product_id: productId }),
  removeFromWishlist: (id) => api.delete(`/dashboard/wishlist/${id}/`),
  getAddresses: () => api.get('/dashboard/addresses/'),
  createAddress: (data) => api.post('/dashboard/addresses/', data),
  updateAddress: (id, data) => api.patch(`/dashboard/addresses/${id}/`, data),
  deleteAddress: (id) => api.delete(`/dashboard/addresses/${id}/`),
  getReviews: (params = {}) => api.get('/dashboard/reviews/', { params }),
  updateReview: (id, data) => api.patch(`/dashboard/reviews/${id}/`, data),
  deleteReview: (id) => api.delete(`/dashboard/reviews/${id}/`),
};

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD  →  /api/dashboard/admin/
// ═══════════════════════════════════════════════════════════════════════════
export const adminAPI = {
  getOverview: (period = '30d') =>
    api.get('/dashboard/admin/overview/', { params: { period } }),
  getRevenueStats: (months = 12) =>
    api.get('/dashboard/admin/revenue-stats/', { params: { months } }),
  getUserStats: () => api.get('/dashboard/admin/user-stats/'),
  getProductStats: () => api.get('/dashboard/admin/product-stats/'),

  getUsers: (params = {}) => api.get('/dashboard/admin/users/', { params }),
  getUser: (id) => api.get(`/dashboard/admin/users/${id}/`),
  updateUser: (id, data) => api.patch(`/dashboard/admin/users/${id}/`, data),

  getProducts: (params = {}) =>
    api.get('/dashboard/admin/products/', { params }),
  getProduct: (id) => api.get(`/dashboard/admin/products/${id}/`),
  createProduct: (formData) =>
    api.post('/dashboard/admin/products/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateProduct: (id, formData) =>
    api.patch(`/dashboard/admin/products/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteProduct: (id) => api.delete(`/dashboard/admin/products/${id}/`),

  getCategories: (params = {}) =>
    api.get('/dashboard/admin/categories/', { params }),
  createCategory: (formData) =>
    api.post('/dashboard/admin/categories/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateCategory: (id, formData) =>
    api.patch(`/dashboard/admin/categories/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteCategory: (id) => api.delete(`/dashboard/admin/categories/${id}/`),

  getBrands: (params = {}) => api.get('/dashboard/admin/brands/', { params }),
  createBrand: (formData) =>
    api.post('/dashboard/admin/brands/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateBrand: (id, formData) =>
    api.patch(`/dashboard/admin/brands/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteBrand: (id) => api.delete(`/dashboard/admin/brands/${id}/`),

  getOrders: (params = {}) => api.get('/dashboard/admin/orders/', { params }),
  getOrder: (id) => api.get(`/dashboard/admin/orders/${id}/`),
  updateOrderStatus: (id, status) =>
    api.patch(`/dashboard/admin/orders/${id}/`, { status }),

  getReviews: (params = {}) =>
    api.get('/dashboard/admin/reviews/', { params }),
  deleteReview: (id) => api.delete(`/dashboard/admin/reviews/${id}/`),

  getMessages: (params = {}) =>
    api.get('/dashboard/admin/messages/', { params }),
  deleteMessage: (id) => api.delete(`/dashboard/admin/messages/${id}/`),
};

export default api;
