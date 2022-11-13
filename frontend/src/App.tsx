import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import KakaoMap from './components/Map/KakaoMap';
import SearchPage from './components/SearchPage';
import CourseList from './containers/CourseList/CourseList';
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
          <Route path="map" element={<KakaoMap />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="/register/" element={<Register />} />
          <Route path="/" element={<MainPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
