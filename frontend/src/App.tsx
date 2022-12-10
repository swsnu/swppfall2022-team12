import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import PostCourse from './containers/CourseCreate/PostCourse';
import SearchCourse from './containers/CourseCreate/SearchCourse';
import CourseDetail from './containers/CourseDetail/DetailPage';
import CourseEditPost from './containers/CourseEdit/CourseEditPost';
import CourseEditSearch from './containers/CourseEdit/CourseEditSearch';
import CourseList from './containers/CourseList/CourseList';
import Login from './containers/LoginPage/LoginPage';
import MainPage from './containers/MainPage/MainPage';
import { AppDispatch } from './store';
import { fetchTags } from './store/slices/tag';
import isLogin from './utils/isLogin';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTags());
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={isLogin() ? <Navigate replace to="/main" /> : <Login />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route
            path="/course/edit-search/:id"
            element={<PrivateRoute element={<CourseEditSearch />} />}
          />
          <Route
            path="/course/edit-post/:id"
            element={<PrivateRoute element={<CourseEditPost />} />}
          />

          <Route
            path="/course-create/search"
            element={<PrivateRoute element={<SearchCourse />} />}
          />
          <Route path="/course-create/post" element={<PrivateRoute element={<PostCourse />} />} />
          <Route path="/" element={<Navigate replace to="/main" />} />
          <Route path="*" element={<Navigate replace to="/main" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
