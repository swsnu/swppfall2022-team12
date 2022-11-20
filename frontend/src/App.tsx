import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import CourseCreate from './containers/CourseCreate/CourseCreate';
import CourseList from './containers/CourseList/CourseList';
import MainPage from './containers/MainPage/MainPage';
import CourseDetail from './containers/CourseDetail/DetailPage';
import Login from './containers/LoginPage/LoginPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="search" element={<CourseCreate />} />
          {/* <Route path="/register/" element={<Register />} /> */}
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
