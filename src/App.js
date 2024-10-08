import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Registration_page from "./components/login_registration_page/registrationPage";
import UserAccountPage from "./components/user_account_page/user_account_page";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Registration_page />} />
          <Route path="/account/:userId" element={<UserAccountPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
