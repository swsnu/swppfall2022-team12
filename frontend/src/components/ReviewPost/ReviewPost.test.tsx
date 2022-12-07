import { fireEvent, render, screen } from '@testing-library/react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import { renderWithProviders } from '../../test-utils/mocks';
import ReviewPost from './ReviewPost';

describe('<ReviewPost />', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn() },
    });
  });

  it('should render without errors', () => {
    render(<ReviewPost courseId="3" setChange={jest.fn()} />);
  });
  it('should post the comment when content is not empty', () => {
    render(<ReviewPost courseId="3" setChange={jest.fn()} />);
    const commentInput = screen.getByPlaceholderText('댓글을 입력해주세요');
    const postButton = screen.getByText('post');
    fireEvent.change(commentInput, { target: { value: 'TEST' } });
    fireEvent.click(postButton!);
    // expect(window.location.reload).toHaveBeenCalled();
  });
  it('should not post when comment content is empty', () => {
    render(<ReviewPost courseId="3" setChange={jest.fn()} />);
    const postButton = screen.getByText('post');
    fireEvent.click(postButton!);
    const starButton = screen.getAllByTestId('star');
    fireEvent.click(starButton[0]!);
  });
});
