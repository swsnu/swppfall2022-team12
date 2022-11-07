<<<<<<< HEAD
import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import CourseDetail from "./contatiners/CourseDetail";
import SearchPage from './components/SearchPage';
import TMap from './components/TMap';
=======
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CourseDetail from './contatiners/CourseDetail';
>>>>>>> 577b162 (set eslint.json)

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<h1>Not Found</h1>} />
<<<<<<< HEAD
          <Route path="map" element={<TMap />} />
          <Route path="search" element={<SearchPage />} />
=======
          <Route path="detail" element={<CourseDetail courseID={1} />} />
>>>>>>> 577b162 (set eslint.json)
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
