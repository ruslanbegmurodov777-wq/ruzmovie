# Ruzmovie - Full Stack Movie Streaming Platform

Ruzmovie is a full-stack movie streaming platform built with React (Frontend) and Node.js/Express (Backend).

## Project Structure

```
Ruzmovie/
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── ...
│
└── frontend/
    ├── src/
    ├── package.json
    └── build/
```

## Quick Start

### Development Mode

To run both frontend and backend in development mode simultaneously:

```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend API on http://localhost:5000

### Production Build

To build both frontend and backend for production:

```bash
npm run build
```

This will:
1. Build the React frontend application
2. Ensure all backend dependencies are installed

### Production Start

To start the production server (serves both API and frontend):

```bash
npm start
```

This will start the Node.js server on port 5000, which will:
1. Serve the API endpoints under `/api/*`
2. Serve the React frontend application for all other routes

## Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory:

```
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_DIALECT=mysql
DB_PORT=3306
```

### Frontend (.env)
Create a `.env` file in the `frontend` directory:

```
REACT_APP_API_URL=http://localhost:5000
```

## Deployment

The application can be deployed to any platform that supports Node.js applications. The production build serves the frontend static files directly from the Node.js server.

## API Endpoints

- `/api/v1/auth` - Authentication endpoints
- `/api/v1/admin` - Admin-only endpoints
- `/api/v1/videos` - Video management endpoints
- `/api/v1/users` - User management endpoints

## Available Scripts

In the project directory, you can run:

### `npm run build`
Builds the frontend app for production and ensures backend dependencies are installed.

### `npm start`
Runs the production server which serves both the API and frontend application.

### `npm run dev`
Runs both the frontend and backend in development mode.

### `npm test`
Launches the test runner in the interactive watch mode.