// import logo from './logo.svg';
import React from "react";
import './App.css';

// Pages
import LandingPage from './Pages/LandingPage.js';
import RegisterPage from './Pages/RegisterPage.js';
import SuccessPage from './Pages/SuccessPage.js';
import RecommendationLetterPage from "./Pages/RecommendationLetterPage";


import { BrowserRouter as Router, Route, Routes  } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LandingPage/>} />
        <Route exact path="/register" element={<RegisterPage/>} />
        <Route exact path="/success" element={<SuccessPage/>} />
        <Route exact path="/recommendation" element={<RecommendationLetterPage/>} />
      </Routes>
    </Router>

  );
}

export default App;
