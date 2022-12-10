import { fireEvent, render, screen } from '@testing-library/react';

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
    screen.getByLabelText('Password');
    screen.getByLabelText('Check Password');
    screen.getByText('Sign Up');
  });

  it('should handle empty or wrong input when Sign up button is clicked', () => {
    render(<SignUpTab />);
    const nameInput = screen.getByLabelText('Username');
    const pwInput1 = screen.getByLabelText('Password');
    const pwInput2 = screen.getByLabelText('Check Password');
    const signUpButton = screen.getByText('Sign Up');

    fireEvent.click(signUpButton);
    expect(nameInput).toHaveFocus();

    fireEvent.change(nameInput, { target: { value: 'username-test' } });
    fireEvent.click(signUpButton);
    expect(pwInput1).toHaveFocus();

    fireEvent.change(pwInput1, { target: { value: 'pw1-test' } });
    fireEvent.click(signUpButton);
    expect(pwInput2).toHaveFocus();

    fireEvent.change(pwInput2, { target: { value: 'pw2-test' } });
    fireEvent.click(signUpButton);
    expect(pwInput2).toHaveFocus();

    fireEvent.change(pwInput2, { target: { value: 'pw1-test' } });
    fireEvent.click(signUpButton);
    expect(mockNavigate).toHaveBeenCalledWith('/main');
  });
});
