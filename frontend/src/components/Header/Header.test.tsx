import { fireEvent, screen, waitFor } from '@testing-library/react';

import { renderWithProviders } from '../../test-utils/mocks';
import Header from './Header';

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Navigate: (props: any) => {
    mockNavigate(props.to);
    return null;
  },
  useNavigate: () => mockNavigate,
}));

describe('<Header />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    renderWithProviders(<Header />);
    screen.getByText('Course Adviser');
    const driveButton = screen.getByText('드라이브');
    const bikeButton = screen.getByText('바이크');
    const cycleButton = screen.getByText('자전거');
    const runButton = screen.getByText('런닝');
    const logoutButton = screen.getByText('Logout');

    expect(driveButton).toBeInTheDocument();
    expect(bikeButton).toBeInTheDocument();
    expect(cycleButton).toBeInTheDocument();
    expect(runButton).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });

  it('should handle onClickCategory when button is clicked', async () => {
    renderWithProviders(<Header />);
    localStorage.clear();

    const driveButton = screen.getByText('드라이브');
    fireEvent.click(driveButton);
    await waitFor(() => expect(localStorage.getItem('CATEGORY_KEY')).toEqual('drive'));
    await waitFor(() => expect(localStorage.getItem('SEARCH_KEY')).toEqual(null));
    await waitFor(() => expect(localStorage.getItem('FILTER')).toEqual(null));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/courses'));

    const bikeButton = screen.getByText('바이크');
    fireEvent.click(bikeButton);
    await waitFor(() => expect(localStorage.getItem('CATEGORY_KEY')).toEqual('bike'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/courses'));

    const cycleButton = screen.getByText('자전거');
    fireEvent.click(cycleButton);
    await waitFor(() => expect(localStorage.getItem('CATEGORY_KEY')).toEqual('cycle'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/courses'));

    const runButton = screen.getByText('런닝');
    fireEvent.click(runButton);
    await waitFor(() => expect(localStorage.getItem('CATEGORY_KEY')).toEqual('run'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/courses'));
  });
});
