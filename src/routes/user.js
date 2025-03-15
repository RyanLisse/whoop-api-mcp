const express = require('express');
const axios = require('axios');
const router = express.Router();

// Middleware to verify access token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  req.token = token;
  next();
};

/**
 * @route   GET /user
 * @desc    Get user profile information
 * @access  Private
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const response = await axios.get('https://api.prod.whoop.com/developer/v1/user/profile', {
      headers: {
        'Authorization': `Bearer ${req.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('User profile error:', error.response ? error.response.data : error.message);
    
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid or expired access token',
        details: error.response.data
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to retrieve user profile',
      details: error.response ? error.response.data : error.message
    });
  }
});

/**
 * @route   GET /user/membership
 * @desc    Get user membership information
 * @access  Private
 */
router.get('/membership', verifyToken, async (req, res) => {
  try {
    const response = await axios.get('https://api.prod.whoop.com/developer/v1/user/membership', {
      headers: {
        'Authorization': `Bearer ${req.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Membership error:', error.response ? error.response.data : error.message);
    
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid or expired access token',
        details: error.response.data
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to retrieve membership information',
      details: error.response ? error.response.data : error.message
    });
  }
});

module.exports = router;
