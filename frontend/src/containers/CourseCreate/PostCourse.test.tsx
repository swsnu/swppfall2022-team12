import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { CourseState } from '../../store/slices/course';
import { TagState } from '../../store/slices/tag';
import { UserState } from '../../store/slices/user';
import { getMockStore } from '../../test-utils/mocks';
import PostCourse from './PostCourse';
import { MarkerProps, PositionProps } from './SearchCourse';

const courseInitState: CourseState = {
  courses: [
    {
      id: 1,
      author: 'AUTHOR1',
      title: 'TEST_TITLE1',
      description: 'TEST_DESCRIPTION1',
      category: 'DRIVE',
      created_at: '00:00',
      rate: 3,
      u_counts: 5,
      distance: 10,
      e_time: 200,
      path: [],
      markers: [],
      tags: [],
    },
    {
      id: 2,
      author: 'AUTHOR2',
      title: 'TEST_TITLE2',
      description: 'TEST_DESCRIPTION2',
      category: 'DRIVE',
      created_at: '00:00',
      rate: 5,
      u_counts: 10,
      distance: 20,
      e_time: 300,
      path: [],
      markers: [],
      tags: [],
    },
  ],
  recommendedCourses: [],
  selectedCourse: null,
  tMapCourse: { tMapData: null, tMapFeatures: [] },
};

const userInitState: UserState = {
  users: [],
  loggedInUser: null,
  selectedUser: null,
};

const tagInitState: TagState = {
  tags: [],
  selectedTags: [],
};

const mockSelected: MarkerProps[] = [
  {
    position: { lat: 1, lng: 1 },
    content: 'TEST1',
  },
  {
    position: { lat: 2, lng: 2 },
    content: 'TEST2',
  },
];

const mockPath: PositionProps[] = [
  {
    lat: 1,
    lng: 1,
  },
  {
    lat: 2,
    lng: 2,
  },
];

const mockResultData = {
  totalDistance: 1000,
  totalTime: 12000,
  totalFare: 0,
};

const mockStore = getMockStore({
  course: courseInitState,
  user: userInitState,
  tag: tagInitState,
});

const mockNavigate = jest.fn();
jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useLocation: () => {
      return {
        pathname: '/course-create/post',
        search: '',
        hash: '',
        state: { selected: mockSelected, path: mockPath, resultData: mockResultData },
        key: 'default',
      };
    },
    useNavigate: () => mockNavigate,
  };
});

describe('<PostCourse />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without error', () => {
    const { container } = render(
      <BrowserRouter>
        <Provider store={mockStore}>
          <PostCourse />,
        </Provider>
      </BrowserRouter>,
    );
    expect(container).toBeTruthy();
  });

  it('should submit created Course', async () => {
    render(
      <BrowserRouter>
        <Provider store={mockStore}>
          <PostCourse />,
        </Provider>
      </BrowserRouter>,
    );
    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByText('경로 완성');

    fireEvent.change(titleInput, { target: { value: 'TEST_TITLE' } });
    fireEvent.change(descriptionInput, { target: { value: 'TEST_DESCRIPTION_MORE_THAN_10' } });
    fireEvent.click(submitButton!);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/courses'));
  });

  it('should fail submit created Course', async () => {
    jest.spyOn(axios, 'post').mockRejectedValue(new Error('error'));
    window.alert = jest.fn();
    // jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(
      <BrowserRouter>
        <Provider store={mockStore}>
          <PostCourse />,
        </Provider>
      </BrowserRouter>,
    );
    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByText('경로 완성');

    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.change(descriptionInput, { target: { value: '' } });
    fireEvent.click(submitButton!);
  });
});
