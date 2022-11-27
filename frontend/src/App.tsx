import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './App.css';
import PostCourse from './containers/CourseCreate/PostCourse';
import SearchCourse from './containers/CourseCreate/SearchCourse';
import CourseDetail from './containers/CourseDetail/DetailPage';
import CourseList from './containers/CourseList/CourseList';
import Login from './containers/LoginPage/LoginPage';
import MainPage from './containers/MainPage/MainPage';
import { AppDispatch } from './store';
import { UserType, selectUser } from './store/slices/user';
import { TagType, selectTag, fetchTags } from './store/slices/tag';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector(selectUser);
// Pick<UserType, 'email' | 'username' | 'tags'>
  const [loggedInUser, setLoggedInUser] = useState<string | null>(
    null,
  );

  useEffect(() => {
    dispatch(fetchTags());
  }, []);

  useEffect(() => {
    setLoggedInUser(window.sessionStorage.getItem("user"));
  }, [window.sessionStorage]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {loggedInUser ? (
            <>
              <Route path="/main" element={<MainPage />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/course-create/search" element={<SearchCourse />} />
              <Route path="/course-create/post" element={<PostCourse />} />
              <Route path="/" element={<Navigate replace to="/main" />} />
              <Route path="*" element={<Navigate replace to="/main" />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate replace to="/login" />} />
              <Route path="*" element={<Navigate replace to="/login" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
