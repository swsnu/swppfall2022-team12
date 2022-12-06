import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import PostCourse from './containers/CourseCreate/PostCourse';
import SearchCourse from './containers/CourseCreate/SearchCourse';
import CourseDetail from './containers/CourseDetail/DetailPage';
import CourseList from './containers/CourseList/CourseList';
import Login from './containers/LoginPage/LoginPage';
import MainPage from './containers/MainPage/MainPage';
import { AppDispatch } from './store';
import { TagType, selectTag, fetchTags } from './store/slices/tag';
import { UserType, selectUser } from './store/slices/user';
import isLogin from './utils/isLogin';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector(selectUser);
  // Pick<UserType, 'email' | 'username' | 'tags'>
  // const [loggedInUser, setLoggedInUser] = useState<string | null>(
  //   null,
  // );

  useEffect(() => {
    dispatch(fetchTags());
  }, []);

  // useEffect(() => {
  //   setLoggedInUser(window.sessionStorage.getItem('access'));
  //   console.log(loggedInUser);
  // }, [window.sessionStorage.getItem('access')]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={isLogin() ? <Navigate replace to="/main" /> : <Login />} />
          <Route path="/main" element={<PrivateRoute element={<MainPage />} />} />
          <Route path="/courses" element={<PrivateRoute element={<CourseList />} />} />
          <Route path="/course/:id" element={<PrivateRoute element={<CourseDetail />} />} />
          <Route
            path="/course-create/search"
            element={<PrivateRoute element={<SearchCourse />} />}
          />
          <Route path="/course-create/post" element={<PrivateRoute element={<PostCourse />} />} />
          <Route
            path="/"
            element={isLogin() ? <Navigate replace to="/main" /> : <Navigate replace to="/login" />}
          />
          <Route
            path="*"
            element={isLogin() ? <Navigate replace to="/main" /> : <Navigate replace to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
