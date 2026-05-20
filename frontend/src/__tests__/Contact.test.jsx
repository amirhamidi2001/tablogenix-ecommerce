/**
 * src/pages/__tests__/Contact.test.jsx
 *
 * Test suite for the Contact page component.
 *
 * Covers:
 *  - Static rendering (info cards, map, form fields)
 *  - Controlled inputs / form state
 *  - Successful submission → success banner, form reset, button re-enabled
 *  - 400 validation errors → inline field errors rendered
 *  - Non-field errors → global error banner
 *  - Network / unexpected errors → global error banner
 *  - Loading state → button text + disabled during request
 *  - No duplicate submissions while one is in flight
 *
 * Mocks:
 *  - ../services/api  (default export `api` + named export `parseErrors`)
 *  - react-router-dom Link (passthrough)
 */

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import Contact from '../Contact';

// ─── mock api module ──────────────────────────────────────────────────────────

const mockPost = jest.fn();

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: { post: (...args) => mockPost(...args) },
  parseErrors: jest.fn((err) => {
    const data = err?.response?.data ?? {};
    const flat = {};
    Object.entries(data).forEach(([k, v]) => {
      flat[k] = Array.isArray(v) ? v[0] : String(v);
    });
    return flat;
  }),
}));

// ─── helpers ──────────────────────────────────────────────────────────────────

const renderContact = () =>
  render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>,
  );

const fillForm = async (overrides = {}) => {
  const values = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    subject: 'Return policy',
    message: 'How do I return an item?',
    ...overrides,
  };
  await userEvent.type(screen.getByPlaceholderText(/full name/i), values.name);
  await userEvent.type(screen.getByPlaceholderText(/email address/i), values.email);
  await userEvent.type(screen.getByPlaceholderText(/subject/i), values.subject);
  await userEvent.type(screen.getByPlaceholderText(/write your message/i), values.message);
  return values;
};

const submitForm = () =>
  fireEvent.click(screen.getByRole('button', { name: /send message/i }));

// ─── setup / teardown ─────────────────────────────────────────────────────────

beforeEach(() => {
  mockPost.mockReset();
  jest.clearAllMocks();
});

// ─── static rendering ─────────────────────────────────────────────────────────

