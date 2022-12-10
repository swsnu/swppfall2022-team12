import { render, screen } from '@testing-library/react';

import CourseListElement from './CourseListElement';

describe('<CourseListElement />', () => {
  it('should render without errors', () => {
    render(
      <CourseListElement
        id={99}
        author="TEST_AUTHOR"
        title="CLE_TEST_TITLE"
        description="CLE_TEST_DESCRIPTION"
        rate={3}
        createdAt="2022"
        usageCounts={50}
        expectedTime={100}
        distance={300}
        showDetail={() => null}
      />,
    );

    screen.getByText('99');
    const titleButton = screen.getByText('CLE_TEST_TITLE');
    expect(titleButton).toBeInTheDocument();
    screen.getByText('3');
    screen.getByText('played 50 times');
    screen.getByText('expected time: 100');
    screen.getByText('CLE_TEST_DESCRIPTION');
  });
});
