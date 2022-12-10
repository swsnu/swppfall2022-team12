import { render, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

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
    const isLogin = jest.fn();
    isLogin.mockReturnValue(true);

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute element={<div>Test</div>} />} />
        </Routes>
      </BrowserRouter>,
    );
    screen.getByText('Test');
  });

  it('should navigate to /login when logged out', () => {
    const isLogin = jest.fn();
    isLogin.mockReturnValue(false);

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute element={<div>Test</div>} />} />
        </Routes>
      </BrowserRouter>,
    );
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
