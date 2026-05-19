// src/__tests__/api.test.js
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// We import the real module — not mocked — in this file.
import api, {
  setTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  isAuthenticated,
  parseErrors,
} from '../api';

/*
  Install: npm install -D axios-mock-adapter
*/

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
  localStorage.clear();
});

// ─── Token helpers ─────────────────────────────────────────────────────────

describe('setTokens / getAccessToken / getRefreshToken', () => {
  it('stores access and refresh tokens in localStorage', () => {
    setTokens({ access: 'acc123', refresh: 'ref456' });
    expect(localStorage.getItem('access_token')).toBe('acc123');
    expect(localStorage.getItem('refresh_token')).toBe('ref456');
  });

  it('getAccessToken returns null when nothing is stored', () => {
    expect(getAccessToken()).toBeNull();
  });

  it('getAccessToken returns the stored token', () => {
    setTokens({ access: 'mytoken', refresh: 'r' });
    expect(getAccessToken()).toBe('mytoken');
  });

  it('getRefreshToken returns the stored refresh token', () => {
    setTokens({ access: 'a', refresh: 'myrefresh' });
    expect(getRefreshToken()).toBe('myrefresh');
  });
});

describe('clearTokens', () => {
  it('removes both tokens from localStorage', () => {
    setTokens({ access: 'a', refresh: 'r' });
    clearTokens();
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
  });
});

describe('isAuthenticated', () => {
  it('returns false when no access token exists', () => {
    expect(isAuthenticated()).toBe(false);
  });

  it('returns true when an access token is present', () => {
    setTokens({ access: 'token', refresh: 'r' });
    expect(isAuthenticated()).toBe(true);
  });

  it('returns false after clearTokens()', () => {
    setTokens({ access: 'token', refresh: 'r' });
    clearTokens();
    expect(isAuthenticated()).toBe(false);
  });
});

// ─── parseErrors ──────────────────────────────────────────────────────────

describe('parseErrors', () => {
  it('flattens array field errors', () => {
    const err = { response: { data: { email: ['This field is required.'] } } };
    expect(parseErrors(err)).toEqual({ email: 'This field is required.' });
  });

  it('keeps string field errors as-is', () => {
    const err = { response: { data: { email: 'Already exists.' } } };
    expect(parseErrors(err)).toEqual({ email: 'Already exists.' });
  });

  it('handles multiple field errors simultaneously', () => {
    const err = {
      response: {
        data: {
          email:    ['Already exists.'],
          password: ['Too short.'],
        },
      },
    };
    const result = parseErrors(err);
    expect(result.email).toBe('Already exists.');
    expect(result.password).toBe('Too short.');
  });

  it('handles SimpleJWT detail string (login 401)', () => {
    const err = {
      response: { data: { detail: 'No active account found with the given credentials' } },
    };
    expect(parseErrors(err).detail).toBe(
      'No active account found with the given credentials',
    );
  });

  it('returns network error message when response is absent', () => {
    const err = {};
    expect(parseErrors(err)).toEqual({ non_field_errors: 'Network error. Please try again.' });
  });

  it('returns network error message when response.data is a string (HTML 500)', () => {
    const err = { response: { data: '<html>Server Error</html>' } };
    expect(parseErrors(err)).toEqual({ non_field_errors: 'Network error. Please try again.' });
  });

  it('returns network error message when response.data is null', () => {
    const err = { response: { data: null } };
    expect(parseErrors(err)).toEqual({ non_field_errors: 'Network error. Please try again.' });
  });
});

// ─── Request interceptor — Authorization header ────────────────────────────

describe('request interceptor', () => {
  it('does NOT add Authorization header when no token is in storage', async () => {
    mock.onGet('/test/').reply(200, {});
    const res = await api.get('/test/');
    expect(res.config.headers.Authorization).toBeUndefined();
  });

  it('adds Bearer Authorization header when a token is stored', async () => {
    setTokens({ access: 'live-token', refresh: 'r' });
    mock.onGet('/test/').reply(200, {});
    const res = await api.get('/test/');
    expect(res.config.headers.Authorization).toBe('Bearer live-token');
  });
});

// ─── Response interceptor — auth endpoint guard ───────────────────────────

describe('response interceptor — auth endpoint guard', () => {
  it('does NOT attempt token refresh when /auth/login/ returns 401', async () => {
    // If the guard were absent, the interceptor would call /auth/token/refresh/
    // and then redirect. We verify the error is propagated as-is.
    mock.onPost('/auth/login/').reply(401, {
      detail: 'No active account found with the given credentials',
    });

    await expect(api.post('/auth/login/', {})).rejects.toMatchObject({
      response: { status: 401 },
    });

    // token/refresh should NOT have been called
    expect(mock.history.post.some((r) => r.url?.includes('token/refresh'))).toBe(false);
  });

  it('does NOT attempt token refresh when /auth/register/ returns 400', async () => {
    mock.onPost('/auth/register/').reply(400, { email: ['Already exists.'] });
    await expect(api.post('/auth/register/', {})).rejects.toMatchObject({
      response: { status: 400 },
    });
    expect(mock.history.post.some((r) => r.url?.includes('token/refresh'))).toBe(false);
  });

  it('propagates non-401 errors from protected endpoints without refresh', async () => {
    mock.onGet('/profile/').reply(500, { detail: 'Server error' });
    await expect(api.get('/profile/')).rejects.toMatchObject({
      response: { status: 500 },
    });
  });
});
