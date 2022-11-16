import { Button } from '@mui/material';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, Navigate } from 'react-router';

import CourseDetail from './DetailPage';

describe('<CourseDetail /', () => {
  it('should render CourseDetail without error', () => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.resolve({
        data: {
          title: 'MOCK Title',
          description: 'MOCK Description',
          e_time: 40,
          u_counts: 15,
          points: [
            {
              pid: 'test01',
              name: 'test01',
              latitude: '37.513272317072',
              longitude: '127.09431687965',
              idx: 0,
            },
            {
              pid: 'test02',
              name: 'test02',
              latitude: '37.413272317072',
              longitude: '127.19431687965',
              idx: 0,
            },
          ],
        },
      });
    });

    render(<CourseDetail />);
    // screen.getByText("dummy");
    // expect(screen.getAllByText("드라이브").length).toEqual(2);
  });

  it('should handle click Play button', () => {
    jest.clearAllMocks();
    jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.resolve({
        data: {
          title: 'MOCK Title',
          description: 'MOCK Description',
          e_time: 40,
          u_counts: 15,
          points: [
            {
              pid: 'test01',
              name: 'test01',
              latitude: '37.513272317072',
              longitude: '127.09431687965',
              idx: 0,
            },
            {
              pid: 'test02',
              name: 'test02',
              latitude: '37.413272317072',
              longitude: '127.19431687965',
              idx: 0,
            },
          ],
        },
      });
    });
    render(<CourseDetail />);
    const button = screen.getByText('go to navigation');
    fireEvent.click(button!);
    expect(button).toBeCalled();
  });
});
