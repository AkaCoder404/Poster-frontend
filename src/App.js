// import logo from './logo.svg';
import React from "react";
import './App.css';

// Pages
import LandingPage from './Pages/Mathematics/LandingPage.js';
import RegisterPage from './Pages/Mathematics/RegisterPage.js';
import SuccessPage from './Pages/Mathematics/SuccessPage.js';
import RecommendationLetterPage from "./Pages/Mathematics/RecommendationLetterPage";


import InformationScienceAndPhysicsLandingPage from './Pages/InformationScienceAndPhysics/LandingPage.js';
import InformationScienceAndPhysicsRegisterPage from './Pages/InformationScienceAndPhysics/RegisterPage.js';
import InformationScienceAndPhysicsSuccessPage from './Pages/InformationScienceAndPhysics/SuccessPage.js';


import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/postersession/" />} />
        <Route exact path="/postersession/" element={<LandingPage/>} />
        <Route exact path="/postersession/register" element={<RegisterPage/>} />
        <Route exact path="/postersession/success" element={<SuccessPage/>} />
        <Route exact path="/postersession/recommendation" element={<RecommendationLetterPage/>} />


        {/* Major in Information Sciences or Physics */}
        <Route exact path="/poster-info-phys" element={<InformationScienceAndPhysicsLandingPage/>} />
        <Route exact path="/poster-info-phys/register" element={<InformationScienceAndPhysicsRegisterPage/>} />
        <Route exact path="/poster-info-phys/success" element={<InformationScienceAndPhysicsSuccessPage/>} />
      </Routes>
    </Router>

  );
}

export default App;
