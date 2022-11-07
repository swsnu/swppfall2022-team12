import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CourseDetail from "./contatiners/CourseDetail";
import SearchPage from './components/SearchPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<h1>Not Found</h1>} />
          <Route path="map" element={<TMap />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="detail" element={<CourseDetail courseID={1} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
