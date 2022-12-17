import { fireEvent, render, screen } from '@testing-library/react';
import axios from 'axios';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import { renderWithProviders } from '../../test-utils/mocks';
import ReviewPost from './ReviewPost';

describe('<ReviewPost />', () => {
  jest.spyOn(axios, 'post').mockImplementation(() => {
    return Promise.resolve({ status: 403 });
  });

  it('should render without errors', () => {
    render(<ReviewPost courseId="3" setChange={jest.fn()} />);
    const starButtons = screen.getAllByTestId('star');
    fireEvent.click(starButtons[2]);
    const editting = screen.getByPlaceholderText('댓글을 입력해주세요');
    fireEvent.change(editting, { target: { value: 'TEST' } });
  });

  it('should not post if not logged in', () => {
    render(<ReviewPost courseId="3" setChange={jest.fn()} />);
    const postButton = screen.getByTestId('post');
    fireEvent.click(postButton!);
  });

  it('should not post when content is empty', () => {
    window.sessionStorage.setItem('username', 'test author');
    render(<ReviewPost courseId="3" setChange={jest.fn()} />);
    const postButton = screen.getByTestId('post');
    fireEvent.click(postButton!);
  });

  it('should post the comment when content is not empty', () => {
    render(<ReviewPost courseId="3" setChange={jest.fn()} />);
    const commentInput = screen.getByPlaceholderText('댓글을 입력해주세요');
    const postButton = screen.getByTestId('post');
    fireEvent.change(commentInput, { target: { value: 'TEST' } });
    fireEvent.click(postButton!);
    // expect(window.location.reload).toHaveBeenCalled();
  });
});
