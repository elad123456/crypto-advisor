import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Onboarding() {
  const [assets, setAssets] = useState([]);
  const [investorType, setInvestorType] = useState('');
  const [contentTypes, setContentTypes] = useState([]);
  const navigate = useNavigate();

  const assetOptions = ['Bitcoin', 'Ethereum', 'Solana', 'BNB', 'XRP'];
  const investorOptions = ['HODLer', 'Day Trader', 'NFT Collector'];
  const contentOptions = ['Market News', 'Charts', 'Social', 'Fun'];

  const toggleItem = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('https://crypto-advisor-8bth.onrender.com/api/preferences', {
        assets: assets.join(', '),
        investor_type: investorType,
        content_types: contentTypes.join(', ')
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
    }
  };

  const buttonStyle = (selected) => ({
    margin: '5px',
    padding: '10px 16px',
    background: selected ? '#f7931a' : '#2a2a2a',
    color: selected ? '#000' : '#fff',
    fontWeight: selected ? 'bold' : 'normal',
    border: '1px solid #333',
    borderRadius: '8px'
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '8px' }}>₿ CryptoAdvisor</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>Tell us about yourself to personalize your dashboard</p>

        <div style={{ background: '#1a1a1a', padding: '24px', borderRadius: '16px', border: '1px solid #333', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '16px', color: '#f7931a' }}>Which crypto assets interest you?</h3>
          {assetOptions.map(asset => (
            <button key={asset} onClick={() => toggleItem(asset, assets, setAssets)} style={buttonStyle(assets.includes(asset))}>
              {asset}
            </button>
          ))}
        </div>

        <div style={{ background: '#1a1a1a', padding: '24px', borderRadius: '16px', border: '1px solid #333', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '16px', color: '#f7931a' }}>What type of investor are you?</h3>
          {investorOptions.map(type => (
            <button key={type} onClick={() => setInvestorType(type)} style={buttonStyle(investorType === type)}>
              {type}
            </button>
          ))}
        </div>

        <div style={{ background: '#1a1a1a', padding: '24px', borderRadius: '16px', border: '1px solid #333', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '16px', color: '#f7931a' }}>What content would you like to see?</h3>
          {contentOptions.map(content => (
            <button key={content} onClick={() => toggleItem(content, contentTypes, setContentTypes)} style={buttonStyle(contentTypes.includes(content))}>
              {content}
            </button>
          ))}
        </div>

        <button onClick={handleSubmit} style={{
          width: '100%',
          padding: '16px',
          background: '#f7931a',
          color: '#000',
          fontWeight: 'bold',
          fontSize: '16px',
          borderRadius: '8px'
        }}>
          Save & Go to Dashboard →
        </button>
      </div>
    </div>
  );
}

export default Onboarding;