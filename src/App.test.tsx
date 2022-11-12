import { render, screen } from '@testing-library/react';
import React from 'react';

import App from './App';
import { store } from './store';
import { Provider } from 'react-redux';
import { getMockStore } from './test-utils/mocks';

const testState = {
  course: {
    courses: [
      {
        id: 1,
        title: "COURSE_TEST_TITLE1",
        description: "COURSE_TEST_DESCRIPTION1",
        created_at: "00:00",
        u_counts: 100,
        distance: 10,
        e_time: "1:30",
        startPos: null,
        passPos: null,
        endPos: null,
      },
      {
        id: 2,
        title: "COURSE_TEST_TITLE2",
        description: "COURSE_TEST_DESCRIPTION2",
        created_at: "00:01",
        u_counts: 200,
        distance: 20,
        e_time: "2:30",
        startPos: null,
        passPos: null,
        endPos: null,
      }
    ],
    selectedCourse: null,
  }
};

const mockStore = getMockStore({ ...testState });

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  Navigate: (props: any) => {
    mockNavigate(props.to);
    return null
  },
  useNavigate: () => mockNavigate,
}));

test('renders learn react link', () => {
  render(<Provider store={mockStore}><App /></Provider>);
  // expect(mockNavigate).toBeCalledWith("/");
  screen.getByText("Main Page");
});
