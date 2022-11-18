import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

import { CourseState } from '../../store/slices/course';
import { getMockStore } from '../../test-utils/mocks';
import CourseCreate from './CourseCreate';

const courseInitState: CourseState = {
  courses: [
    {
      id: 1,
      title: 'MOCK_TITLE1',
      description: 'MOCK_DESCRIPTION1',
      created_at: '00:00',
      u_counts: 10,
      distance: 1,
      e_time: '1:00',
      startPos: null,
      passPos: null,
      endPos: null,
    },
    {
      id: 2,
      title: 'MOCK_TITLE2',
      description: 'MOCK_DESCRIPTION2',
      created_at: '00:00',
      u_counts: 20,
      distance: 2,
      e_time: '2:00',
      startPos: null,
      passPos: null,
      endPos: null,
    },
  ],
  selectedCourse: null,
  tMapData: null,
  tMapFeatures: [],
};

const mockStore = getMockStore({
  course: courseInitState,
});

describe('<CourseCreate />', () => {
  it('should render without error', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <CourseCreate />
      </Provider>,
    );
    expect(container).toBeTruthy();
  });
});
