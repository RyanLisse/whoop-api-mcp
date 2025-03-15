# Whoop API MCP Server

An MCP (Mission Control Protocol) server for interacting with the Whoop API to retrieve fitness and health data.

## Overview

This MCP server provides a standardized interface for accessing Whoop fitness data through its API. It handles authentication, data retrieval, and formatting to make it easy to integrate Whoop data into your applications.

## Features

- OAuth 2.0 authentication with Whoop API
- User profile information
- Recovery data
- Sleep data
- Workout data
- Menstrual cycle tracking data
- MCP-compliant discovery endpoint
- Clean error handling and logging

## Prerequisites

- Node.js 16.x or higher
- Whoop developer account and API credentials
- [Register your app](https://developer.whoop.com/docs/developer/register-app) in the Whoop Developer Portal

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/RyanLisse/whoop-api-mcp.git
   cd whoop-api-mcp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your Whoop API credentials:
   ```
   WHOOP_CLIENT_ID=your_client_id_here
   WHOOP_CLIENT_SECRET=your_client_secret_here
   WHOOP_REDIRECT_URI=http://localhost:3000/auth/callback
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```

2. The MCP endpoint will be available at:
   ```
   http://localhost:3000/.well-known/mcp.json
   ```

3. To authenticate a user with Whoop, direct them to:
   ```
   http://localhost:3000/auth/login
   ```

4. After authentication, you'll receive access and refresh tokens to use with the API endpoints.

## Endpoints

- `GET /user` - Get user profile information
- `GET /user/membership` - Get user membership information
- `GET /recovery?start=YYYY-MM-DD&end=YYYY-MM-DD` - Get recovery data for a date range
- `GET /recovery/latest` - Get most recent recovery data
- `GET /sleep?start=YYYY-MM-DD&end=YYYY-MM-DD` - Get sleep data for a date range
- `GET /workout?start=YYYY-MM-DD&end=YYYY-MM-DD` - Get workout data for a date range
- `GET /cycle?start=YYYY-MM-DD&end=YYYY-MM-DD` - Get menstrual cycle data for a date range

## Whoop API Documentation

For more information about the Whoop API, refer to the [official Whoop API documentation](https://developer.whoop.com/docs/api).

## MCP Specification

This server follows the MCP (Mission Control Protocol) specification. The MCP discovery endpoint is available at `/.well-known/mcp.json`.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
