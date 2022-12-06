import { getByRole, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import { getMockStore } from '../../test-utils/mocks';
import LoginTab from './LoginTab';

const initialState = {
  course: {
    courses: [],
    selectedCourse: null,
    tMapData: null,
    tMapFeatures: [],
  },
  user: {
    users: [],
    loggedInUser: null,
    selectedUser: null,
  },
};

// const mockStore = getMockStore({ ...initialState });

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('<LoginTab />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    render(<LoginTab />);
    screen.getByText('Username');
    screen.getByText('Password');
    screen.getByText('Login');
  });

  it('should handle empty input when Login button is clicked', () => {
    render(<LoginTab />);
    const nameInput = screen.getByLabelText('Username');
    const pwInput = screen.getByLabelText('Password');
    const loginButton = screen.getByText('Login');

    fireEvent.click(loginButton);
    expect(nameInput).toHaveFocus();

    fireEvent.change(nameInput, { target: { value: 'username-test' } });
    fireEvent.click(loginButton);
    expect(pwInput).toHaveFocus();

    fireEvent.change(pwInput, { target: { value: 'pw-test' } });
    fireEvent.click(loginButton);
    expect(mockNavigate).toHaveBeenCalledWith('/main');
  });
});
