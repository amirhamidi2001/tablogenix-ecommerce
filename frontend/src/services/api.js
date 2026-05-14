// src/services/api.js
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

// ─── Shop API calls ────────────────────────────────────────────────────────

/**
 * Fetch paginated, filtered product list.
 *
 * @param {Object} params
 * @param {number}  [params.page=1]
 * @param {number}  [params.page_size=12]
 * @param {string}  [params.search]
 * @param {string}  [params.category]       slug or id
 * @param {string}  [params.brand]          comma-separated slugs
 * @param {string}  [params.color]          comma-separated ids or names
 * @param {number}  [params.min_price]
 * @param {number}  [params.max_price]
 * @param {boolean} [params.is_new]
 * @param {boolean} [params.is_sale]
 * @param {string}  [params.ordering]       e.g. "price", "-price", "-rating"
 */
export const getProducts = (params = {}) =>
  api.get('/products/', { params });

/**
 * Fetch a single product by slug.
 * @param {string} slug
 */
export const getProductDetails = (slug) =>
  api.get(`/products/${slug}/`);

/**
 * Fetch related products for a given product slug (same category).
 * @param {string} slug
 */
export const getRelatedProducts = (slug) =>
  api.get(`/products/${slug}/related/`);

/**
 * Fetch the category tree (top-level with nested children).
 */
export const getCategories = () =>
  api.get('/categories/');

/**
 * Fetch all brands (optionally search by name).
 * @param {string} [search]
 */
export const getBrands = (search = '') =>
  api.get('/brands/', { params: search ? { search } : {} });

/**
 * Fetch all available colors.
 */
export const getColors = () =>
  api.get('/colors/');

// ─── Cart API calls ────────────────────────────────────────────────────────

/**
 * Retrieve the current user's cart.
 * Returns the full Cart object with nested items.
 */
export const getCart = () =>
  api.get('/cart/');

/**
 * Add a product to the cart (or increment quantity if already present).
 * @param {number} productId
 * @param {number} [quantity=1]
 */
export const addToCart = (productId, quantity = 1) =>
  api.post('/cart/', { product_id: productId, quantity });

/**
 * Update the quantity of a specific cart item.
 * @param {number} itemId
 * @param {number} quantity  Must be >= 1
 */
export const updateCartItem = (itemId, quantity) =>
  api.patch(`/cart/item/${itemId}/`, { quantity });

/**
 * Remove a specific item from the cart.
 * @param {number} itemId
 */
export const removeCartItem = (itemId) =>
  api.delete(`/cart/item/${itemId}/`);

/**
 * Remove all items from the cart.
 */
export const clearCart = () =>
  api.delete('/cart/clear/');

export default api;
