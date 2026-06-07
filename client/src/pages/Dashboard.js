import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://crypto-advisor-8bth.onrender.com';

function Dashboard() {
  const [prices, setPrices] = useState([]);
  const [meme, setMeme] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [insight, setInsight] = useState('');
  const [news, setNews] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [pricesRes, memeRes, prefsRes, newsRes] = await Promise.all([
        axios.get(`${API}/api/dashboard/prices`, { headers }),
        axios.get(`${API}/api/dashboard/meme`, { headers }),
        axios.get(`${API}/api/preferences`, { headers }),
        axios.get(`${API}/api/dashboard/news`, { headers })
      ]);
      setPrices(Array.isArray(pricesRes.data) ? pricesRes.data.slice(0, 6) : []);
      setMeme(memeRes.data);
      setPreferences(prefsRes.data);
      setNews(newsRes.data);
      const insightRes = await axios.get(`${API}/api/dashboard/insight?assets=${prefsRes.data.assets || 'Bitcoin'}&investor_type=${prefsRes.data.investor_type || 'investor'}`, { headers });
      setInsight(insightRes.data.insight);
    } catch (err) {
      console.log(err);
    }
  };

  const handleVote = async (section, itemId, vote) => {
    try {
      await axios.post(`${API}/api/votes`, { section, item_id: itemId, vote }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const cardStyle = {
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '20px'
  };

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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '24px' }}>₿ CryptoAdvisor</h1>
          <button onClick={handleLogout} style={{ background: '#2a2a2a', color: '#fff', border: '1px solid #333' }}>
            Logout
          </button>
        </div>

        <p style={{ color: '#666', marginBottom: '32px' }}>
          Welcome back, <span style={{ color: '#f7931a' }}>{user.name}</span>!
          {preferences && ` | ${preferences.investor_type} | Interests: ${preferences.assets}`}
        </p>

        <h2 style={{ marginBottom: '16px', color: '#f7931a' }}>Market News</h2>
        <div style={{ marginBottom: '32px' }}>
          {news.map(item => (
            <div key={item.id} style={{ ...cardStyle, marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.title}</p>
                <p style={{ color: '#666', fontSize: '12px' }}>{item.source}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                <button onClick={() => handleVote('news', String(item.id), 1)} style={voteButtonStyle}>👍</button>
                <button onClick={() => handleVote('news', String(item.id), -1)} style={voteButtonStyle}>👎</button>
              </div>
            </div>
          ))}
        </div>

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
                <button onClick={() => handleVote('prices', coin.id, 1)} style={voteButtonStyle}>👍</button>
                <button onClick={() => handleVote('prices', coin.id, -1)} style={voteButtonStyle}>👎</button>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ marginBottom: '16px', color: '#f7931a' }}>AI Insight of the Day</h2>
        <div style={{ ...cardStyle, marginBottom: '32px' }}>
          <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>{insight}</p>
          <button onClick={() => handleVote('insight', 'daily', 1)} style={voteButtonStyle}>👍</button>
          <button onClick={() => handleVote('insight', 'daily', -1)} style={voteButtonStyle}>👎</button>
        </div>

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