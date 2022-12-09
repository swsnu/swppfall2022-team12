import { Button } from '@mui/material';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, Navigate } from 'react-router';

import CourseDetail from './DetailPage';

describe('<CourseDetail /', () => {
  const d = {
    data: {
      id: 117,
      author: 'test',
      rate: 5,
      markers: [
        {
          content: '[0] 출발지',
          image: 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png',
          position: {
            lat: '37.40268656668587',
            lng: '127.10325874620656',
          },
          idx: 0,
        },
        {
          content: '[0] name01',
          image: 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png',
          position: {
            lat: '37.40268656668587',
            lng: '127.10325874620656',
          },
          idx: 1,
        },
        {
          content: '[0] 도착지',
          image: 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png',
          position: {
            lat: '37.40268656668587',
            lng: '127.10325874620656',
          },
          idx: 2,
        },
      ],
      path: [
        {
          lat: '37.408363969648015',
          lng: '127.11902659769227',
          idx: 0,
        },
        {
          lat: '37.408363969648015',
          lng: '127.11902659769227',
          idx: 1,
        },
      ],
      p_counts: 3,
      title: 'test title for mid presentation',
      description: 'test description for mid presentation',
      created_at: '2022-11-17T10:38:24.424411Z',
      u_counts: 0,
      e_time: '03:30',
      distance: 2,
      tags: ['a', 'b'],
    },
  };
  it('should render CourseDetail without error', () => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.resolve(d);
    });

    render(<CourseDetail />);
    // screen.getByText("dummy");
    // expect(screen.getAllByText("드라이브").length).toEqual(2);
  });

  it('should handle click Play button', () => {
    jest.clearAllMocks();
    jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.resolve(d);
    });
    render(<CourseDetail />);
    const button = screen.getByText('네이버지도앱에 경로표시');
    fireEvent.click(button!);
    // expect(button).toBeCalled();
  });
});
