const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/prices', authenticateToken, async (req, res) => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

router.get('/news', authenticateToken, (req, res) => {
  const news = [
    {
      id: 1,
      title: 'Bitcoin surges past $60,000 as institutional demand grows',
      source: 'CryptoNews',
      url: 'https://cryptonews.com',
      published_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Ethereum upgrade brings faster transactions and lower fees',
      source: 'CoinDesk',
      url: 'https://coindesk.com',
      published_at: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Solana ecosystem sees record growth in DeFi activity',
      source: 'The Block',
      url: 'https://theblock.co',
      published_at: new Date().toISOString()
    },
    {
      id: 4,
      title: 'Crypto market cap reaches new highs amid positive sentiment',
      source: 'CoinTelegraph',
      url: 'https://cointelegraph.com',
      published_at: new Date().toISOString()
    }
  ];
  res.json(news);
});

router.get('/meme', authenticateToken, (req, res) => {
  const memes = [
    { id: 1, url: 'https://i.imgflip.com/1bij.jpg', title: 'Buy the dip!' },
    { id: 2, url: 'https://i.imgflip.com/26am.jpg', title: 'To the moon!' },
    { id: 3, url: 'https://i.imgflip.com/1g8my4.jpg', title: 'HODL!' },
  ];
  const randomMeme = memes[Math.floor(Math.random() * memes.length)];
  res.json(randomMeme);
});

module.exports = router;