require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const fs = require('fs');
const path = require('path');

// Import route handlers
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const recoveryRoutes = require('./routes/recovery');
const sleepRoutes = require('./routes/sleep');
const workoutRoutes = require('./routes/workout');
const cycleRoutes = require('./routes/cycle');

// Set up logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'whoop-api-mcp' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Load MCP configuration
const mcpConfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../mcp.json'), 'utf8')
);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/recovery', recoveryRoutes);
app.use('/sleep', sleepRoutes);
app.use('/workout', workoutRoutes);
app.use('/cycle', cycleRoutes);

// MCP Discovery Endpoint
app.get('/.well-known/mcp.json', (req, res) => {
  res.json(mcpConfig);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: mcpConfig.name,
    version: mcpConfig.version,
    description: mcpConfig.description,
    endpoints: mcpConfig.endpoints.map(endpoint => ({
      name: endpoint.name,
      description: endpoint.description,
      url: endpoint.url,
      method: endpoint.http_method,
    }))
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: {
      message: 'An error occurred while processing your request',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    },
  });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Whoop API MCP server running on port ${PORT}`);
});

module.exports = app;
