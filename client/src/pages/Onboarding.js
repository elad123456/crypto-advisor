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

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h2>Welcome! Tell us about yourself</h2>

      <h3>Which crypto assets interest you?</h3>
      {assetOptions.map(asset => (
        <button
          key={asset}
          onClick={() => toggleItem(asset, assets, setAssets)}
          style={{ margin: '5px', padding: '8px', background: assets.includes(asset) ? '#4CAF50' : '#ddd' }}
        >
          {asset}
        </button>
      ))}

      <h3>What type of investor are you?</h3>
      {investorOptions.map(type => (
        <button
          key={type}
          onClick={() => setInvestorType(type)}
          style={{ margin: '5px', padding: '8px', background: investorType === type ? '#4CAF50' : '#ddd' }}
        >
          {type}
        </button>
      ))}

      <h3>What content would you like to see?</h3>
      {contentOptions.map(content => (
        <button
          key={content}
          onClick={() => toggleItem(content, contentTypes, setContentTypes)}
          style={{ margin: '5px', padding: '8px', background: contentTypes.includes(content) ? '#4CAF50' : '#ddd' }}
        >
          {content}
        </button>
      ))}

      <br /><br />
      <button
        onClick={handleSubmit}
        style={{ width: '100%', padding: '10px', background: '#2196F3', color: 'white' }}
      >
        Save & Go to Dashboard
      </button>
    </div>
  );
}

export default Onboarding;