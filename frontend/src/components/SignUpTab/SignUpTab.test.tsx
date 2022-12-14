import { getByRole, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import React from 'react';

import SignUpTab from './SignUpTab';

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('<SignUpTab />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    render(<SignUpTab />);
    screen.getByLabelText('Username');
    screen.getByLabelText('Email');
    screen.getByLabelText('Password');
    screen.getByLabelText('Check Password');
    screen.getByText('회원가입');
    screen.getByText('10s');
    screen.getByText('남자');
  });

  it('should handle empty or wrong input when Sign up button is clicked', async () => {
    render(<SignUpTab />);
    const nameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const pwInput1 = screen.getByLabelText('Password');
    const pwInput2 = screen.getByLabelText('Check Password');
    const signUpButton = screen.getByText('회원가입');

    fireEvent.click(signUpButton);
    expect(nameInput).toHaveFocus();

    fireEvent.change(nameInput, { target: { value: 'username-test' } });
    fireEvent.click(signUpButton);
    expect(emailInput).toHaveFocus();

    fireEvent.change(emailInput, { target: { value: 'email-test' } });
    fireEvent.click(signUpButton);
    expect(pwInput1).toHaveFocus();

    fireEvent.change(pwInput1, { target: { value: 'pw1-test' } });
    fireEvent.click(signUpButton);
    expect(pwInput2).toHaveFocus();

    fireEvent.change(pwInput2, { target: { value: 'pw2-test' } });
    fireEvent.click(signUpButton);
    expect(pwInput2).toHaveFocus();
  });

  it('should handle age and gender input', () => {
    render(<SignUpTab />);
    const ageInput = screen.getByTestId('age-input-testId');
    const genderInput = screen.getByTestId('gender-input-testId');

    userEvent.click(getByRole(ageInput, 'button'));
    fireEvent.click(screen.getByText('60s'));
    expect(screen.getAllByText('60s'));

    userEvent.click(getByRole(genderInput, 'button'));
    fireEvent.click(screen.getByText('여자'));
    expect(screen.getAllByText('여자'));
  });

  it('should handle signup without error with valid inputs', async () => {
    axios.post = jest.fn().mockResolvedValue({
      data: {
        email: 'email-test',
        username: 'username-test',
        token: {
          access: 'jwt-access-test',
          refresh: 'jwt-refresh-test',
        },
      },
    });

    render(<SignUpTab />);
    const nameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const pwInput1 = screen.getByLabelText('Password');
    const pwInput2 = screen.getByLabelText('Check Password');
    const signUpButton = screen.getByText('회원가입');

    fireEvent.change(nameInput, { target: { value: 'username-test' } });
    fireEvent.change(emailInput, { target: { value: 'email-test' } });
    fireEvent.change(pwInput1, { target: { value: 'pw1-test' } });
    fireEvent.change(pwInput2, { target: { value: 'pw1-test' } });
    fireEvent.click(signUpButton);

    await waitFor(() => expect(window.sessionStorage.getItem('username')).toEqual('username-test'));
    await waitFor(() => expect(window.sessionStorage.getItem('access')).toEqual('jwt-access-test'));
    await waitFor(() =>
      expect(window.sessionStorage.getItem('refresh')).toEqual('jwt-refresh-test'),
    );
    await waitFor(() => expect(window.sessionStorage.getItem('tags')).toEqual('[]'));
    await waitFor(() => expect(mockNavigate).toBeCalledWith('/main'));
  });

  it('should handle email error response of signup', async () => {
    axios.post = jest.fn().mockRejectedValue({
      response: {
        data: {
          email: 'email-test-error-message',
        },
      },
    });

    render(<SignUpTab />);
    const nameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const pwInput1 = screen.getByLabelText('Password');
    const pwInput2 = screen.getByLabelText('Check Password');
    const signUpButton = screen.getByText('회원가입');

    fireEvent.change(nameInput, { target: { value: 'username-test' } });
    fireEvent.change(emailInput, { target: { value: 'email-test' } });
    fireEvent.change(pwInput1, { target: { value: 'pw1-test' } });
    fireEvent.change(pwInput2, { target: { value: 'pw1-test' } });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(screen.findByText('Email : email-test-error-message\n'));
    });
  });

  it('should handle username error response of signup', async () => {
    axios.post = jest.fn().mockRejectedValue({
      response: {
        data: {
          username: 'username-test-error-message',
        },
      },
    });

    render(<SignUpTab />);
    const nameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const pwInput1 = screen.getByLabelText('Password');
    const pwInput2 = screen.getByLabelText('Check Password');
    const signUpButton = screen.getByText('회원가입');

    fireEvent.change(nameInput, { target: { value: 'username-test' } });
    fireEvent.change(emailInput, { target: { value: 'email-test' } });
    fireEvent.change(pwInput1, { target: { value: 'pw1-test' } });
    fireEvent.change(pwInput2, { target: { value: 'pw1-test' } });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(screen.findByText('Username : username-test-error-message\n'));
    });
  });

  it('should handle password error response of signup', async () => {
    axios.post = jest.fn().mockRejectedValue({
      response: {
        data: {
          password: 'password-test-error-message', // sensitive
        },
      },
    });

    render(<SignUpTab />);
    const nameInput = screen.getByLabelText('Username');
    const emailInput = screen.getByLabelText('Email');
    const pwInput1 = screen.getByLabelText('Password');
    const pwInput2 = screen.getByLabelText('Check Password');
    const signUpButton = screen.getByText('회원가입');

    fireEvent.change(nameInput, { target: { value: 'username-test' } });
    fireEvent.change(emailInput, { target: { value: 'email-test' } });
    fireEvent.change(pwInput1, { target: { value: 'pw1-test' } });
    fireEvent.change(pwInput2, { target: { value: 'pw1-test' } });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(screen.findByText('Password : password-test-error-message\n'));
    });
  });
});