describe('Contact page — static rendering', () => {
  it('renders the page heading', () => {
    renderContact();
    expect(screen.getByRole('heading', { name: /contact/i })).toBeInTheDocument();
  });

  it('renders the "Get in Touch" form heading', () => {
    renderContact();
    expect(screen.getByRole('heading', { name: /get in touch/i })).toBeInTheDocument();
  });

  it('renders the name input', () => {
    renderContact();
    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
  });

  it('renders the email input', () => {
    renderContact();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
  });

  it('renders the subject input', () => {
    renderContact();
    expect(screen.getByPlaceholderText(/subject/i)).toBeInTheDocument();
  });

  it('renders the message textarea', () => {
    renderContact();
    expect(screen.getByPlaceholderText(/write your message/i)).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    renderContact();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('renders three info cards', () => {
    renderContact();
    expect(screen.getByText(/our address/i)).toBeInTheDocument();
    expect(screen.getByText(/email address/i)).toBeInTheDocument();
    expect(screen.getByText(/hours of operation/i)).toBeInTheDocument();
  });

  it('renders the Google Maps iframe', () => {
    renderContact();
    expect(screen.getByTitle(/google map/i)).toBeInTheDocument();
  });

  it('does not show success banner on initial render', () => {
    renderContact();
    expect(screen.queryByText(/message has been sent/i)).not.toBeInTheDocument();
  });

  it('does not show any error banner on initial render', () => {
    renderContact();
    // FieldError components render nothing when message is falsy
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

// ─── form input / controlled state ────────────────────────────────────────────

describe('Contact form — controlled inputs', () => {
  it('updates name field on typing', async () => {
    renderContact();
    const input = screen.getByPlaceholderText(/full name/i);
    await userEvent.type(input, 'Alice');
    expect(input).toHaveValue('Alice');
  });

  it('updates email field on typing', async () => {
    renderContact();
    const input = screen.getByPlaceholderText(/email address/i);
    await userEvent.type(input, 'alice@example.com');
    expect(input).toHaveValue('alice@example.com');
  });

  it('updates subject field on typing', async () => {
    renderContact();
    const input = screen.getByPlaceholderText(/subject/i);
    await userEvent.type(input, 'Hello');
    expect(input).toHaveValue('Hello');
  });

  it('updates message textarea on typing', async () => {
    renderContact();
    const textarea = screen.getByPlaceholderText(/write your message/i);
    await userEvent.type(textarea, 'Test message body');
    expect(textarea).toHaveValue('Test message body');
  });
});

// ─── successful submission ─────────────────────────────────────────────────────

describe('Contact form — successful submission', () => {
  beforeEach(() => {
    mockPost.mockResolvedValueOnce({ data: { message: 'Message sent successfully' } });
  });

  it('calls api.post with correct endpoint', async () => {
    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/contact/', expect.any(Object));
    });
  });

  it('calls api.post with the form values', async () => {
    renderContact();
    const values = await fillForm();
    submitForm();

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/contact/', expect.objectContaining(values));
    });
  });

  it('shows success banner after submission', async () => {
    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => {
      expect(screen.getByText(/message has been sent/i)).toBeInTheDocument();
    });
  });

  it('clears the name field after success', async () => {
    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/full name/i)).toHaveValue('');
    });
  });

  it('clears the email field after success', async () => {
    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/email address/i)).toHaveValue('');
    });
  });

  it('clears the subject field after success', async () => {
    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/subject/i)).toHaveValue('');
    });
  });

  it('clears the message field after success', async () => {
    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/write your message/i)).toHaveValue('');
    });
  });

  it('re-enables the submit button after success', async () => {
    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled();
    });
  });

  it('does not show any field error after success', async () => {
    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => screen.getByText(/message has been sent/i));

    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
  });
});

// ─── loading state ────────────────────────────────────────────────────────────

describe('Contact form — loading / submitting state', () => {
  it('shows "Sending…" while the request is in flight', async () => {
    // Never resolves during this test
    mockPost.mockReturnValueOnce(new Promise(() => {}));

    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sending/i })).toBeInTheDocument();
    });
  });

  it('disables the submit button while submitting', async () => {
    mockPost.mockReturnValueOnce(new Promise(() => {}));

    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
    });
  });

  it('does not call api.post a second time if already submitting', async () => {
    mockPost.mockReturnValue(new Promise(() => {}));

    renderContact();
    await fillForm();
    submitForm();
    submitForm(); // second click while in-flight

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledTimes(1);
    });
  });
});

// ─── field-level validation errors (400) ─────────────────────────────────────

