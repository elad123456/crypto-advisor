// react file - Displays 4 sections based on user preferences 
// useState - remember variables and change them, useEffect - run code when needed
import React, { useState, useEffect } from 'react';
// Library for fetching data from the server
import axios from 'axios';
// Skipping between pages
import { useNavigate } from 'react-router-dom';

// the server address for getting data
const API = 'https://crypto-advisor-8bth.onrender.com';

// function that return what is going to be displayed on the dashboard
function Dashboard() {
// memory for the relevant objects
  const [prices, setPrices] = useState([]);
  const [meme, setMeme] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [insight, setInsight] = useState('');
  const navigate = useNavigate();
  // Get the token and user information from local storage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // checking if there is a token
  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // function to fetch data from the server
  const fetchData = async () => {
    try {
      // Set the headers for the API requests
      const headers = { Authorization: `Bearer ${token}` };
      // 3 API calls performed in parallel
      const [pricesRes, memeRes, prefsRes] = await Promise.all([
        axios.get(`${API}/api/dashboard/prices`, { headers }),
        axios.get(`${API}/api/dashboard/meme`, { headers }),
        axios.get(`${API}/api/preferences`, { headers })
      ]);
      // set the state with the fetched data
      setPrices(Array.isArray(pricesRes.data) ? pricesRes.data.slice(0, 6) : []);
      setMeme(memeRes.data);
      setPreferences(prefsRes.data);
      setInsight(`Based on your interest in ${prefsRes.data.assets || 'crypto'}, the market looks promising today. Stay informed and invest wisely!`);
    } catch (err) {
      console.log(err);
    }
  };
  // handle voting for a specific item
  const handleVote = async (section, itemId, vote) => {
    try {
      await axios.post(`${API}/api/votes`, { section, item_id: itemId, vote }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.log(err);
    }
  };
  // remove user data and token from local storage
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  // CSS styles for the dashboard components
  const cardStyle = {
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '20px'
  };

    // CSS styles for the dashboard components
  const voteButtonStyle = {
    background: '#2a2a2a',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '6px',
    marginRight: '8px',
    border: '1px solid #333'
  };

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* activate the function on click */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '24px' }}>₿ CryptoAdvisor</h1>
          <button onClick={handleLogout} style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #333' }}>
            Logout
          </button>
        </div>

{/* User name, preferences and interests */}
        <p style={{ color: '#666', marginBottom: '32px' }}>
          Welcome back, <span style={{ color: '#f7931a' }}>{user.name}</span>!
          {preferences && ` | ${preferences.investor_type} | Interests: ${preferences.assets}`}
        </p>

{/* Coin prices section */}
        <h2 style={{ marginBottom: '16px', color: '#f7931a' }}>Coin Prices</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '32px' }}>
          {prices.map(coin => (
            <div key={coin.id} style={{ ...cardStyle, width: '150px' }}>
              <img src={coin.image} alt={coin.name} style={{ width: '32px', marginBottom: '8px' }} />
              <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{coin.name}</p>
              <p style={{ fontSize: '18px', marginBottom: '4px' }}>${coin.current_price.toLocaleString()}</p>
              <p style={{ color: coin.price_change_percentage_24h > 0 ? '#00ff88' : '#ff4444', marginBottom: '12px' }}>
                {coin.price_change_percentage_24h.toFixed(2)}%
              </p>
              <div>
                {/* Voting buttons for coin prices */}
                <button onClick={() => handleVote('prices', coin.id, 1)} style={voteButtonStyle}>👍</button>
                <button onClick={() => handleVote('prices', coin.id, -1)} style={voteButtonStyle}>👎</button>
              </div>
            </div>
          ))}
        </div>
{/* AI insight section */}
        <h2 style={{ marginBottom: '16px', color: '#f7931a' }}>AI Insight of the Day</h2>
        <div style={{ ...cardStyle, marginBottom: '32px' }}>
          <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>{insight}</p>
          <button onClick={() => handleVote('insight', 'daily', 1)} style={voteButtonStyle}>👍</button>
          <button onClick={() => handleVote('insight', 'daily', -1)} style={voteButtonStyle}>👎</button>
        </div>

{/* Fun Crypto Meme section */}
        <h2 style={{ marginBottom: '16px', color: '#f7931a' }}>Fun Crypto Meme</h2>
        {meme && (
          <div style={{ ...cardStyle, marginBottom: '32px' }}>
            <p style={{ marginBottom: '12px', fontWeight: 'bold' }}>{meme.title}</p>
            <img src={meme.url} alt={meme.title} style={{ maxWidth: '300px', borderRadius: '8px', marginBottom: '16px' }} />
            <br />
            <button onClick={() => handleVote('meme', String(meme.id), 1)} style={voteButtonStyle}>👍</button>
            <button onClick={() => handleVote('meme', String(meme.id), -1)} style={voteButtonStyle}>👎</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;