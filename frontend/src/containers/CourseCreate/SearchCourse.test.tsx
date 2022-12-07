/* global kakao */

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { CourseState } from '../../store/slices/course';
import { TagState } from '../../store/slices/tag';
import { UserState } from '../../store/slices/user';
import { getMockStore } from '../../test-utils/mocks';
import SearchCourse from './SearchCourse';

const courseInitState: CourseState = {
  courses: [
    {
      id: 1,
      author: 'AUTHOR1',
      title: 'TEST_TITLE1',
      description: 'TEST_DESCRIPTION1',
      category: 'DRIVE',
      created_at: '00:00',
      rate: 2,
      u_counts: 5,
      distance: 10,
      e_time: 200,
      path: [],
      markers: [],
    },
    {
      id: 2,
      author: 'AUTHOR2',
      title: 'TEST_TITLE2',
      description: 'TEST_DESCRIPTION2',
      category: 'DRIVE',
      created_at: '00:00',
      rate: 4,
      u_counts: 10,
      distance: 20,
      e_time: 300,
      path: [],
      markers: [],
    },
  ],
  recommendedCourses: [],
  selectedCourse: null,
  tMapCourse: {
    tMapData: {
      totalDistance: '10805',
      totalTime: '3180',
      totalFare: '0',
    },
    tMapFeatures: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [14149070.04179341, 4495385.72777567],
        },
        properties: {
          index: '0',
          viaPointId: '',
          viaPointName: 'TEST',
          arriveTime: '20170808110200',
          completeTime: '20170808110200',
          distance: '0',
          deliveryTime: '0',
          waitTime: '0',
          pointType: 'S',
        },
      },
    ],
  },
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

const mockStore = getMockStore({
  course: courseInitState,
  user: userInitState,
  tag: tagInitState,
});

describe('<SearchCourse />', () => {
  it('should render without error', () => {
    const { container } = render(
      <BrowserRouter>
        <Provider store={mockStore}>
          <SearchCourse />
        </Provider>
      </BrowserRouter>,
    );
    expect(container).toBeTruthy();
  });
  it('should run searchPlaces function without error', () => {
    render(
      <BrowserRouter>
        <Provider store={mockStore}>
          <SearchCourse />
        </Provider>
      </BrowserRouter>,
    );
    const keywordInput = screen.getByPlaceholderText('검색어를 입력해주세요');
    const submitButton = screen.getByText('검색');
  });
});
