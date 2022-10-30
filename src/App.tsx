import React, { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import TMap from './components/TMap';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<h1>Not Found</h1>} />
          <Route path="map" element={<TMap />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
