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
 * @route   GET /recovery
 * @desc    Get recovery data for a specific date range
 * @access  Private
 */
router.get('/', verifyToken, async (req, res) => {
  const { start, end } = req.query;
  
  if (!start || !end) {
    return res.status(400).json({ 
      error: 'Start and end dates are required',
      details: 'Please provide start and end dates in YYYY-MM-DD format'
    });
  }

  try {
    // Validate date format
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ 
        error: 'Invalid date format',
        details: 'Please provide dates in YYYY-MM-DD format'
      });
    }

    const response = await axios.get('https://api.prod.whoop.com/developer/v1/recovery', {
      headers: {
        'Authorization': `Bearer ${req.token}`,
        'Content-Type': 'application/json'
      },
      params: {
        start_date: start,
        end_date: end
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Recovery error:', error.response ? error.response.data : error.message);
    
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid or expired access token',
        details: error.response.data
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to retrieve recovery data',
      details: error.response ? error.response.data : error.message
    });
  }
});

/**
 * @route   GET /recovery/latest
 * @desc    Get most recent recovery data
 * @access  Private
 */
router.get('/latest', verifyToken, async (req, res) => {
  try {
    const response = await axios.get('https://api.prod.whoop.com/developer/v1/recovery/latest', {
      headers: {
        'Authorization': `Bearer ${req.token}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Latest recovery error:', error.response ? error.response.data : error.message);
    
    if (error.response && error.response.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid or expired access token',
        details: error.response.data
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to retrieve latest recovery data',
      details: error.response ? error.response.data : error.message
    });
  }
});

module.exports = router;
