import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import RegistrationPage from "./components/login_registration_page/registrationPage";
import UserAccountPage from "./components/user_account_page/user_account_page";
import LandingPage from './components/landing_page_main/landing_page';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<RegistrationPage />} />
          <Route path="/account/:userId" element={<UserAccountPage />} />
          {/* Route for password reset with token */}
          <Route path="/reset-password/:token" element={<RegistrationPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