describe('Contact form — field-level errors', () => {
  const makeError = (fields) => ({
    response: { data: fields },
  });

  it('displays name error under the name field', async () => {
    mockPost.mockRejectedValueOnce(makeError({ name: 'Name is required.' }));

    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('Name is required.')).toBeInTheDocument();
    });
  });

  it('displays email error under the email field', async () => {
    mockPost.mockRejectedValueOnce(makeError({ email: 'Enter a valid email address.' }));

    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    });
  });

  it('displays subject error under the subject field', async () => {
    mockPost.mockRejectedValueOnce(makeError({ subject: 'Subject is required.' }));

    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('Subject is required.')).toBeInTheDocument();
    });
  });

  it('displays message error under the message field', async () => {
    mockPost.mockRejectedValueOnce(makeError({ message: 'Message is required.' }));

    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('Message is required.')).toBeInTheDocument();
    });
  });

  it('displays multiple field errors simultaneously', async () => {
    mockPost.mockRejectedValueOnce(
      makeError({
        name: 'Name is required.',
        email: 'Enter a valid email address.',
      }),
    );

    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('Name is required.')).toBeInTheDocument();
      expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    });
  });

  it('applies error border class to the name field when it has an error', async () => {
    mockPost.mockRejectedValueOnce(makeError({ name: 'Name is required.' }));

    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => screen.getByText('Name is required.'));

    const nameInput = screen.getByPlaceholderText(/full name/i);
    expect(nameInput.className).toMatch(/border-red/);
  });

  it('clears a field error when the user starts typing in that field', async () => {
    mockPost.mockRejectedValueOnce(makeError({ name: 'Name is required.' }));

    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => screen.getByText('Name is required.'));

    await userEvent.type(screen.getByPlaceholderText(/full name/i), 'A');
    expect(screen.queryByText('Name is required.')).not.toBeInTheDocument();
  });

  it('does not show success banner when there are errors', async () => {
    mockPost.mockRejectedValueOnce(makeError({ name: 'Name is required.' }));

    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => screen.getByText('Name is required.'));

    expect(screen.queryByText(/message has been sent/i)).not.toBeInTheDocument();
  });

  it('does not persist form data from a previous error submission', async () => {
    // First call fails
    mockPost.mockRejectedValueOnce(makeError({ email: 'Enter a valid email address.' }));
    // Second call succeeds
    mockPost.mockResolvedValueOnce({ data: { message: 'Message sent successfully' } });

    renderContact();
    await fillForm({ email: 'bad' });
    submitForm();

    await waitFor(() => screen.getByText('Enter a valid email address.'));

    // Fix the email and resubmit
    const emailInput = screen.getByPlaceholderText(/email address/i);
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'jane@example.com');
    submitForm();

    await waitFor(() => {
      expect(screen.getByText(/message has been sent/i)).toBeInTheDocument();
    });
  });
});

// ─── non-field / network errors ───────────────────────────────────────────────

describe('Contact form — non-field and network errors', () => {
  it('shows non_field_errors in the global error banner', async () => {
    mockPost.mockRejectedValueOnce({
      response: { data: { non_field_errors: 'Network error. Please try again.' } },
    });

    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => {
      expect(screen.getByText('Network error. Please try again.')).toBeInTheDocument();
    });
  });

  it('shows error banner on unexpected network failure (no response)', async () => {
    // parseErrors returns { non_field_errors: '...' } when data is absent
    mockPost.mockRejectedValueOnce(new Error('Network Error'));

    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => {
      // Banner should be visible — exact text depends on parseErrors mock
      expect(
        screen.queryByText(/network error/i) ||
          screen.queryByText(/please try again/i),
      ).toBeTruthy();
    });
  });

  it('re-enables the submit button after an error', async () => {
    mockPost.mockRejectedValueOnce({
      response: { data: { name: 'Name is required.' } },
    });

    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => screen.getByText('Name is required.'));

    expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled();
  });

  it('clears previous errors on a new submission attempt', async () => {
    // First call fails with name error
    mockPost.mockRejectedValueOnce({
      response: { data: { name: 'Name is required.' } },
    });
    // Second call fails with different error
    mockPost.mockRejectedValueOnce({
      response: { data: { email: 'Enter a valid email address.' } },
    });

    renderContact();
    await fillForm();
    submitForm();

    await waitFor(() => screen.getByText('Name is required.'));

    submitForm();

    await waitFor(() => screen.getByText('Enter a valid email address.'));
    expect(screen.queryByText('Name is required.')).not.toBeInTheDocument();
  });
});

// ─── accessibility ────────────────────────────────────────────────────────────

describe('Contact form — accessibility', () => {
  it('submit button is enabled on initial render', () => {
    renderContact();
    expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled();
  });

  it('email input has type="email"', () => {
    renderContact();
    expect(screen.getByPlaceholderText(/email address/i)).toHaveAttribute(
      'type',
      'email',
    );
  });

  it('name input has autocomplete="name"', () => {
    renderContact();
    expect(screen.getByPlaceholderText(/full name/i)).toHaveAttribute(
      'autocomplete',
      'name',
    );
  });

  it('email input has autocomplete="email"', () => {
    renderContact();
    expect(screen.getByPlaceholderText(/email address/i)).toHaveAttribute(
      'autocomplete',
      'email',
    );
  });
});
