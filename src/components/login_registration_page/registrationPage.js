import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for redirection
import './registrationPage.css';  
import investmentTypes from './investImg.json'; 
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";



function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "none", color: "slategre"}}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "none", color: "slategre" }}
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
  const navigate = useNavigate(); // Create an instance of useNavigate for redirection

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
    if (isLogin) {
      // Handle login
      const loginData = {
        action: 'login',
        email: email,
        password: password
      };

      // Fetch login data
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
      // Handle registration
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

      // Fetch registration data
      try {
        const response = await postUserData(userData);
        if (response.ok) {
          alert('Registration successful. Please login.');
          window.location.reload(); // Reload the page to reset form or redirect as needed
        } else {
          throw new Error('Registration failed.');
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert(error.message);
      }
    }
  };

  // Function to post user data for login or registration
  const postUserData = async (data) => {
    const csrftoken = getCookie('csrftoken'); // Obtain CSRF token from cookies
    return await fetch('http://127.0.0.1:8000/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken // Include CSRF token in the headers
      },
      body: JSON.stringify(data)
    });
  };

  // Function to obtain CSRF token from cookies
  function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
  }

  
  const handleLinkClick = (url, e) => {
    e.preventDefault(); // Prevents default link action
    window.open(url, '_blank');
  };


  return (
    

    
    <div className="login-container">    
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {!isLogin && (
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        )}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {!isLogin && (
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        )}
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        <button style={{marginBottom: '10%'}} type="button" onClick={() => setIsLogin(!isLogin)} className="toggle">
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
        <Slider {...settings} >
          {Object.entries(investmentTypes).map(([key, { src, href }]) => (
            <div key={key}>
              <a href={href} onClick={(e) => handleLinkClick(href, e)} style={{ cursor: 'pointer', textDecoration: 'inherit', color: 'inherit' }}>
                <img src={src} alt={key} />
                <div style={{marginTop: '10px'}} className="legend">{key}</div>
              </a>
            </div>
          ))}
        </Slider>        
      </form>    
      
          </div>
  );
}

export default LoginPage;
