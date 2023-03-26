// import logo from './logo.svg';
import React from "react";
import './App.css';

// Pages
import LandingPage from './Pages/LandingPage.js';
import RegisterPage from './Pages/RegisterPage.js';
import SuccessPage from './Pages/SuccessPage.js';


import { BrowserRouter as Router, Route, Routes  } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage/>} />
        <Route exact path="/register" element={<RegisterPage/>} />
        <Route excat path="/success" element={<SuccessPage/>} />
      </Routes>
    </Router>
  
  );
}

export default App;
