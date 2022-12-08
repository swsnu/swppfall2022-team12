import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../containers/LoginPage/LoginPage';

// import isLogin from '../../utils/isLogin';
import PrivateRoute from './PrivateRoute';

// jest.mock(
//   '../../components/CourseListElement/CourseListElement',
//   () =>
//     function (props: CourseProps) {
//       return (
//         <div data-testid="spyCourseElement">
//           <div>
//             <p>{props.id}</p>
//             <button onClick={props.showDetail}>{props.title}</button>
//             {/* <MuiRating rate={props.grade}/> */}
//             <span>{props.grade}</span>
//           </div>
//           <span> played {props.usageCounts} times</span>
//           <span> expected time: {props.expectedTime}</span>
//         </div>
//       );
//     },
// );
const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

describe('<PrivateRoute />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component when logged in', () => {
    window.sessionStorage.setItem('access', 'test-jwt')

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute element={<div>Test</div>} />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>,
    );
    screen.getByText('Test');
  });

  it('should navigate to /login when logged out', () => {
    window.sessionStorage.clear();
    
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute element={<div>Test</div>} />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>,
    );
    screen.getByText('로그인');
  });
});
