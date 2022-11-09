import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SearchPage from './components/SearchPage';
import TMap from './components/TMap';
import CourseDetail from './DetailPage';
import Register from './registerPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<h1>Not Found</h1>} />
          <Route path="map" element={<TMap />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="/course/:id/" element={<CourseDetail />}/>
          <Route path="/register/" element={<Register />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;