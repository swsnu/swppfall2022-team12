import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import CourseList from './containers/CourseList/CourseList';
import CourseSearch from './containers/CourseSearch/CourseSearch';
import MainPage from './containers/MainPage/MainPage';
import CourseDetail from './DetailPage';
import Register from './registerPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/courses" element={<CourseList />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="search" element={<CourseSearch />} />
          <Route path="/register/" element={<Register />} />
          <Route path="/" element={<MainPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
