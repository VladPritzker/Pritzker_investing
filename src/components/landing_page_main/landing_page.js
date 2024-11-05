// LandingPage.js
import React from 'react';
import '../landing_page_main/landing_page.css';
import { Link } from 'react-router-dom';

// Import images
import img1 from '../landing_page_main/images/bg_1.jpg';
import img2 from '../landing_page_main/images/bg_2.jpg';
import img3 from '../landing_page_main/images/bg_3.jpg';
import img4 from '../landing_page_main/images/bg_4.jpg';
import img5 from '../landing_page_main/images/bg_5.jpg';
import img6 from '../landing_page_main/images/gallery-1.jpg';
import img7 from '../landing_page_main/images/gallery-3.jpg';

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
              {/* <h3><li className="main-links"><a className="nav-link active" href="#home">Home</a></li></h3> */}
              <h3><li className="main-links"><a className="nav-link" href="#about">About</a></li></h3>
              <h3><li className="main-links"><a className="nav-link" href="#services">Services</a></li></h3>
              <h3><li className="main-links"><a className="nav-link" href="#contact">Contact</a></li></h3>
              <h3><li className="main-links"><Link to="/login" className="btn-login">Login</Link></li></h3>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-slider unique-hero">
      <div
              className="hero-item unique-hero-item"
              style={{
                background: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4)), url(${img1})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)", // Reduced transparency
        }}>
     <div className="header-title" style={{marginTop: "280px"}}>
            <h1 className="hero-title">Empowering Your Financial Journey Through Technology</h1>
            <p className="hero-subtitle">Trusted by millions across the world</p>
            <Link to="/login" className="btn btn-white unique-btn">Get Started</Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="ftco-section about-section unique-about-section" style={{ backgroundColor: 'white' }}>
        <div className="container-xl">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2>About Pritzker Finance</h2>
              <p>
              My name is Vlad Pritzker, and I am the founder of Pritzker Finance. Originally from Vinnytsia, Ukraine, I currently serve as an Application Developer at BHI Bank. I hold a Bachelor's degree in Computer Science and have been immersed in the technology industry since 2017. My previous experience includes working at Capital Dynamics, where I specialized in designing, developing, and hosting applications tailored to meet the needs of businesses across various industries.
              </p>
            </div>
            <div className="col-lg-6">
              <img src={img2} alt="About Us" className="img-fluid rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="ftco-section services-section unique-services-section" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-7 text-center">
              <h2>Our Services</h2>
              <p>We provide a range of services to help your business grow.</p>
            </div>
          </div>
          <div className="row">
            {/* Service 1 */}
            <div className="col-md-4 text-center">
              <div className="service-item unique-service-item">
                <img src={img7} alt="Development" className="service-image" />
                <h3>Application Development</h3>
                <p>Front-end and back-end development for all types of businesses.</p>
              </div>
            </div>
            {/* Service 2 */}
            <div className="col-md-4 text-center">
              <div className="service-item unique-service-item">
                <img src={img3} alt="Hosting" className="service-image" />
                <h3>Hosting Solutions</h3>
                <p>Reliable and secure hosting services for your applications.</p>
              </div>
            </div>
            {/* Service 3 */}
            <div className="col-md-4 text-center">
              <div className="service-item unique-service-item">
                <img src={img4} style={{position: "center"}} alt="Design" className="service-image" />
                <h3>Design Services</h3>
                <p>Creative and user-friendly designs for your applications.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="ftco-section contact-section" style={{ backgroundColor: 'white' }}>
        <div className="container-xl">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2>Contact Us</h2>
              <p>We'd love to hear from you! Whether you have a question about our services or want to discuss your project, our team is ready to help.</p>
              <p><strong>Phone:</strong> (347) 430-8497</p>
              <p><strong>Email:</strong> pritzkervlad@gmail.com</p>
            </div>
            <div className="col-lg-6">
              <img src={img6} alt="Contact Us" className="img-fluid rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ftco-footer">
        <div className="container-xl text-center">
          <p>&copy; {new Date().getFullYear()} Pritzker Finance. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
