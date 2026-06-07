import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [prices, setPrices] = useState([]);
  const [meme, setMeme] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [insight, setInsight] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [pricesRes, memeRes, prefsRes] = await Promise.all([
        axios.get('https://crypto-advisor-8bth.onrender.com/api/dashboard/prices', { headers }),
        axios.get('https://crypto-advisor-8bth.onrender.com/api/dashboard/meme', { headers }),
        axios.get('https://crypto-advisor-8bth.onrender.com/api/preferences', { headers })
      ]);

      setPrices(pricesRes.data.slice(0, 6));
      setMeme(memeRes.data);
      setPreferences(prefsRes.data);
      setInsight(`Based on your interest in ${prefsRes.data.assets || 'crypto'}, the market looks promising today. Stay informed and invest wisely!`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleVote = async (section, itemId, vote) => {
    try {
      await axios.post('https://crypto-advisor-8bth.onrender.com/api/votes', { section, item_id: itemId, vote }, {
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

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome, {user.name}!</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {preferences && (
        <p style={{ color: 'gray' }}>
          Your interests: {preferences.assets} | Type: {preferences.investor_type}
        </p>
      )}

      <h2>Coin Prices</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {prices.map(coin => (
          <div key={coin.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', width: '140px' }}>
            <img src={coin.image} alt={coin.name} style={{ width: '30px' }} />
            <p><strong>{coin.name}</strong></p>
            <p>${coin.current_price.toLocaleString()}</p>
            <p style={{ color: coin.price_change_percentage_24h > 0 ? 'green' : 'red' }}>
              {coin.price_change_percentage_24h.toFixed(2)}%
            </p>
            <button onClick={() => handleVote('prices', coin.id, 1)}>👍</button>
            <button onClick={() => handleVote('prices', coin.id, -1)}>👎</button>
          </div>
        ))}
      </div>

      <h2>AI Insight of the Day</h2>
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <p>{insight}</p>
        <button onClick={() => handleVote('insight', 'daily', 1)}>👍</button>
        <button onClick={() => handleVote('insight', 'daily', -1)}>👎</button>
      </div>

      <h2>Fun Crypto Meme</h2>
      {meme && (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <p>{meme.title}</p>
          <img src={meme.url} alt={meme.title} style={{ maxWidth: '300px' }} />
          <br />
          <button onClick={() => handleVote('meme', String(meme.id), 1)}>👍</button>
          <button onClick={() => handleVote('meme', String(meme.id), -1)}>👎</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;