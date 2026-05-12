import axios from 'axios';

// ─── Base instance ─────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Token helpers ─────────────────────────────────────────────────────────
export const getAccessToken  = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const setTokens = ({ access, refresh }) => {
  localStorage.setItem('access_token',  access);
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
let _queue        = [];

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

    // Skip refresh for non-401s, already-retried requests, and auth endpoints.
    if (
      error.response?.status !== 401 ||
      original._retried              ||
      isAuthEndpoint(original)          // ← THE KEY FIX
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
    _isRefreshing     = true;

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

export default api;
