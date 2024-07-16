import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login_registration_page/registrationPage.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import img1 from '../login_registration_page/img/slider/istockphoto-1297492947-612x612.jpg';
import img2 from '../login_registration_page/img/slider/istockphoto-1311598658-612x612.jpg';
import img3 from '../login_registration_page/img/slider/istockphoto-1473508651-170667a.webp';
import img4 from '../login_registration_page/img/slider/istockphoto-1490675795-170667a.webp';

const apiUrl = process.env.REACT_APP_API_URL;

const inputStyle = {
  width: '50%',
  marginLeft: '10px',
  padding: '12px',
  marginTop: '8px',
  marginBottom: '16px',
  border: 'none',
  borderBottom: '2px solid #0056b3',
  boxSizing: 'border-box',
  display: 'inline-block'
};

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "none", color: "slategrey"}}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "none", color: "slategrey" }}
      onClick={onClick}
    />
  );
}

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    prevArrow: <SamplePrevArrow />
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(`API URL: ${apiUrl}`); // Add logging here

    if (isLogin) {
      const loginData = {
        action: 'login',
        email: email,
        password: password
      };

      try {
        const response = await postUserData(loginData);
        if (response.ok) {
          const result = await response.json();
          console.log('Login successful:', result);
          navigate(`/account/${result.id}`, { state: { user: result } });
        } else {
          throw new Error('Login failed.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert(error.message);
      }
    } else {
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      const userData = {
        action: 'register',
        username: username,
        email: email,
        password: password
      };

      try {
        const response = await postUserData(userData);
        if (response.ok) {
          alert('Registration successful. Please login.');
          window.location.reload();
        } else {
          throw new Error('Registration failed.');
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert(error.message);
      }
    }
  };

  const postUserData = async (data) => {
    const csrftoken = getCookie('csrftoken');
    const response = await fetch(`${apiUrl}/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(data),
    });
    return response;
  };

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleLinkClick = (url, e) => {
    e.preventDefault();
    window.open(url, '_blank');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form login">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {!isLogin && (
          <input style={inputStyle} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
        )}
        <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <input style={inputStyle} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        {!isLogin && (
          <input style={inputStyle} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
        )}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        <button style={{ marginBottom: '10%' }} type="button" onClick={() => setIsLogin(!isLogin)} className="toggle">
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
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
