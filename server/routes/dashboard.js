// import express (server tool)
const express = require('express');
// function for security
const authenticateToken = require('../middleware/auth');

// Initialize the router
const router = express.Router();

// get cryptocurrency prices + authenticateToken 
router.get('/prices', authenticateToken, async (req, res) => {
  try {
    // top 10 cryptocurrencies by market cap
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin,ripple,usd-coin&order=market_cap_desc');
    // if the response is not ok, throw an error
    if (!response.ok) {
      throw new Error('Failed to fetch prices');
    }
    // response to JSON
    const data = await response.json();
    // export the data
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

// get cryptocurrency news + authenticateToken
router.get('/news', authenticateToken, (req, res) => {
    // Fetch news articles from a news API
  const news = [
    { id: 1, title: 'Bitcoin surges past $60,000 as institutional demand grows', source: 'CryptoNews', url: 'https://cryptonews.com', published_at: new Date().toISOString() },
    { id: 2, title: 'Ethereum upgrade brings faster transactions and lower fees', source: 'CoinDesk', url: 'https://coindesk.com', published_at: new Date().toISOString() },
    { id: 3, title: 'Solana ecosystem sees record growth in DeFi activity', source: 'The Block', url: 'https://theblock.co', published_at: new Date().toISOString() },
    { id: 4, title: 'Crypto market cap reaches new highs amid positive sentiment', source: 'CoinTelegraph', url: 'https://cointelegraph.com', published_at: new Date().toISOString() }
  ];
  // Respond with the news articles
  res.json(news);
});

// get cryptocurrency market insights + authenticateToken
router.get('/insight', authenticateToken, async (req, res) => {
    // Check if API key exists
  console.log('API KEY EXISTS:', !!process.env.OPENROUTER_API_KEY);
  // save assets and investor_type
  const { assets, investor_type } = req.query;

  // in case API key is missing
  if (!process.env.OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key missing - returning fallback insight.');
    return res.json({
      insight: `Fallback: Based on your interest in ${assets || 'crypto'}, keep a long-term view and diversify positions.`
    });
  }

  try {
    // Create the prompt for the OpenRouter API request
    const payload = {
      model: 'openai/gpt-oss-120b:free',
      messages: [
        {
          role: 'user',
          content: `You are a crypto advisor. Write a short 2-3 sentence insight for a ${investor_type || 'crypto investor'} who is interested in ${assets || 'Bitcoin'}. Be specific and helpful.`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    };

    // Send the request to the OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        // post request
      method: 'POST',
      // the key and the content type
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      // the payload to string
      body: JSON.stringify(payload)
    });

    // Check if the response is ok
    if (!response.ok) {
      const text = await response.text().catch(() => '<no body>');
      console.error(`OpenRouter HTTP ${response.status}: ${text}`);
      throw new Error(`OpenRouter HTTP ${response.status}`);
    }

    // Parse the response as JSON
    const data = await response.json().catch(() => null);
    console.log('OpenRouter response:', JSON.stringify(data || {}));

    // Extract the insight from the response
    const insight =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      data?.output?.[0] ||
      data?.result?.[0]?.content ||
      data?.message ||
      (typeof data === 'string' ? data : null);

      // Fallback if no insight is found
    if (!insight) {
      console.warn('No insight extracted from OpenRouter response - returning fallback.');
      return res.json({
        insight: `Fallback: Based on your interest in ${assets || 'crypto'}, keep diversified exposure and review risk management.`
      });
    }

    // Respond with the insight + remove * and insight:
    res.json({ insight: insight.trim().replace(/\*+\*/g, '').replace(/^Insight:\s*/i, '') });
  } catch (err) {
    console.error('OpenRouter error:', err);
    res.json({
      insight: `Fallback: Based on your interest in ${assets || 'crypto'}, stay updated and manage risk carefully.`
    });
  }
});

// Get a random meme
router.get('/meme', authenticateToken, (req, res) => {
    // save the memes
  const memes = [
    { id: 1, url: 'https://i.imgflip.com/1bij.jpg', title: 'Buy the dip!' },
    { id: 2, url: 'https://i.imgflip.com/26am.jpg', title: 'To the moon!' },
    { id: 3, url: 'https://i.imgflip.com/1g8my4.jpg', title: 'HODL!' },
  ];
  // Select a random meme
  const randomMeme = memes[Math.floor(Math.random() * memes.length)];
  // Respond with the random meme
  res.json(randomMeme);
});

// Export the router
module.exports = router;