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
        <Route exact path="/postersession/" element={<LandingPage/>} />
        <Route exact path="/postersession/register" element={<RegisterPage/>} />
        <Route exact path="/postersession/success" element={<SuccessPage/>} />
        <Route exact path="/postersession/recommendation" element={<RecommendationLetterPage/>} />
      </Routes>
    </Router>

  );
}

export default App;
