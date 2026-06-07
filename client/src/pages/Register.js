// useState - remember variables and change them
import React, { useState } from 'react';
// axios - server requires 
import axios from 'axios';
// useNavigate - navigate between the pages, Link - create a string for the navigation
import { useNavigate, Link } from 'react-router-dom';


function Register() {
// state variables for name, email, password and error
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // navigate - function to change the page
  const navigate = useNavigate();

  // the function get an event , if successful move to onboarding, if not set error message
  const handleSubmit = async (e) => {
    // prevent the refresh
    e.preventDefault();
    try {
        // try to register the user and get the token and the user name
      const res = await axios.post('https://crypto-advisor-8bth.onrender.com/api/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      // move to onboarding
      navigate('/onboarding');
    } catch (err) {
      setError('Registration failed. Email may already exist.');
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
        <p style={{ color: '#666', marginBottom: '32px' }}>Create your account</p>

        {error && (
          <p style={{ color: '#ff4444', marginBottom: '16px', background: '#2a1a1a', padding: '10px', borderRadius: '8px' }}>
            {error}
          </p>
        )}
        {/* Form for user registration + real-time validation */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* submit on click */}
          <button type="submit" style={{
            width: '100%',
            padding: '14px',
            background: '#f7931a',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '16px',
            borderRadius: '8px'
          }}>
            Register
          </button>
        </form>

{/* link for login */}
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;