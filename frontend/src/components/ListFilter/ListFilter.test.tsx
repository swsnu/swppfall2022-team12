import { getByRole, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';

import { getMockStore } from '../../test-utils/mocks';
import ListFilter from './ListFilter';

const initialState = {
  course: {
    courses: [],
    selectedCourse: null,
    tMapCourse: {
      tMapData: null,
      tMapFeatures: [],
    },
  },
  user: {
    users: [],
    loggedInUser: null,
    selectedUser: null,
  },
  tag: {
    tags: [],
    selectedTags: [],
  },
};

const mockStore = getMockStore({ ...initialState });

describe('<ListFilter />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    render(
      <Provider store={mockStore}>
        <ListFilter />
      </Provider>,
    );
    screen.getByLabelText('Filter');
    screen.getByText('-');
  });

  it('should handle onChange withour errors', async () => {
    render(
      <Provider store={mockStore}>
        <ListFilter />
      </Provider>,
    );
    const listFilter = screen.getByTestId('list-filter-testId');

    userEvent.click(getByRole(listFilter, 'button'));
    await waitFor(() => fireEvent.click(screen.getByText('인기 순')));
    await waitFor(() => expect(localStorage.getItem('FILTER')).toEqual('use'));

    userEvent.click(getByRole(listFilter, 'button'));
    await waitFor(() => fireEvent.click(screen.getByText('-')));
    await waitFor(() => expect(localStorage.getItem('FILTER')).toEqual(null));
  });
});
