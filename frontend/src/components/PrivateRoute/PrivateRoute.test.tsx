import { render, screen } from '@testing-library/react';
import React from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import LoginPage from '../../containers/LoginPage/LoginPage';
import PrivateRoute from './PrivateRoute';

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('<PrivateRoute />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component when logged in', () => {
    window.sessionStorage.setItem('access', 'test-jwt');

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute element={<div>Test</div>} />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>,
    );
    screen.getByText('Test');
  });

  it('should navigate to /login when logged out', () => {
    window.sessionStorage.clear();

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute element={<div>Test</div>} />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>,
    );
    screen.getByText('로그인');
  });
});
