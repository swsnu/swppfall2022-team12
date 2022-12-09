import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { renderWithProviders } from '../../test-utils/mocks';
import LoginPage from './LoginPage';

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('<LoginPage />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    render(<LoginPage />);

    screen.getByText('로그인');
    screen.getByText('아직 계정이 없으신가요?');
    screen.getByText('회원가입');
  });

  it('should switch login tab and signup tab', () => {
    render(<LoginPage />);

    const signupTabButton = screen.getByText('회원가입');
    fireEvent.click(signupTabButton);
    screen.getByText('이미 계정이 있으신가요?');

    const loginTabButton = screen.getByText('로그인');
    fireEvent.click(loginTabButton);
    screen.getByText('아직 계정이 없으신가요?');
  });
});
