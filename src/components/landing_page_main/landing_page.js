import React, { useEffect } from 'react';
import '../landing_page_main/landing_page.css'
import { Link } from 'react-router-dom';
import { Colors } from 'chart.js';


function LandingPage() {

  return (
    <div className='landingPage'>
      {/* Header Section */}
      <header className="top-wrap">
        <div className="container">
          <div className="row">
              <h1 style={{ color: "black" }}>Email: pritzkervlad@gmail.com</h1>            
          </div>
        </div>
      </header>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg">
      <div className="container-xl">
        <a className="navbar-brand" href="#">Pritzker Finance</a>          
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <h3><li class="main-links"><a className="nav-link active" href="#">Home</a></li></h3>
            <h3><li class="main-links"><a className="nav-link" href="#">About</a></li></h3>
            <h3><li class="main-links"><a className="nav-link" href="#">Services</a></li></h3>
            <h3><li class="main-links"><a className="nav-link" href="#">Contact</a></li></h3>
            <h3><li class="main-links"><a className="nav-link" href="#"><Link to="/login" className="btn-login">Login</Link></a></li></h3>
          
          </ul>
        </div>
      </div>
    </nav>

      {/* Hero Section */}
      <section className="hero-slider unique-hero">
  <div className="hero-item unique-hero-item" style={{ backgroundImage: 'url(images/bg_1.jpg)' }}>
    <div className="container text-center">
      <h1 className="hero-title">We're Here To Help Financially</h1>
      <p className="hero-subtitle">Trusted by millions across the world</p>
      <a href="#" className="btn btn-white unique-btn">Get Started</a>
    </div>
  </div>
</section>

<section className="ftco-section about-section unique-about-section" style={{ backgroundColor: 'white' }}>
  <div className="container-xl">
    <div className="row">
      <div className="col-lg-6">
        <h2>About Union Corporation</h2>
        <p>We have been trusted by over 40 million customers worldwide for our reliable financial consultation services.</p>
      </div>
    </div>
  </div>
</section>

<section className="ftco-section services-section unique-services-section" style={{ backgroundColor: 'white' }}>
  <div className="container">
    <div className="row">
      <div className="col-md-3 text-center">
        <div className="service-item unique-service-item">
          <span className="flaticon-accounting service-icon"></span>
          <h3>Financial Planning</h3>
          <p>Helping you plan your finances effectively.</p>
        </div>
      </div>
      <div className="col-md-3 text-center">
        <div className="service-item unique-service-item">
          <span className="flaticon-financial service-icon"></span>
          <h3>Investments Management</h3>
          <p>Guiding you through smart investment strategies.</p>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Testimonials Section */}
      <section className="ftco-section bg-light" style={{ backgroundColor: 'white' }}>
        <div className="container-xl">
          
          <div className="testimonial">
            {/* <p>"Pritzker Finance helped me secure my financial future. Their consultants are top-notch!"</p> */}
            <h3>Vlad Pritzker, CEO</h3>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ftco-footer">
        <div className="container-xl text-center">
          <p>&copy; {new Date().getFullYear()} PritzkerFinance. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
