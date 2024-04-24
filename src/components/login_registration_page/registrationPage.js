import React, { useState } from 'react';
import './registrationPage.css';  

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');  
  const [confirmPassword, setConfirmPassword] = useState('');  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLogin) {
      // Login logic here (can be implemented later)
      console.log('Login with:', email, password);
    } else {
      // Before sending, check if passwords match
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      // Setup the data object for registration
      const userData = {
        username: username,
        email: email,
        password: password
      };

      // Obtain CSRF token from cookies
      const csrftoken = getCookie('csrftoken');

      // Use fetch API to post the data to your Django backend
      try {
        const response = await fetch('http://127.0.0.1:8000/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken  // Include CSRF token in the headers
          },
          body: JSON.stringify(userData)
        });

        if (!response.ok) {
          throw new Error('Failed to register user.');
        }

        const result = await response.json();
        console.log('Registration successful:', result);
        // You can redirect the user to login page or dashboard here
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. ' + error.message);
      }
    }
  };

  // Function to obtain CSRF token from cookies
  function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
  }

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
        <button type="button" onClick={() => setIsLogin(!isLogin)} className="toggle">
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
