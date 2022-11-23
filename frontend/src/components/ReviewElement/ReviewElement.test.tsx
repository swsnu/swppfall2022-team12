import { fireEvent, render, screen } from '@testing-library/react';

import { renderWithProviders } from '../../test-utils/mocks';
import ReviewElement from './ReviewElement';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


describe('<ReviewElement />', ()=>{
    jest.spyOn(axios, 'put').mockImplementation(() => {
        return Promise.resolve({});
    });

    it('should render without errors', () => {
        render(<ReviewElement id={3} content={"test"} likes={0} author={"test author"} rate={5} created_at={"2022-11-23T02:37:12.007952Z"} />);
        const likeButton = screen.getByText('like');
        fireEvent.click(likeButton!);
        const deleteButton = screen.getByText('delete');
        fireEvent.click(deleteButton!);
    });
    

    
});