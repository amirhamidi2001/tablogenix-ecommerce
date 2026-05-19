// src/__tests__/ChangePassword.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import ChangePassword from '../pages/ChangePassword';
import api, { parseErrors } from '../api';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../api', () => ({
  default:     { post: vi.fn() },
  parseErrors: vi.fn(),
}));

const renderPage = () =>
  render(<MemoryRouter><ChangePassword /></MemoryRouter>);

const fillForm = async (user, current = 'OldPass123!', next = 'NewPass456!', conf = 'NewPass456!') => {
  await user.type(screen.getByPlaceholderText('Current password'), current);
  await user.type(screen.getByPlaceholderText('New password'),     next);
  await user.type(screen.getByPlaceholderText('Confirm new password'), conf);
};

describe('ChangePassword', () => {
  it('renders all three password fields', () => {
    renderPage();
    expect(screen.getByPlaceholderText('Current password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument();
  });

  it('shows error when current password is empty', async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole('button', { name: /update password/i }));
    expect(screen.getByText(/current password is required/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('shows error when new password is less than 8 characters', async () => {
    const user = userEvent.setup();
    renderPage();
    await fillForm(user, 'OldPass123!', 'short', 'short');
    await user.click(screen.getByRole('button', { name: /update password/i }));
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('shows mismatch error without API call when new passwords differ', async () => {
    const user = userEvent.setup();
    renderPage();
    await fillForm(user, 'OldPass123!', 'NewPass456!', 'Different789!');
    await user.click(screen.getByRole('button', { name: /update password/i }));
    expect(screen.getByText(/do not match/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('POSTs to /change-password/ with snake_case fields', async () => {
    api.post.mockResolvedValue({ data: { detail: 'Password updated successfully.' } });
    const user = userEvent.setup();
    renderPage();
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith('/change-password/', {
        current_password: 'OldPass123!',
        new_password:     'NewPass456!',
        confirm_password: 'NewPass456!',
      }),
    );
  });

  it('shows success state and navigates to /account after update', async () => {
    api.post.mockResolvedValue({ data: { detail: 'OK' } });
    vi.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderPage();
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() =>
      expect(screen.getByText(/password changed successfully/i)).toBeInTheDocument(),
    );
    vi.advanceTimersByTime(2500);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/account'));
    vi.useRealTimers();
  });

  it('shows backend error for wrong current password under the correct field', async () => {
    api.post.mockRejectedValue({ response: { status: 400 } });
    parseErrors.mockReturnValue({ current_password: 'Current password is incorrect.' });
    const user = userEvent.setup();
    renderPage();
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() =>
      expect(screen.getByText('Current password is incorrect.')).toBeInTheDocument(),
    );
  });

  it('toggles password visibility for each field independently', async () => {
    const user = userEvent.setup();
    renderPage();
    const inputs  = screen.getAllByPlaceholderText(/(current|new|confirm) (password|new password)/i);
    const toggles = screen.getAllByRole('button', { name: /toggle visibility/i });

    expect(inputs[0]).toHaveAttribute('type', 'password');
    await user.click(toggles[0]);
    expect(inputs[0]).toHaveAttribute('type', 'text');
    // Others remain untouched
    expect(inputs[1]).toHaveAttribute('type', 'password');
  });

  it('disables the submit button while API call is in flight', async () => {
    let resolve;
    api.post.mockReturnValue(new Promise((r) => { resolve = r; }));
    const user = userEvent.setup();
    renderPage();
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /update password/i }));

    expect(screen.getByRole('button', { name: /updating/i })).toBeDisabled();
    resolve({ data: {} });
  });
});
