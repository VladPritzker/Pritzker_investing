
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login_registration_page/registrationPage.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';


import img1 from "../login_registration_page/img/slider/istockphoto-1297492947-612x612.jpg";
import img2 from "../login_registration_page/img/slider/istockphoto-1311598658-612x612.jpg";
import img3 from "../login_registration_page/img/slider/istockphoto-1473508651-170667a.webp";
import img4 from "../login_registration_page/img/slider/istockphoto-1490675795-170667a.webp";


const apiUrl = process.env.REACT_APP_API_URL;

const inputStyle = {
  width: "50%",
  marginLeft: "10px",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "16px",
  border: "none",
  borderBottom: "2px solid #0056b3",
  boxSizing: "border-box",
  display: "inline-block",
};

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "none",
        color: "slategrey",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "none",
        color: "slategrey",
      }}
      onClick={onClick}
    />
  );
}

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetMessage, setResetMessage] = useState(""); // Message after password reset request
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    if (isLogin) {
      // Handle Login
      const loginData = {
        email: email,
        password: password,
      };
  
      try {
        const response = await fetch(`${apiUrl}/simple-login/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",            
          },
          body: JSON.stringify(loginData),
        });
  
        if (response.ok) {
          const result = await response.json();
  
          // Store tokens in sessionStorage
          sessionStorage.setItem("authToken", result.access); // Store access token
          sessionStorage.setItem("refreshToken", result.refresh); // Store refresh token     
                   
          // Redirect to the account page with user information
          navigate(`/account/${result.id}`, { state: { user: result } });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Login failed. Invalid credentials.");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert(error.message);
      }
    } else {
      // Handle Registration
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
  
      const registrationData = {
        username: username,
        email: email,
        password: password,
      };
  
      try {
        const response = await fetch(`${apiUrl}/register/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        });
  
        if (response.ok) {
          const result = await response.json();
          console.log("Registration successful:", result);
          alert("Registration successful! You can now log in.");
          // Clear the registration form fields
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          // Switch back to login form
          setIsLogin(true);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Registration failed.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert(error.message);
      }
    }
  };

  
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Check if this cookie string begins with the name we want
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };
  

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email to reset your password.");
      return;
    }
  
    const resetData = {
      email: email,
    };
  
    const csrftoken = getCookie('csrftoken');  // Retrieve CSRF token from cookies
  
    try {
      const response = await fetch(`${apiUrl}/request-password-reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken  // Add the CSRF token to the headers
        },
        body: JSON.stringify(resetData),
        credentials: 'include'  // Include cookies in the request
      });
  
      if (response.ok) {
        setResetMessage("Password reset link sent to your email.");
      } else {
        throw new Error("Password reset failed.");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setResetMessage("An error occurred while requesting the reset link.");
    }
  };
  
  
  return (
    <div className="login-container">
      <form onSubmit={handleFormSubmit} className="login-form login">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {!isLogin && (
          <input
            style={inputStyle}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        )}
        <input
          style={inputStyle}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={isLogin ? "current-password" : "new-password"}
        />

        {!isLogin && (
          <input
            style={inputStyle}
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        )}

        <button type="submit">{isLogin ? "Login" : "Register"}</button>

        <button
          style={{ marginBottom: "10%" }}
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="toggle"
        >
          {isLogin ? "Need an account? Register" : "Have an account? Login"}
        </button>

        {isLogin && (
          <>
            <button
              style={{ marginBottom: "10%" }}
              type="button"
              onClick={handleForgotPassword}
              className="forgot-password"
            >
              Forgot Password?
            </button>
            {resetMessage && <p className="reset-message">{resetMessage}</p>}
            <Link to="/" className="about-btn" style={{ textDecoration: "none", color: "white" }}>
            <button style={{ marginBottom: "3%"}} className="about-btn">
                  About
            </button>
            </Link>
          </>
        )}

        <Slider {...settings}>
          {[img1, img2, img3, img4].map((src, index) => (
            <div key={index}>
              <img src={src} alt={`slider-img-${index}`} />
            </div>
          ))}
          
        </Slider>
      </form>
    </div>
  );
}

export default LoginPage;
