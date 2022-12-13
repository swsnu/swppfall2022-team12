import { fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';

import { renderWithProviders } from '../../test-utils/mocks';
import Header from './Header';

const mockNavigate = jest.fn();
// jest.mock('react-router', () => ({
//   ...jest.requireActual('react-router'),
//   Navigate: (props: any) => {
//     mockNavigate(props.to);
//     return null;
//   },
//   useNavigate: () => mockNavigate,
// }));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}));

jest.mock('axios');

describe('<Header />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without errors', () => {
    renderWithProviders(<Header />);
    const driveButton = screen.getByText('드라이브 전체보기');
    const loginButton = screen.getByText('로그인');
    const createCourseButton = screen.getByText('나만의 코스 만들기')

    expect(driveButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
    expect(createCourseButton).toBeInTheDocument();
  });

  it("should handle onClickLogo when logo is clicked", () => {
    renderWithProviders(<Header />);

    const logo = screen.getAllByRole('button')[0];
    fireEvent.click(logo);
    expect(mockNavigate).toBeCalledWith('/main');
  });

  it("should handle onClickLogin when logged out", () => {
    renderWithProviders(<Header />);
    
    const loginButton = screen.getByText('로그인');
    fireEvent.click(loginButton);
    expect(mockNavigate).toBeCalledWith('/login');
  });

  it("should handle onClickLogout when logged in", async () => {
    // axios.get = jest.fn().mockResolvedValue({status : 204});
    jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.resolve({ status: 204 });
    })
    window.sessionStorage.setItem('access', 'test-jwt');
    
    renderWithProviders(<Header />);

    const logoutButton = screen.getByText('로그아웃');
    fireEvent.click(logoutButton);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    await waitFor(() => expect(window.sessionStorage.getItem('access')).toEqual(null));
    await waitFor(() => expect(mockNavigate).toBeCalledWith('/main'))
  });

  it("should handle onClickLogout with 400 response", async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      return Promise.reject({response: { data: { detail: "error-test" } } });
    });
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    window.sessionStorage.setItem('access', 'test-jwt');
    
    renderWithProviders(<Header />);

    const logoutButton = screen.getByText('로그아웃');
    fireEvent.click(logoutButton);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    await waitFor(() => expect(window.alert).toBeCalledWith('error-test'));
  });

  // it("should handle onClickLogout with empty 400 response", async () => {
  //   jest.spyOn(axios, 'get').mockImplementation(() => {
  //     return Promise.reject({response: { data: {} } });
  //   });
  //   jest.spyOn(window, 'alert').mockImplementation(() => {});
  //   window.sessionStorage.setItem('access', 'test-jwt');
    
  //   renderWithProviders(<Header />);

  //   const logoutButton = screen.getByText('로그아웃');
  //   fireEvent.click(logoutButton);
  //   await waitFor(() => expect(axios.get).toHaveBeenCalled());
  //   await waitFor(() => expect(window.alert).toBeCalledWith(''));
  // })

  it("should handle onClickCategory when button is clicked", async () => {
    renderWithProviders(<Header />);
    localStorage.clear();

    const driveButton = screen.getByText('드라이브 전체보기');
    fireEvent.click(driveButton);
    await waitFor(() => expect(localStorage.getItem('CATEGORY_KEY')).toEqual('drive'));
    await waitFor(() => expect(localStorage.getItem('SEARCH_KEY')).toEqual(null));
    await waitFor(() => expect(localStorage.getItem('FILTER')).toEqual(null));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/courses'));
  });

  it("should handle onClickCreateCourse", () => {
    renderWithProviders(<Header />);

    const createCourseButton = screen.getByText('나만의 코스 만들기');
    fireEvent.click(createCourseButton);
    expect(mockNavigate).toBeCalledWith('/course-create/search');
  });
});
