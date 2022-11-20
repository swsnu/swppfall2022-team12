import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { CourseState } from '../../store/slices/course';
import { getMockStore } from '../../test-utils/mocks';
import SearchCourse from './SearchCourse';

const courseInitState: CourseState = {
  courses: [
    {
      id: 1,
      title: 'TEST_TITLE1',
      description: 'TEST_DESCRIPTION1',
      created_at: '00:00',
      u_counts: 5,
      distance: 10,
      e_time: '10:00',
      startPos: null,
      passPos: null,
      endPos: null,
    },
    {
      id: 2,
      title: 'TEST_TITLE2',
      description: 'TEST_DESCRIPTION2',
      created_at: '00:00',
      u_counts: 10,
      distance: 20,
      e_time: '20:00',
      startPos: null,
      passPos: null,
      endPos: null,
    },
  ],
  selectedCourse: null,
  tMapCourse: { tMapData: null, tMapFeatures: [] },
};

const mockStore = getMockStore({
  course: courseInitState,
});

describe('<SearchCourse />', () => {
  it('should render without error', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <SearchCourse />
      </Provider>,
    );
    expect(container).toBeTruthy();
  });
});
