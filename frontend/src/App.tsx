import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import SearchPage from './components/SearchPage';
import TMap from './components/TMap';
<<<<<<< HEAD:src/App.tsx
// import CourseDetail from './containers/CourseDetail/CourseDetail';
=======
>>>>>>> 3e90560c03a69d291231162561df990f2e9e680f:frontend/src/App.tsx
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
          <Route path="map" element={<TMap />} />
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
