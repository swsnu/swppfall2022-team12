import { getByRole, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { Provider } from 'react-redux';

import { getMockStore } from '../../test-utils/mocks';
import LoginTab from './LoginTab';

const mockResponse = {
  email: 'test@test.com',
  username: 'test-username',
  token: {
    access: 'testjwtaccesstoken',
    refresh: 'testjwtrefreshtoken',
  },
  tags: [],
};

// const mockStore = getMockStore({ ...initialState });

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

jest.mock('axios');

describe('<LoginTab />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    render(<LoginTab />);
    screen.getByText('Email');
    screen.getByText('Password');
    screen.getByText('Login');
  });

  it('should handle empty input when Login button is clicked', async () => {
    render(<LoginTab />);
    const emailInput = screen.getByLabelText('Email');
    const pwInput = screen.getByLabelText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.click(loginButton);
    expect(emailInput).toHaveFocus();

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.click(loginButton);
    expect(pwInput).toHaveFocus();
  });

  it('should handle login with 200 response', async () => {
    axios.put = jest.fn().mockResolvedValue({ data: mockResponse });

    render(<LoginTab />);
    const emailInput = screen.getByLabelText('Email');
    const pwInput = screen.getByLabelText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(pwInput, { target: { value: 'pw-test' } });
    fireEvent.click(loginButton);

    await waitFor(() => expect(axios.put).toBeCalled());
    await waitFor(() => expect(window.sessionStorage.getItem('username')).toEqual('test-username'));
    await waitFor(() =>
      expect(window.sessionStorage.getItem('access')).toEqual('testjwtaccesstoken'),
    );
    await waitFor(() =>
      expect(window.sessionStorage.getItem('refresh')).toEqual('testjwtrefreshtoken'),
    );
    await waitFor(() => expect(window.sessionStorage.getItem('tags')).toEqual('[]'));
  });

  it('should handle login with 400 response', async () => {
    axios.put = jest.fn().mockResolvedValue({ status: 400, data: { detail: 'test-error' } });
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<LoginTab />);
    const emailInput = screen.getByLabelText('Email');
    const pwInput = screen.getByLabelText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(pwInput, { target: { value: 'pw-test' } });
    fireEvent.click(loginButton);

    await waitFor(() => expect(window.alert).toBeCalled());
  });
});
