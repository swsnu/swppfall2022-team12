import { fireEvent, render, screen } from '@testing-library/react';
import axios from 'axios';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import { renderWithProviders } from '../../test-utils/mocks';
import ReviewElement from './ReviewElement';

describe('<ReviewElement />', () => {
  jest.spyOn(axios, 'put').mockImplementation(() => {
    return Promise.resolve({});
  });
  jest.spyOn(axios, 'delete').mockImplementation(() => {
    return Promise.resolve({});
  });
  window.alert = jest.fn();

  it('should render without errors', () => {
    renderWithProviders(
      <ReviewElement
        id={3}
        content="test"
        likes={0}
        author="test author"
        rate={5}
        created_at="2022-11-23T02:37:12.007952Z"
        change={0}
        setChange={jest.fn()}
      />,
    );
  });

  it('should not like if not logged in', () => {
    renderWithProviders(
      <ReviewElement
        id={3}
        content="test"
        likes={0}
        author="test author"
        rate={5}
        created_at="2022-11-23T02:37:12.007952Z"
        change={0}
        setChange={jest.fn()}
      />,
    );
    const likeButton = screen.getByTestId('like');
    fireEvent.click(likeButton!);
  });

  it('should not like if he is an author', () => {
    window.sessionStorage.setItem('username', 'test author');
    renderWithProviders(
      <ReviewElement
        id={3}
        content="test"
        likes={0}
        author="test author"
        rate={5}
        created_at="2022-11-23T02:37:12.007952Z"
        change={0}
        setChange={jest.fn()}
      />,
    );
    const likeButton = screen.getByTestId('like');
    fireEvent.click(likeButton!);
  });

  it('should not like if he is an author', () => {
    window.sessionStorage.setItem('username', 'test author 2');
    renderWithProviders(
      <ReviewElement
        id={3}
        content="test"
        likes={0}
        author="test author"
        rate={5}
        created_at="2022-11-23T02:37:12.007952Z"
        change={0}
        setChange={jest.fn()}
      />,
    );
    const likeButton = screen.getByTestId('like');
    fireEvent.click(likeButton!);
  });

  it('should not edit if he is not an author', () => {
    window.sessionStorage.setItem('username', 'test author 2');
    renderWithProviders(
      <ReviewElement
        id={3}
        content="test"
        likes={0}
        author="test author"
        rate={5}
        created_at="2022-11-23T02:37:12.007952Z"
        change={0}
        setChange={jest.fn()}
      />,
    );
    const editButton = screen.getByTestId('edit');
    fireEvent.click(editButton!);
  });

  it('should edit if he is an author', () => {
    window.sessionStorage.setItem('username', 'test author');
    renderWithProviders(
      <ReviewElement
        id={3}
        content="test"
        likes={0}
        author="test author"
        rate={5}
        created_at="2022-11-23T02:37:12.007952Z"
        change={0}
        setChange={jest.fn()}
      />,
    );
    const editButton = screen.getByTestId('edit');
    fireEvent.click(editButton!);
    const starButtons = screen.getAllByTestId('star');
    fireEvent.click(starButtons[2]);
    const editting = screen.getByTestId('editting');
    fireEvent.change(editting, { target: { value: 'TEST' } });
    const confirmButton = screen.getByTestId('confirm');
    fireEvent.click(confirmButton!);
  });

  it('should delete if he is an author', () => {
    window.sessionStorage.setItem('username', 'test author');
    renderWithProviders(
      <ReviewElement
        id={3}
        content="test"
        likes={0}
        author="test author"
        rate={5}
        created_at="2022-11-23T02:37:12.007952Z"
        change={0}
        setChange={jest.fn()}
      />,
    );
    const deleteButton = screen.getByTestId('delete');
    fireEvent.click(deleteButton!);
  });
});
