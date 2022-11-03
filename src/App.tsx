import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import React from 'react'
import TMap from './components/TMap';
import CourseDetail from "./DetailPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<h1>Not Found</h1>} />
          <Route path="/map/" element={<CourseDetail />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
