import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import CourseCreate from './containers/CourseCreate/CourseCreate';
import CourseDetail from './containers/CourseDetail/DetailPage';
import CourseList from './containers/CourseList/CourseList';
import Login from './containers/LoginPage/LoginPage';
import MainPage from './containers/MainPage/MainPage';
import { UserType, selectUser } from './store/slices/user';

function App() {
  const userState = useSelector(selectUser);
  const [loggedInUser, setLoggedInUser] = useState<Pick<UserType, 'email' | 'username'> | null>(
    null,
  );
  useEffect(() => {
    setLoggedInUser(userState.loggedInUser);
  }, [userState]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {loggedInUser ? (
            <>
              <Route path="/main" element={<MainPage />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="search" element={<CourseCreate />} />
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
