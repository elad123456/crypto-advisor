// useState - remember variables and change them
import React, { useState } from 'react';
// axios - fetching data from the server
import axios from 'axios';
// useNavigate - navigate between the pages , Link - create a string for the navigation
import { useNavigate, Link } from 'react-router-dom';

// Login component
function Login() {
  // state variables for email, password and error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // navigate - function to change the page
  const navigate = useNavigate();

  // function to handle form submission
  const handleSubmit = async (e) => {
    // prevent the refresh 
    e.preventDefault();
    // try to login and get the token and the user name
    try {
      const res = await axios.post('https://crypto-advisor-8bth.onrender.com/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
      // set the user state
    } catch (err) {
      setError('Wrong email or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f0f0f'
    }}>
      <div style={{
        background: '#1a1a1a',
        padding: '40px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #333'
      }}>
        <h1 style={{ marginBottom: '8px', fontSize: '28px' }}>₿ CryptoAdvisor</h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>Welcome back</p>
{/* if there is an error message display it */}
        {error && (
          <p style={{ color: '#ff4444', marginBottom: '16px', background: '#2a1a1a', padding: '10px', borderRadius: '8px' }}>
            {error}
          </p>
        )}
{/* Login form */}
        <form onSubmit={handleSubmit}>
            {/* Email input + real-time update */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* Password input + real-time update */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* handleSubmit on click */}
          <button type="submit" style={{
            width: '100%',
            padding: '14px',
            background: '#f7931a',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '16px',
            borderRadius: '8px'
          }}>
            Login
          </button>
        </form>
{/* Register link */}
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;