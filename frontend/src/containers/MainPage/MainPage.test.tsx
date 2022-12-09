import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { CourseState } from '../../store/slices/course';

import { getMockStore, renderWithProviders } from '../../test-utils/mocks';
import MainPage from './MainPage';

const courseInitState: CourseState = {
  courses: [
    {
      id: 1,
      author: 'AUTHOR1',
      title: 'COURSE_TITLE1',
      description: 'COURSE_DESCRIPTION1',
      category: 'DRIVE',
      created_at: '23:00',
      rate: 5,
      u_counts: 10,
      distance: 1,
      e_time: 6000,
      path: [],
      markers: [],
      tags: [],
    },
    {
      id: 2,
      author: 'AUTHOR2',
      title: 'COURSE_TITLE2',
      description: 'COURSE_DESCRIPTION2',
      category: 'DRIVE',
      created_at: '23:00',
      rate: 4,
      u_counts: 20,
      distance: 6,
      e_time: 10,
      path: [],
      markers: [],
      tags: [],
    },
  ],
  selectedCourse: null,
  recommendedCourses: [],
  tMapCourse: { tMapData: null, tMapFeatures: [] },
};

const mockStore = getMockStore({
  course: courseInitState,
  user: {
    users: [],
    loggedInUser: null,
    selectedUser: null,
  },
  tag: {
    tags: [],
    selectedTags: [],
  },
});

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('<MainPage />', () => {
  it('should render without errors before login', () => {
    // window.sessionStorage.setItem('username', 'test-user');
    render(<Provider store={mockStore}><MainPage /></Provider>)
    screen.getByText('Main Page');
    screen.getByText('나만의 코스 만들기');
    screen.getByText('로 떠나기');
    screen.getByText('맞춤형 코스 추천을 보고 싶다면 로그인하세요!');
  });

  it("should render without errors after login", () => {
    window.sessionStorage.setItem('username', 'test-user');
    render(<Provider store={mockStore}><MainPage /></Provider>)
    screen.getByText('test-user님을 위한 맞춤 코스')
  })

  it('should navigate to posting page when clicked create-new-course button', () => {
    renderWithProviders(<MainPage />);
    const createNewCourseButton = screen.getByText('');
    fireEvent.click(createNewCourseButton);
    expect(mockNavigate).toHaveBeenCalledWith('/course-create/search');
  });
});
