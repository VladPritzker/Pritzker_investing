import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import Registration_page from  './components/login_registration_page/registrationPage'

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/login" element={<Registration_page />} />
      </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
