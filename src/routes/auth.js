const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * @route   GET /auth/login
 * @desc    Redirect user to Whoop OAuth login page
 * @access  Public
 */
router.get('/login', (req, res) => {
  const clientId = process.env.WHOOP_CLIENT_ID;
  const redirectUri = process.env.WHOOP_REDIRECT_URI;
  const responseType = 'code';
  const scope = 'read:profile read:recovery read:sleep read:workout read:cycles';

  const authUrl = `https://api.prod.whoop.com/oauth/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
  
  res.redirect(authUrl);
});

/**
 * @route   GET /auth/callback
 * @desc    Handle OAuth callback from Whoop
 * @access  Public
 */
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ 
      error: 'Authorization code not provided' 
    });
  }

  try {
    const clientId = process.env.WHOOP_CLIENT_ID;
    const clientSecret = process.env.WHOOP_CLIENT_SECRET;
    const redirectUri = process.env.WHOOP_REDIRECT_URI;

    const tokenResponse = await axios.post('https://api.prod.whoop.com/oauth/oauth2/token', {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    });

    // Here you would typically store the tokens in a database
    // and associate them with the user's session
    
    // For now, we'll just return them in the response
    res.json({
      message: 'Authentication successful',
      access_token: tokenResponse.data.access_token,
      refresh_token: tokenResponse.data.refresh_token,
      expires_in: tokenResponse.data.expires_in
    });
  } catch (error) {
    console.error('Token exchange error:', error.response ? error.response.data : error.message);
    res.status(500).json({ 
      error: 'Failed to exchange authorization code for tokens',
      details: error.response ? error.response.data : error.message
    });
  }
});

/**
 * @route   POST /auth/refresh
 * @desc    Refresh access token
 * @access  Private
 */
router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  
  if (!refresh_token) {
    return res.status(400).json({ 
      error: 'Refresh token not provided' 
    });
  }

  try {
    const clientId = process.env.WHOOP_CLIENT_ID;
    const clientSecret = process.env.WHOOP_CLIENT_SECRET;

    const tokenResponse = await axios.post('https://api.prod.whoop.com/oauth/oauth2/token', {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token,
      grant_type: 'refresh_token'
    });

    res.json({
      message: 'Token refresh successful',
      access_token: tokenResponse.data.access_token,
      refresh_token: tokenResponse.data.refresh_token,
      expires_in: tokenResponse.data.expires_in
    });
  } catch (error) {
    console.error('Token refresh error:', error.response ? error.response.data : error.message);
    res.status(500).json({ 
      error: 'Failed to refresh access token',
      details: error.response ? error.response.data : error.message
    });
  }
});

module.exports = router;
