<<<<<<< HEAD
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

function App() {
  return (
    <div>Drive Course Live</div>
=======
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';
import CourseDetail from './containers/CourseDetail/CourseDetail';
import CourseList from './containers/CourseList/CourseList';
import MainPage from './containers/MainPage/MainPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/courses" element={<CourseList />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/" element={<MainPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
>>>>>>> 0b0c7de544ac758bb712f53c9e1ff35a5366e9d2
  );
}

export default App;

