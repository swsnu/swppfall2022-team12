import { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import CourseDetail from "./Container/CourseDetail/CourseDetail";
import CourseList from "./Container/CourseList/CourseList";
import MainPage from "./Container/MainPage/MainPage";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/courses" element={<CourseList />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/" element={<MainPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
