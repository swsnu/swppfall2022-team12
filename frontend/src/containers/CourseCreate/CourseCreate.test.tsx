import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import CourseCreate from './CourseCreate';

describe('<CourseCreate />', () => {
  it('should render without error', () => {
    const { container } = render(<CourseCreate />);
    expect(container).toBeTruthy();
  });
});
