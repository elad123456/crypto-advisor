
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
    { id: 1, title: 'Bitcoin surges past $60,000 as institutional demand grows', source: 'CryptoNews', url: 'https://cryptonews.com', published_at: new Date().toISOString() },
    { id: 2, title: 'Ethereum upgrade brings faster transactions and lower fees', source: 'CoinDesk', url: 'https://coindesk.com', published_at: new Date().toISOString() },
    { id: 3, title: 'Solana ecosystem sees record growth in DeFi activity', source: 'The Block', url: 'https://theblock.co', published_at: new Date().toISOString() },
    { id: 4, title: 'Crypto market cap reaches new highs amid positive sentiment', source: 'CoinTelegraph', url: 'https://cointelegraph.com', published_at: new Date().toISOString() }
  ];
  res.json(news);
});

router.get('/insight', authenticateToken, async (req, res) => {
  console.log('API KEY EXISTS:', !!process.env.OPENROUTER_API_KEY);
  const { assets, investor_type } = req.query;

  if (!process.env.OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key missing - returning fallback insight.');
    return res.json({
      insight: `Fallback: Based on your interest in ${assets || 'crypto'}, keep a long-term view and diversify positions.`
    });
  }

  try {
    const payload = {
      model: 'google/gemma-3-1b-it:free',
      messages: [
        {
          role: 'user',
          content: `You are a crypto advisor. Write a short 2-3 sentence insight for a ${investor_type || 'crypto investor'} who is interested in ${assets || 'Bitcoin'}. Be specific and helpful.`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '<no body>');
      console.error(`OpenRouter HTTP ${response.status}: ${text}`);
      throw new Error(`OpenRouter HTTP ${response.status}`);
    }

    const data = await response.json().catch(() => null);
    console.log('OpenRouter response:', JSON.stringify(data || {}));

    const insight =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      data?.output?.[0] ||
      data?.result?.[0]?.content ||
      data?.message ||
      (typeof data === 'string' ? data : null);

    if (!insight) {
      console.warn('No insight extracted from OpenRouter response - returning fallback.');
      return res.json({
        insight: `Fallback: Based on your interest in ${assets || 'crypto'}, keep diversified exposure and review risk management.`
      });
    }

    res.json({ insight: insight.trim() });
  } catch (err) {
    console.error('OpenRouter error:', err);
    res.json({
      insight: `Fallback: Based on your interest in ${assets || 'crypto'}, stay updated and manage risk carefully.`
    });
  }
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