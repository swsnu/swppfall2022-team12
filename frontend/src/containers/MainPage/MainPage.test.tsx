import { fireEvent, screen } from '@testing-library/react';

import { renderWithProviders } from '../../test-utils/mocks';
import MainPage from './MainPage';

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('<MainPage />', () => {
  it('should render without errors', () => {
    renderWithProviders(<MainPage />);
    screen.getByText('Main Page');
    screen.getByText('Course Adviser');
    screen.getByText('Search');
    screen.getByText('Create New Course');
  });

  it('should navigate to posting page when clicked create-new-course button', () => {
    renderWithProviders(<MainPage />);
    const createNewCourseButton = screen.getByText('Create New Course');
    fireEvent.click(createNewCourseButton);
    expect(mockNavigate).toHaveBeenCalledWith('/course-create/search');
  });
});
