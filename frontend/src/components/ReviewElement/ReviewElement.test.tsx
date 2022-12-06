import { fireEvent, render, screen } from '@testing-library/react';
import axios from 'axios';
import { NavLink, useNavigate, useParams } from 'react-router-dom';

import { renderWithProviders } from '../../test-utils/mocks';
import ReviewElement from './ReviewElement';

describe('<ReviewElement />', () => {
  jest.spyOn(axios, 'put').mockImplementation(() => {
    return Promise.resolve({});
  });

  it('should render without errors', () => {
    renderWithProviders(
      <ReviewElement
        id={3}
        content="test"
        likes={0}
        author="test author"
        rate={5}
        created_at="2022-11-23T02:37:12.007952Z"
      />,
    );
    const likeButton = screen.getByText('like');
    fireEvent.click(likeButton!);
    const editButton = screen.getByText('edit');
    fireEvent.click(editButton!);
    const star = screen.getAllByTestId('star');
    fireEvent.click(star[0]!);

    const editting = screen.getByTestId("editting");
    fireEvent.change(editting, { target: { value: 'TEST' } });
    const editButton2 = screen.getAllByText('edit');
    fireEvent.click(editButton2[1]!);


    const deleteButton = screen.getByText('delete');
    fireEvent.click(deleteButton!);

  });
});

