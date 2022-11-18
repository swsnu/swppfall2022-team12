import { render, screen } from '@testing-library/react';

import CourseListElement from './CourseListElement';

describe('<CourseListElement />', () => {
  it('should render without errors', () => {
    render(
      <CourseListElement
        id={99}
        title="CLE_TEST_TITLE"
        description="CLE_TEST_DESCRIPTION"
        grade={3}
        usageCounts={50}
        expectedTime="1:30"
        showDetail={() => null}
      />,
    );

    screen.getByText('99');
    const titleButton = screen.getByText('CLE_TEST_TITLE');
    expect(titleButton).toBeInTheDocument();
    screen.getByText('3');
    screen.getByText('played 50 times');
    screen.getByText('expected time: 1:30');
    screen.getByText('CLE_TEST_DESCRIPTION');
  });
});
