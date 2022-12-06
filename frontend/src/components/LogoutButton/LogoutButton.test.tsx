import { getByRole, fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';

import LogoutButton from './LogoutButton';

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('<LogoutButton />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    // window.location.reload = jest.fn();
  });

  it('should render without errors', () => {
    render(<LogoutButton />);
    screen.getByText('Logout');
  });

  it('should handle onClick withour errors with user in session storage', async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({ response: { status: 204 } }));
    sessionStorage.setItem('access', 'test');
    render(<LogoutButton />);
    const logoutButton = screen.getByText('Logout');

    fireEvent.click(logoutButton);
    await waitFor(() => expect(sessionStorage.getItem('access')).toEqual(null));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledwith('/login'));
  });

  it('should handle onClick withour errors without user in session storage', async () => {
    render(<LogoutButton />);
    const logoutButton = screen.getByText('Logout');

    fireEvent.click(logoutButton);
    await waitFor(expect(mockNavigate).toHaveBeenCalledwith('/login'));
  });

  it('should handle onClick withour errors with axios error', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      throw new Error();
    });

    render(<LogoutButton />);
    const logoutButton = screen.getByText('Logout');

    fireEvent.click(logoutButton);
    await waitFor(() => expect(window.alert).toHaveBeenCalled());
  });
});
